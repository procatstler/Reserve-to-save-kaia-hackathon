import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { R2SCampaign, MockUSDT } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("R2SCampaign", function () {
  let campaign: R2SCampaign;
  let usdt: MockUSDT;
  let owner: SignerWithAddress;
  let merchant: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let feeCollector: SignerWithAddress;
  let treasury: SignerWithAddress;

  beforeEach(async function () {
    [owner, merchant, user1, user2, feeCollector, treasury] = await ethers.getSigners();

    // Deploy mock USDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();

    // Deploy R2SCampaign
    const R2SCampaign = await ethers.getContractFactory("R2SCampaign");
    campaign = await upgrades.deployProxy(R2SCampaign, [
      owner.address,
      feeCollector.address,
      treasury.address
    ]) as unknown as R2SCampaign;
    await campaign.waitForDeployment();

    // Whitelist USDT
    await campaign.whitelistToken(await usdt.getAddress(), true);

    // Grant merchant role
    const MERCHANT_ROLE = await campaign.MERCHANT_ROLE();
    await campaign.grantRole(MERCHANT_ROLE, merchant.address);

    // Mint USDT to users
    await usdt.mint(user1.address, ethers.parseUnits("10000", 6));
    await usdt.mint(user2.address, ethers.parseUnits("10000", 6));

    // Approve campaign contract
    await usdt.connect(user1).approve(await campaign.getAddress(), ethers.MaxUint256);
    await usdt.connect(user2).approve(await campaign.getAddress(), ethers.MaxUint256);
  });

  describe("Campaign Creation", function () {
    it("Should create campaign correctly", async function () {
      const tx = await campaign.connect(merchant).createCampaign(
        "Test Campaign",
        "Test Description",
        "https://example.com/image.jpg",
        await usdt.getAddress(),
        ethers.parseUnits("10000", 6), // 10,000 USDT target
        ethers.parseUnits("100", 6),   // 100 USDT min
        ethers.parseUnits("1000", 6),  // 1,000 USDT max
        1000, // 10% discount
        30 * 24 * 60 * 60, // 30 days
        7 * 24 * 60 * 60   // 7 days settlement
      );

      const receipt = await tx.wait();
      const event = receipt?.logs.find((log: any) => {
        try {
          const parsed = campaign.interface.parseLog(log);
          return parsed?.name === "CampaignCreated";
        } catch {
          return false;
        }
      });
      
      expect(event).to.not.be.undefined;
      
      const campaignId = 0;
      const campaignData = await campaign.getCampaign(campaignId);
      
      expect(campaignData.title).to.equal("Test Campaign");
      expect(campaignData.merchant).to.equal(merchant.address);
      expect(campaignData.targetAmount).to.equal(ethers.parseUnits("10000", 6));
      expect(campaignData.discountRate).to.equal(1000);
    });

    it("Should reject invalid parameters", async function () {
      // Invalid token
      await expect(
        campaign.connect(merchant).createCampaign(
          "Test",
          "Description",
          "image.jpg",
          ethers.ZeroAddress,
          ethers.parseUnits("10000", 6),
          ethers.parseUnits("100", 6),
          ethers.parseUnits("1000", 6),
          1000,
          30 * 24 * 60 * 60,
          7 * 24 * 60 * 60
        )
      ).to.be.revertedWith("Token not whitelisted");

      // Invalid discount rate
      await expect(
        campaign.connect(merchant).createCampaign(
          "Test",
          "Description",
          "image.jpg",
          await usdt.getAddress(),
          ethers.parseUnits("10000", 6),
          ethers.parseUnits("100", 6),
          ethers.parseUnits("1000", 6),
          6000, // 60% - too high
          30 * 24 * 60 * 60,
          7 * 24 * 60 * 60
        )
      ).to.be.revertedWith("Discount rate too high");
    });
  });

  describe("Participation", function () {
    let campaignId: number;

    beforeEach(async function () {
      const tx = await campaign.connect(merchant).createCampaign(
        "Test Campaign",
        "Description",
        "image.jpg",
        await usdt.getAddress(),
        ethers.parseUnits("10000", 6),
        ethers.parseUnits("100", 6),
        ethers.parseUnits("1000", 6),
        1000, // 10% discount
        30 * 24 * 60 * 60,
        7 * 24 * 60 * 60
      );
      await tx.wait();
      campaignId = 0;
    });

    it("Should allow participation", async function () {
      const depositAmount = ethers.parseUnits("500", 6);
      
      await expect(
        campaign.connect(user1).participate(campaignId, depositAmount)
      ).to.emit(campaign, "ParticipationCreated")
        .withArgs(
          0, // participationId
          campaignId,
          user1.address,
          depositAmount,
          depositAmount * 1000n / 10000n // 10% discount
        );

      const campaignData = await campaign.getCampaign(campaignId);
      expect(campaignData.currentAmount).to.equal(depositAmount);
      expect(campaignData.totalParticipants).to.equal(1);
    });

    it("Should enforce deposit limits", async function () {
      // Below minimum
      await expect(
        campaign.connect(user1).participate(campaignId, ethers.parseUnits("50", 6))
      ).to.be.revertedWith("Below minimum deposit");

      // Above maximum
      await expect(
        campaign.connect(user1).participate(campaignId, ethers.parseUnits("2000", 6))
      ).to.be.revertedWith("Above maximum deposit");
    });

    it("Should handle multiple participations", async function () {
      await campaign.connect(user1).participate(campaignId, ethers.parseUnits("500", 6));
      await campaign.connect(user2).participate(campaignId, ethers.parseUnits("300", 6));

      const campaignData = await campaign.getCampaign(campaignId);
      expect(campaignData.currentAmount).to.equal(ethers.parseUnits("800", 6));
      expect(campaignData.totalParticipants).to.equal(2);
    });
  });

  describe("Settlement", function () {
    let campaignId: number;

    beforeEach(async function () {
      // Create campaign with short duration for testing
      const tx = await campaign.connect(merchant).createCampaign(
        "Test Campaign",
        "Description",
        "image.jpg",
        await usdt.getAddress(),
        ethers.parseUnits("10000", 6),
        ethers.parseUnits("100", 6),
        ethers.parseUnits("1000", 6),
        1000, // 10% discount
        10, // 10 seconds duration (enough time to participate)
        1  // 1 second settlement period
      );
      await tx.wait();
      campaignId = 0;

      // Participate
      await campaign.connect(user1).participate(campaignId, ethers.parseUnits("500", 6));
      await campaign.connect(user2).participate(campaignId, ethers.parseUnits("300", 6));
    });

    it("Should settle campaign correctly", async function () {
      // Wait for campaign to end
      await time.increase(12);

      const user1BalanceBefore = await usdt.balanceOf(user1.address);
      const user2BalanceBefore = await usdt.balanceOf(user2.address);
      const merchantBalanceBefore = await usdt.balanceOf(merchant.address);

      await campaign.connect(merchant).settleCampaign(campaignId);

      const user1BalanceAfter = await usdt.balanceOf(user1.address);
      const user2BalanceAfter = await usdt.balanceOf(user2.address);
      const merchantBalanceAfter = await usdt.balanceOf(merchant.address);

      // Users should receive their discounts
      expect(user1BalanceAfter - user1BalanceBefore).to.equal(
        ethers.parseUnits("50", 6) // 10% of 500
      );
      expect(user2BalanceAfter - user2BalanceBefore).to.equal(
        ethers.parseUnits("30", 6) // 10% of 300
      );

      // Merchant should receive funds minus discounts and fees
      const expectedMerchantAmount = ethers.parseUnits("800", 6) - // Total deposits
        ethers.parseUnits("80", 6) - // Total discounts
        ethers.parseUnits("20", 6) - // Platform fee (2.5%)
        ethers.parseUnits("8", 6);   // Merchant fee (1%)
      
      expect(merchantBalanceAfter - merchantBalanceBefore).to.be.closeTo(
        expectedMerchantAmount,
        ethers.parseUnits("1", 6)
      );

      const campaignData = await campaign.getCampaign(campaignId);
      expect(campaignData.status).to.equal(5); // Settled (enum value is 5)
    });
  });

  describe("Refunds", function () {
    let campaignId: number;
    let participationId: number;

    beforeEach(async function () {
      const tx = await campaign.connect(merchant).createCampaign(
        "Test Campaign",
        "Description",
        "image.jpg",
        await usdt.getAddress(),
        ethers.parseUnits("10000", 6),
        ethers.parseUnits("100", 6),
        ethers.parseUnits("1000", 6),
        1000,
        30 * 24 * 60 * 60,
        7 * 24 * 60 * 60
      );
      await tx.wait();
      campaignId = 0;

      await campaign.connect(user1).participate(campaignId, ethers.parseUnits("500", 6));
      participationId = 0;
    });

    it("Should process refund with penalty", async function () {
      const balanceBefore = await usdt.balanceOf(user1.address);
      
      await campaign.connect(user1).refund(participationId);
      
      const balanceAfter = await usdt.balanceOf(user1.address);
      const refundAmount = balanceAfter - balanceBefore;
      
      // Should receive 95% (5% penalty)
      expect(refundAmount).to.equal(ethers.parseUnits("475", 6));
      
      const participation = await campaign.getParticipation(participationId);
      expect(participation.isRefunded).to.be.true;
    });

    it("Should not allow double refund", async function () {
      await campaign.connect(user1).refund(participationId);
      
      await expect(
        campaign.connect(user1).refund(participationId)
      ).to.be.revertedWith("Already refunded");
    });
  });

  describe("Access Control", function () {
    it("Should enforce role-based access", async function () {
      // Only admin can pause
      await expect(
        campaign.connect(user1).pause()
      ).to.be.reverted;

      await campaign.connect(owner).pause();
      expect(await campaign.paused()).to.be.true;

      // Only admin can update fees
      await expect(
        campaign.connect(user1).updateFees(100, 100, 100)
      ).to.be.reverted;

      await campaign.connect(owner).unpause();
      await campaign.connect(owner).updateFees(100, 100, 100);
      expect(await campaign.platformFee()).to.equal(100);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow emergency withdraw", async function () {
      // Send some USDT to contract
      await usdt.transfer(await campaign.getAddress(), ethers.parseUnits("1000", 6));
      
      const balanceBefore = await usdt.balanceOf(owner.address);
      
      await campaign.connect(owner).emergencyWithdraw(
        await usdt.getAddress(),
        ethers.parseUnits("1000", 6)
      );
      
      const balanceAfter = await usdt.balanceOf(owner.address);
      expect(balanceAfter - balanceBefore).to.equal(ethers.parseUnits("1000", 6));
    });
  });
});