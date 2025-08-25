import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { MockUSDT } from "../typechain-types";

describe("MockUSDT", function () {
  let mockUSDT: MockUSDT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await mockUSDT.name()).to.equal("Mock USDT");
      expect(await mockUSDT.symbol()).to.equal("mUSDT");
    });

    it("Should have 6 decimals", async function () {
      expect(await mockUSDT.decimals()).to.equal(6);
    });

    it("Should have correct initial supply", async function () {
      const expectedSupply = ethers.parseUnits("1000000000", 6); // 1 billion USDT
      expect(await mockUSDT.totalSupply()).to.equal(expectedSupply);
      expect(await mockUSDT.balanceOf(owner.address)).to.equal(expectedSupply);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await mockUSDT.mint(addr1.address, mintAmount);
      expect(await mockUSDT.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should increase total supply when minting", async function () {
      const initialSupply = await mockUSDT.totalSupply();
      const mintAmount = ethers.parseUnits("1000", 6);
      await mockUSDT.mint(addr1.address, mintAmount);
      expect(await mockUSDT.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await expect(
        mockUSDT.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(mockUSDT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      const amount = ethers.parseUnits("1000", 6);
      await mockUSDT.mint(addr1.address, amount);
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 6);
      await mockUSDT.connect(addr1).transfer(addr2.address, transferAmount);
      
      expect(await mockUSDT.balanceOf(addr1.address)).to.equal(
        ethers.parseUnits("900", 6)
      );
      expect(await mockUSDT.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialBalance = await mockUSDT.balanceOf(addr1.address);
      await expect(
        mockUSDT.connect(addr1).transfer(addr2.address, initialBalance + 1n)
      ).to.be.revertedWithCustomError(mockUSDT, "ERC20InsufficientBalance");
    });

    it("Should emit Transfer event", async function () {
      const transferAmount = ethers.parseUnits("100", 6);
      await expect(
        mockUSDT.connect(addr1).transfer(addr2.address, transferAmount)
      )
        .to.emit(mockUSDT, "Transfer")
        .withArgs(addr1.address, addr2.address, transferAmount);
    });
  });

  describe("Allowances", function () {
    const amount = ethers.parseUnits("100", 6);

    it("Should approve spending", async function () {
      await mockUSDT.connect(addr1).approve(addr2.address, amount);
      expect(await mockUSDT.allowance(addr1.address, addr2.address)).to.equal(amount);
    });

    it("Should transfer tokens using allowance", async function () {
      await mockUSDT.mint(addr1.address, amount);
      await mockUSDT.connect(addr1).approve(addr2.address, amount);

      await mockUSDT.connect(addr2).transferFrom(addr1.address, addr2.address, amount);
      expect(await mockUSDT.balanceOf(addr2.address)).to.equal(amount);
      expect(await mockUSDT.allowance(addr1.address, addr2.address)).to.equal(0);
    });

    it("Should emit Approval event", async function () {
      await expect(mockUSDT.connect(addr1).approve(addr2.address, amount))
        .to.emit(mockUSDT, "Approval")
        .withArgs(addr1.address, addr2.address, amount);
    });
  });

  describe("Burn", function () {
    beforeEach(async function () {
      const amount = ethers.parseUnits("1000", 6);
      await mockUSDT.mint(addr1.address, amount);
    });

    it("Should allow users to burn their tokens", async function () {
      const burnAmount = ethers.parseUnits("100", 6);
      const initialBalance = await mockUSDT.balanceOf(addr1.address);
      const initialSupply = await mockUSDT.totalSupply();

      await mockUSDT.connect(addr1).burn(burnAmount);

      expect(await mockUSDT.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
      expect(await mockUSDT.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should not allow burning more than balance", async function () {
      const balance = await mockUSDT.balanceOf(addr1.address);
      await expect(
        mockUSDT.connect(addr1).burn(balance + 1n)
      ).to.be.revertedWithCustomError(mockUSDT, "ERC20InsufficientBalance");
    });
  });
});