// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title R2SCampaign
 * @notice Main contract for Reserve-to-Save campaigns
 * @dev Implements escrow, rebate calculation, and settlement logic
 */
contract R2SCampaign is 
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable
{
    using SafeERC20 for IERC20;

    // =============================================================
    //                          CONSTANTS
    // =============================================================
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MIN_DEPOSIT = 1e6; // 1 USDT (6 decimals)
    uint256 public constant MAX_DEPOSIT = 1000000e6; // 1M USDT
    
    // =============================================================
    //                          STORAGE
    // =============================================================
    
    struct Campaign {
        uint256 id;
        string title;
        string description;
        string imageUrl;
        address merchant;
        address token;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 minDeposit;
        uint256 maxDeposit;
        uint256 discountRate; // in basis points
        uint256 startTime;
        uint256 endTime;
        uint256 settlementDate;
        uint256 totalParticipants;
        uint256 totalSettled;
        CampaignStatus status;
        bool isVerified;
    }
    
    struct Participation {
        address participant;
        uint256 campaignId;
        uint256 depositAmount;
        uint256 depositTime;
        uint256 expectedDiscount;
        uint256 actualDiscount;
        uint256 settlementAmount;
        bool isSettled;
        bool isRefunded;
        ParticipationStatus status;
    }
    
    enum CampaignStatus {
        Draft,
        Pending,
        Active,
        Completed,
        Settling,
        Settled,
        Cancelled
    }
    
    enum ParticipationStatus {
        Active,
        Settled,
        Refunded,
        Cancelled
    }
    
    // State variables
    uint256 public nextCampaignId;
    uint256 public nextParticipationId;
    
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Participation) public participations;
    mapping(uint256 => uint256[]) public campaignParticipations;
    mapping(address => uint256[]) public userParticipations;
    mapping(address => uint256[]) public merchantCampaigns;
    mapping(uint256 => mapping(address => uint256)) public userCampaignDeposit;
    
    // Fee configuration
    address public feeCollector;
    address public treasury;
    uint256 public platformFee;
    uint256 public merchantFee;
    uint256 public earlyWithdrawPenalty;
    
    // Security
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public whitelistedTokens;
    
    // =============================================================
    //                          EVENTS
    // =============================================================
    
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed merchant,
        string title,
        uint256 targetAmount,
        uint256 discountRate,
        uint256 startTime,
        uint256 endTime
    );
    
    event CampaignUpdated(
        uint256 indexed campaignId,
        CampaignStatus status
    );
    
    event ParticipationCreated(
        uint256 indexed participationId,
        uint256 indexed campaignId,
        address indexed participant,
        uint256 amount,
        uint256 expectedDiscount
    );
    
    event ParticipationSettled(
        uint256 indexed participationId,
        uint256 indexed campaignId,
        address indexed participant,
        uint256 settlementAmount,
        uint256 discount
    );
    
    event RefundProcessed(
        uint256 indexed participationId,
        uint256 indexed campaignId,
        address indexed participant,
        uint256 amount
    );
    
    event FeeCollected(
        uint256 indexed campaignId,
        uint256 platformFee,
        uint256 merchantFee
    );
    
    event EmergencyWithdraw(
        address indexed user,
        uint256 amount
    );
    
    // =============================================================
    //                          MODIFIERS
    // =============================================================
    
    modifier notBlacklisted(address _account) {
        require(!blacklisted[_account], "Account is blacklisted");
        _;
    }
    
    modifier onlyMerchant(uint256 _campaignId) {
        require(
            campaigns[_campaignId].merchant == msg.sender ||
            hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized merchant"
        );
        _;
    }
    
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < nextCampaignId, "Campaign does not exist");
        _;
    }
    
    modifier campaignActive(uint256 _campaignId) {
        Campaign memory campaign = campaigns[_campaignId];
        require(
            campaign.status == CampaignStatus.Active &&
            block.timestamp >= campaign.startTime &&
            block.timestamp <= campaign.endTime,
            "Campaign not active"
        );
        _;
    }
    
    // =============================================================
    //                      INITIALIZATION
    // =============================================================
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(
        address _admin,
        address _feeCollector,
        address _treasury
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        
        feeCollector = _feeCollector;
        treasury = _treasury;
        
        // Default fee configuration (basis points)
        platformFee = 250; // 2.5%
        merchantFee = 100; // 1%
        earlyWithdrawPenalty = 500; // 5%
    }
    
    // =============================================================
    //                    CAMPAIGN MANAGEMENT
    // =============================================================
    
    /**
     * @notice Create a new campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _imageUrl Campaign image URL
     * @param _token Token address for deposits (USDT)
     * @param _targetAmount Target amount to raise
     * @param _minDeposit Minimum deposit per user
     * @param _maxDeposit Maximum deposit per user
     * @param _discountRate Discount rate in basis points
     * @param _duration Campaign duration in seconds
     * @param _settlementPeriod Settlement period after campaign ends
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        address _token,
        uint256 _targetAmount,
        uint256 _minDeposit,
        uint256 _maxDeposit,
        uint256 _discountRate,
        uint256 _duration,
        uint256 _settlementPeriod
    ) external whenNotPaused notBlacklisted(msg.sender) returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(whitelistedTokens[_token], "Token not whitelisted");
        require(_targetAmount > 0, "Invalid target amount");
        require(_minDeposit >= MIN_DEPOSIT, "Min deposit too low");
        require(_maxDeposit <= MAX_DEPOSIT, "Max deposit too high");
        require(_minDeposit <= _maxDeposit, "Invalid deposit range");
        require(_discountRate <= 5000, "Discount rate too high"); // Max 50%
        require(_duration >= 1 && _duration <= 90 days, "Invalid duration");
        require(_settlementPeriod >= 1 && _settlementPeriod <= 30 days, "Invalid settlement period");
        
        uint256 campaignId = nextCampaignId++;
        
        Campaign storage campaign = campaigns[campaignId];
        campaign.id = campaignId;
        campaign.title = _title;
        campaign.description = _description;
        campaign.imageUrl = _imageUrl;
        campaign.merchant = msg.sender;
        campaign.token = _token;
        campaign.targetAmount = _targetAmount;
        campaign.minDeposit = _minDeposit;
        campaign.maxDeposit = _maxDeposit;
        campaign.discountRate = _discountRate;
        campaign.startTime = block.timestamp;
        campaign.endTime = block.timestamp + _duration;
        campaign.settlementDate = campaign.endTime + _settlementPeriod;
        campaign.status = CampaignStatus.Active;
        campaign.isVerified = hasRole(MERCHANT_ROLE, msg.sender);
        
        merchantCampaigns[msg.sender].push(campaignId);
        
        emit CampaignCreated(
            campaignId,
            msg.sender,
            _title,
            _targetAmount,
            _discountRate,
            campaign.startTime,
            campaign.endTime
        );
        
        return campaignId;
    }
    
    /**
     * @notice Update campaign status
     * @param _campaignId Campaign ID
     * @param _status New status
     */
    function updateCampaignStatus(
        uint256 _campaignId,
        CampaignStatus _status
    ) external onlyRole(OPERATOR_ROLE) campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        campaign.status = _status;
        
        emit CampaignUpdated(_campaignId, _status);
    }
    
    /**
     * @notice Verify a campaign
     * @param _campaignId Campaign ID
     */
    function verifyCampaign(
        uint256 _campaignId
    ) external onlyRole(ADMIN_ROLE) campaignExists(_campaignId) {
        campaigns[_campaignId].isVerified = true;
    }
    
    // =============================================================
    //                      PARTICIPATION
    // =============================================================
    
    /**
     * @notice Participate in a campaign by depositing tokens
     * @param _campaignId Campaign ID
     * @param _amount Deposit amount
     */
    function participate(
        uint256 _campaignId,
        uint256 _amount
    ) external nonReentrant whenNotPaused notBlacklisted(msg.sender) campaignActive(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(_amount >= campaign.minDeposit, "Below minimum deposit");
        require(_amount <= campaign.maxDeposit, "Above maximum deposit");
        
        uint256 existingDeposit = userCampaignDeposit[_campaignId][msg.sender];
        require(existingDeposit + _amount <= campaign.maxDeposit, "Exceeds max deposit per user");
        
        // Transfer tokens from user
        IERC20(campaign.token).safeTransferFrom(msg.sender, address(this), _amount);
        
        // Calculate expected discount
        uint256 expectedDiscount = (_amount * campaign.discountRate) / BASIS_POINTS;
        
        // Create participation record
        uint256 participationId = nextParticipationId++;
        Participation storage participation = participations[participationId];
        participation.participant = msg.sender;
        participation.campaignId = _campaignId;
        participation.depositAmount = _amount;
        participation.depositTime = block.timestamp;
        participation.expectedDiscount = expectedDiscount;
        participation.status = ParticipationStatus.Active;
        
        // Update mappings
        campaignParticipations[_campaignId].push(participationId);
        userParticipations[msg.sender].push(participationId);
        userCampaignDeposit[_campaignId][msg.sender] += _amount;
        
        // Update campaign stats
        campaign.currentAmount += _amount;
        campaign.totalParticipants++;
        
        emit ParticipationCreated(
            participationId,
            _campaignId,
            msg.sender,
            _amount,
            expectedDiscount
        );
    }
    
    /**
     * @notice Batch participate for multiple users (for backend integration)
     * @param _campaignId Campaign ID
     * @param _participants Array of participant addresses
     * @param _amounts Array of deposit amounts
     */
    function batchParticipate(
        uint256 _campaignId,
        address[] calldata _participants,
        uint256[] calldata _amounts
    ) external onlyRole(OPERATOR_ROLE) campaignActive(_campaignId) {
        require(_participants.length == _amounts.length, "Arrays length mismatch");
        require(_participants.length <= 100, "Too many participants");
        
        Campaign storage campaign = campaigns[_campaignId];
        
        for (uint256 i = 0; i < _participants.length; i++) {
            address participant = _participants[i];
            uint256 amount = _amounts[i];
            
            if (blacklisted[participant]) continue;
            if (amount < campaign.minDeposit || amount > campaign.maxDeposit) continue;
            
            uint256 existingDeposit = userCampaignDeposit[_campaignId][participant];
            if (existingDeposit + amount > campaign.maxDeposit) continue;
            
            // Transfer tokens
            IERC20(campaign.token).safeTransferFrom(participant, address(this), amount);
            
            // Create participation
            uint256 expectedDiscount = (amount * campaign.discountRate) / BASIS_POINTS;
            uint256 participationId = nextParticipationId++;
            
            Participation storage participation = participations[participationId];
            participation.participant = participant;
            participation.campaignId = _campaignId;
            participation.depositAmount = amount;
            participation.depositTime = block.timestamp;
            participation.expectedDiscount = expectedDiscount;
            participation.status = ParticipationStatus.Active;
            
            campaignParticipations[_campaignId].push(participationId);
            userParticipations[participant].push(participationId);
            userCampaignDeposit[_campaignId][participant] += amount;
            
            campaign.currentAmount += amount;
            campaign.totalParticipants++;
            
            emit ParticipationCreated(
                participationId,
                _campaignId,
                participant,
                amount,
                expectedDiscount
            );
        }
    }
    
    // =============================================================
    //                       SETTLEMENT
    // =============================================================
    
    /**
     * @notice Settle a campaign after it ends
     * @param _campaignId Campaign ID
     */
    function settleCampaign(
        uint256 _campaignId
    ) external nonReentrant onlyMerchant(_campaignId) campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(
            campaign.status == CampaignStatus.Completed ||
            (campaign.status == CampaignStatus.Active && block.timestamp > campaign.endTime),
            "Campaign not ready for settlement"
        );
        require(block.timestamp >= campaign.settlementDate, "Settlement date not reached");
        
        campaign.status = CampaignStatus.Settling;
        
        uint256[] memory participationIds = campaignParticipations[_campaignId];
        uint256 totalPlatformFee = 0;
        uint256 totalMerchantFee = 0;
        uint256 totalMerchantAmount = 0;
        
        for (uint256 i = 0; i < participationIds.length; i++) {
            uint256 participationId = participationIds[i];
            Participation storage participation = participations[participationId];
            
            if (participation.isSettled || participation.isRefunded) continue;
            
            // Calculate fees
            uint256 platformFeeAmount = (participation.depositAmount * platformFee) / BASIS_POINTS;
            uint256 merchantFeeAmount = (participation.depositAmount * merchantFee) / BASIS_POINTS;
            
            // Calculate settlement amount (deposit - discount - fees)
            uint256 settlementAmount = participation.depositAmount -
                participation.expectedDiscount -
                platformFeeAmount -
                merchantFeeAmount;
            
            participation.actualDiscount = participation.expectedDiscount;
            participation.settlementAmount = settlementAmount;
            participation.isSettled = true;
            participation.status = ParticipationStatus.Settled;
            
            totalPlatformFee += platformFeeAmount;
            totalMerchantFee += merchantFeeAmount;
            totalMerchantAmount += settlementAmount;
            
            // Return discount to participant
            IERC20(campaign.token).safeTransfer(
                participation.participant,
                participation.expectedDiscount
            );
            
            emit ParticipationSettled(
                participationId,
                _campaignId,
                participation.participant,
                settlementAmount,
                participation.expectedDiscount
            );
            
            campaign.totalSettled++;
        }
        
        // Transfer fees
        if (totalPlatformFee > 0) {
            IERC20(campaign.token).safeTransfer(feeCollector, totalPlatformFee);
        }
        if (totalMerchantFee > 0) {
            IERC20(campaign.token).safeTransfer(treasury, totalMerchantFee);
        }
        
        // Transfer remaining to merchant
        if (totalMerchantAmount > 0) {
            IERC20(campaign.token).safeTransfer(campaign.merchant, totalMerchantAmount);
        }
        
        campaign.status = CampaignStatus.Settled;
        
        emit FeeCollected(_campaignId, totalPlatformFee, totalMerchantFee);
        emit CampaignUpdated(_campaignId, CampaignStatus.Settled);
    }
    
    /**
     * @notice Process refund for a participation
     * @param _participationId Participation ID
     */
    function refund(
        uint256 _participationId
    ) external nonReentrant whenNotPaused {
        Participation storage participation = participations[_participationId];
        Campaign storage campaign = campaigns[participation.campaignId];
        
        require(
            participation.participant == msg.sender ||
            hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        require(!participation.isSettled, "Already settled");
        require(!participation.isRefunded, "Already refunded");
        require(
            campaign.status == CampaignStatus.Cancelled ||
            (campaign.status == CampaignStatus.Active && block.timestamp < campaign.endTime),
            "Refund not available"
        );
        
        uint256 refundAmount = participation.depositAmount;
        
        // Apply early withdraw penalty if campaign is still active
        if (campaign.status == CampaignStatus.Active) {
            uint256 penalty = (refundAmount * earlyWithdrawPenalty) / BASIS_POINTS;
            refundAmount = refundAmount - penalty;
            
            // Send penalty to treasury
            if (penalty > 0) {
                IERC20(campaign.token).safeTransfer(treasury, penalty);
            }
        }
        
        participation.isRefunded = true;
        participation.status = ParticipationStatus.Refunded;
        
        // Update campaign stats
        campaign.currentAmount = campaign.currentAmount - participation.depositAmount;
        userCampaignDeposit[participation.campaignId][participation.participant] = 0;
        
        // Transfer refund
        IERC20(campaign.token).safeTransfer(participation.participant, refundAmount);
        
        emit RefundProcessed(
            _participationId,
            participation.campaignId,
            participation.participant,
            refundAmount
        );
    }
    
    /**
     * @notice Batch refund for multiple participations
     * @param _participationIds Array of participation IDs
     */
    function batchRefund(
        uint256[] calldata _participationIds
    ) external onlyRole(OPERATOR_ROLE) nonReentrant {
        for (uint256 i = 0; i < _participationIds.length; i++) {
            uint256 participationId = _participationIds[i];
            Participation storage participation = participations[participationId];
            Campaign storage campaign = campaigns[participation.campaignId];
            
            if (participation.isSettled || participation.isRefunded) continue;
            if (campaign.status != CampaignStatus.Cancelled) continue;
            
            participation.isRefunded = true;
            participation.status = ParticipationStatus.Refunded;
            
            campaign.currentAmount = campaign.currentAmount - participation.depositAmount;
            userCampaignDeposit[participation.campaignId][participation.participant] = 0;
            
            IERC20(campaign.token).safeTransfer(
                participation.participant,
                participation.depositAmount
            );
            
            emit RefundProcessed(
                participationId,
                participation.campaignId,
                participation.participant,
                participation.depositAmount
            );
        }
    }
    
    // =============================================================
    //                    ADMIN FUNCTIONS
    // =============================================================
    
    /**
     * @notice Update fee configuration
     * @param _platformFee New platform fee in basis points
     * @param _merchantFee New merchant fee in basis points
     * @param _earlyWithdrawPenalty New early withdraw penalty in basis points
     */
    function updateFees(
        uint256 _platformFee,
        uint256 _merchantFee,
        uint256 _earlyWithdrawPenalty
    ) external onlyRole(ADMIN_ROLE) {
        require(_platformFee <= 1000, "Platform fee too high"); // Max 10%
        require(_merchantFee <= 500, "Merchant fee too high"); // Max 5%
        require(_earlyWithdrawPenalty <= 1000, "Penalty too high"); // Max 10%
        
        platformFee = _platformFee;
        merchantFee = _merchantFee;
        earlyWithdrawPenalty = _earlyWithdrawPenalty;
    }
    
    /**
     * @notice Update fee addresses
     * @param _feeCollector New fee collector address
     * @param _treasury New treasury address
     */
    function updateFeeAddresses(
        address _feeCollector,
        address _treasury
    ) external onlyRole(ADMIN_ROLE) {
        require(_feeCollector != address(0), "Invalid fee collector");
        require(_treasury != address(0), "Invalid treasury");
        
        feeCollector = _feeCollector;
        treasury = _treasury;
    }
    
    /**
     * @notice Whitelist a token for campaigns
     * @param _token Token address
     * @param _whitelisted Whitelist status
     */
    function whitelistToken(
        address _token,
        bool _whitelisted
    ) external onlyRole(ADMIN_ROLE) {
        whitelistedTokens[_token] = _whitelisted;
    }
    
    /**
     * @notice Blacklist an address
     * @param _account Account to blacklist
     * @param _blacklisted Blacklist status
     */
    function blacklistAccount(
        address _account,
        bool _blacklisted
    ) external onlyRole(ADMIN_ROLE) {
        blacklisted[_account] = _blacklisted;
    }
    
    /**
     * @notice Pause the contract
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Emergency withdraw tokens
     * @param _token Token address
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(
        address _token,
        uint256 _amount
    ) external onlyRole(ADMIN_ROLE) {
        IERC20(_token).safeTransfer(msg.sender, _amount);
        emit EmergencyWithdraw(msg.sender, _amount);
    }
    
    // =============================================================
    //                      VIEW FUNCTIONS
    // =============================================================
    
    /**
     * @notice Get campaign details
     * @param _campaignId Campaign ID
     */
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        return campaigns[_campaignId];
    }
    
    /**
     * @notice Get participation details
     * @param _participationId Participation ID
     */
    function getParticipation(uint256 _participationId) external view returns (Participation memory) {
        return participations[_participationId];
    }
    
    /**
     * @notice Get campaign participations
     * @param _campaignId Campaign ID
     */
    function getCampaignParticipations(uint256 _campaignId) external view returns (uint256[] memory) {
        return campaignParticipations[_campaignId];
    }
    
    /**
     * @notice Get user participations
     * @param _user User address
     */
    function getUserParticipations(address _user) external view returns (uint256[] memory) {
        return userParticipations[_user];
    }
    
    /**
     * @notice Get merchant campaigns
     * @param _merchant Merchant address
     */
    function getMerchantCampaigns(address _merchant) external view returns (uint256[] memory) {
        return merchantCampaigns[_merchant];
    }
    
    /**
     * @notice Get campaign statistics
     * @param _campaignId Campaign ID
     */
    function getCampaignStats(uint256 _campaignId) external view returns (
        uint256 totalParticipants,
        uint256 totalDeposited,
        uint256 averageDeposit,
        uint256 completionRate
    ) {
        Campaign memory campaign = campaigns[_campaignId];
        totalParticipants = campaign.totalParticipants;
        totalDeposited = campaign.currentAmount;
        
        if (totalParticipants > 0) {
            averageDeposit = totalDeposited / totalParticipants;
        }
        
        if (campaign.targetAmount > 0) {
            completionRate = (totalDeposited * 10000) / campaign.targetAmount;
        }
    }
    
    /**
     * @notice Check if campaign is active
     * @param _campaignId Campaign ID
     */
    function isCampaignActive(uint256 _campaignId) external view returns (bool) {
        Campaign memory campaign = campaigns[_campaignId];
        return campaign.status == CampaignStatus.Active &&
               block.timestamp >= campaign.startTime &&
               block.timestamp <= campaign.endTime;
    }
    
    // =============================================================
    //                    UPGRADE FUNCTIONS
    // =============================================================
    
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}
    
    /**
     * @notice Get implementation version
     */
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}