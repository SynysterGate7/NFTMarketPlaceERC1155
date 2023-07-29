import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { NFTMarketPlace, NFTMarketPlace__factory } from "../typechain-types";

describe("NFT MarketPlace", () => {
  let NFTMarketPlace: NFTMarketPlace;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  let voucher: any;
  let zeroAddress = "0x0000000000000000000000000000000000000000";

  beforeEach("NFT MarketPlace deployment", async () => {
    [owner, user1, user2] = await ethers.getSigners();
    NFTMarketPlace = await new NFTMarketPlace__factory(owner).deploy();
    await NFTMarketPlace.connect(owner).initialize("TEST_URI");
    voucher = {
      nftAddress: NFTMarketPlace.address,
      nftOwner: owner.address,
      tokenId: 1,
      counter: 1,
      nftAmount: 10,
      tokenURI: "",
    };
  });

  describe("Check Initializer", async () => {
    it("should not initialize twice", async () => {
      await expect(
        NFTMarketPlace.connect(owner).initialize("TEST_URI")
      ).to.be.revertedWith("Initializable: contract is already initialized");
    });
  });

  describe("buyNft", () => {
    it("REVERT:should revert if owner not calling this functions", async () => {
      await expect(
        NFTMarketPlace.connect(user1).buyNft(
          voucher,
          1,
          1,
          user1.address,
          user1.address,
          true
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("should buy nft", async () => {
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        1,
        1,
        user1.address,
        user1.address,
        true
      );
      expect(
        await NFTMarketPlace.connect(owner).totalSupply(voucher.tokenId)
      ).to.be.equal(10);
    });
    it("should decrease supply", async () => {
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        1,
        1,
        user1.address,
        user1.address,
        true
      );
      expect(
        await NFTMarketPlace.connect(owner).supplyLeft(voucher.tokenId)
      ).to.be.equal(9);
    });
    it("should decrease counter supply", async () => {
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        1,
        1,
        user1.address,
        user1.address,
        true
      );
      expect(
        await NFTMarketPlace.connect(owner).amountLeft(voucher.tokenId)
      ).to.be.equal(9);
    });
    it("should not set roaylity if royality address is zero", async () => {
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        1,
        1,
        zeroAddress,
        user1.address,
        true
      );
    });
    it("should direct transfer if its already minted,", async () => {
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        1,
        1,
        user1.address,
        user1.address,
        true
      );
      await NFTMarketPlace.connect(user1).setApprovalForAll(
        NFTMarketPlace.address,
        true
      );
      voucher = { ...voucher, nftOwner: user1.address };
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        1,
        0,
        user1.address,
        user2.address,
        false
      );
    });
    it("should mint with another supply if its zero ", async () => {
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        5,
        1,
        user1.address,
        user1.address,
        true
      );
      voucher = { ...voucher, counter: 2 };
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        3,
        1,
        user1.address,
        user1.address,
        true
      );
    });

    it("REVERT:-should revert if NFT owner address is zero address", async () => {
      voucher = { ...voucher, nftOwner: zeroAddress };
      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          1,
          1,
          user1.address,
          user1.address,
          true
        )
      ).to.be.revertedWith("NOACZ");
    });
    it("REVERT:-should revert if NFT address is zero address", async () => {
      voucher = { ...voucher, nftAddress: zeroAddress };
      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          1,
          1,
          user1.address,
          user1.address,
          true
        )
      ).to.be.revertedWith("NACZ");
    });

    it("REVERT:-should revert if NFT address is not NFTMarketPlace Contract address", async () => {
      voucher = { ...voucher, nftAddress: user2.address };
      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          1,
          1,
          user1.address,
          user1.address,
          true
        )
      ).to.be.revertedWith("INA");
    });

    it("REVERT:-should revert if redeemer address is zero address", async () => {
      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          1,
          1,
          user1.address,
          zeroAddress,
          true
        )
      ).to.be.revertedWith("RACZ");
    });

    it("REVERT:-should revert if NFT amount is zero", async () => {
      voucher = { ...voucher, nftAmount: 0 };
      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          1,
          1,
          user1.address,
          user1.address,
          true
        )
      ).to.be.revertedWith("AGZ");
    });

    it("REVERT:-should revert if amount to buy exceeding supply", async () => {
      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          11,
          1,
          user1.address,
          user1.address,
          true
        )
      ).to.be.revertedWith("TSGAB");
    });

    it("REVERT:-should revert if amount to buy exceeding supply in primary", async () => {
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        2,
        1,
        user1.address,
        user1.address,
        true
      );

      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          9,
          1,
          user1.address,
          user1.address,
          true
        )
      ).to.be.revertedWith("ANL");
    });

    it("REVERT:-should revert if amount to buy is equals to zero", async () => {
      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          0,
          1,
          user1.address,
          user1.address,
          true
        )
      ).to.be.revertedWith("ATSGZ");
    });
  });

  describe("setCounter", () => {
    it("REVERT:-should revert if counter is used", async () => {
      voucher = { ...voucher, nftAmount: 1 };
      await NFTMarketPlace.connect(owner).buyNft(
        voucher,
        1,
        1,
        user1.address,
        user1.address,
        true
      );
      await NFTMarketPlace.connect(user1).setApprovalForAll(
        owner.address,
        true
      );
      await expect(
        NFTMarketPlace.connect(owner).buyNft(
          voucher,
          1,
          1,
          user1.address,
          user2.address,
          false
        )
      ).to.be.revertedWith("CU");
    });
  });

  describe("Support Interface", () => {
    it("should return true", async () => {
      expect(
        await NFTMarketPlace.connect(owner).supportsInterface("0x2a55205a")
      ).to.be.equal(true);
      expect(
        await NFTMarketPlace.connect(owner).supportsInterface("0xd9b67a26")
      ).to.be.equal(true);
      expect(
        await NFTMarketPlace.connect(owner).supportsInterface("0x01ffc9a7")
      ).to.be.equal(true);
    });
    it("should return false", async () => {
      expect(
        await NFTMarketPlace.connect(owner).supportsInterface("0x2a57205a")
      ).to.be.equal(false);
      expect(
        await NFTMarketPlace.connect(owner).supportsInterface("0x80ac76cd")
      ).to.be.equal(false);
      expect(
        await NFTMarketPlace.connect(owner).supportsInterface("0x03ffc9a7")
      ).to.be.equal(false);
    });
  });
});
