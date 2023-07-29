// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";

contract NFTMarketPlace is
    Initializable,
    ERC1155URIStorageUpgradeable,
    EIP712Upgradeable,
    ERC2981Upgradeable,
    OwnableUpgradeable
{
    struct nftVoucher {
        address nftAddress;
        address nftOwner;
        uint256 tokenId;
        uint256 counter;
        uint256 nftAmount;
        string tokenURI;
    }

    // Mapping for used counter numbers
    mapping(uint256 => bool) public usedCounters;

    // Mapping of the counter to the amount left in voucher
    mapping(uint256 => uint256) public amountLeft;

    // Mapping of the tokenId to the amount left in voucher
    mapping(uint256 => uint256) public supplyLeft;

    // Mapping of the tokenId to the totalSupply in voucher
    mapping(uint256 => uint256) public totalSupply;

    function initialize(string memory _URI) public initializer {
        __ERC1155_init_unchained(_URI);
        __ERC1155URIStorage_init_unchained();
        __Ownable_init();
        __EIP712_init("NFTMarketPlace", "1");
        __ERC2981_init_unchained();
    }

    function buyNft(
        nftVoucher memory _voucher,
        uint256 _amountToBuy,
        uint96 _royaltyFees,
        address _royaltyKeeper,
        address _redeemer,
        bool _isPrimary
    ) public onlyOwner {
        require(_voucher.nftAddress != address(0), "NACZ"); //NACZ : NFT address can't be zero address
        require(_voucher.nftAddress == address(this), "INA"); //INA : Invalid NFT address
        require(_voucher.nftOwner != address(0), "NOACZ"); //NOACZ : NFT owner address can't be zero address
        require(_redeemer != address(0), "RACZ"); //RACZ : Redeemer address can't be zero address
        require(_voucher.nftAmount > 0, "AGZ"); //AGZ : Amount should be greater than zero
        require(_amountToBuy > 0, "ATSGZ"); //ATSGZ : Amount to buy should be greater than zero
        require(_voucher.nftAmount >= _amountToBuy, "TSGAB"); //TSGAB : Total amount should be greater than amount to buy
        if (_isPrimary) {
            if (totalSupply[_voucher.tokenId] != 0) {
                require(supplyLeft[_voucher.tokenId] >= _amountToBuy, "ANL"); // ANL : Amount Not left
            }
        }
        setCounter(_voucher, _amountToBuy);
        if (_isPrimary) {
            // In case not to add total supply again if user going to buy another copy
            if (totalSupply[_voucher.tokenId] == 0) {
                totalSupply[_voucher.tokenId] = _voucher.nftAmount;
                supplyLeft[_voucher.tokenId] = _voucher.nftAmount;
            }
            supplyLeft[_voucher.tokenId] -= _amountToBuy; //tbc

            _mint(msg.sender, _voucher.tokenId, _amountToBuy, "");
            _setURI(_voucher.tokenId, _voucher.tokenURI);
            if (_royaltyKeeper != address(0)) {
                _setTokenRoyalty(
                    _voucher.tokenId,
                    _royaltyKeeper,
                    _royaltyFees
                );
            }
        }
        _safeTransferFrom(
            _voucher.nftOwner,
            _redeemer,
            _voucher.tokenId,
            _amountToBuy,
            ""
        );
    }

    function setCounter(
        nftVoucher memory seller,
        uint256 amountToBuy
    ) internal {
        //Counter used
        require(!usedCounters[seller.counter], "CU");

        uint256 leftCounter = amountLeft[seller.counter];

        if (leftCounter == 0) {
            leftCounter = seller.nftAmount - amountToBuy;
        } else {
            leftCounter = leftCounter - amountToBuy;
        }
        require(leftCounter >= 0, "ALZ"); //Amount left less than zero

        amountLeft[seller.counter] = leftCounter;
        if (leftCounter == 0) usedCounters[seller.counter] = true;
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC2981Upgradeable, ERC1155Upgradeable)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981Upgradeable).interfaceId ||
            interfaceId == type(IERC1155Upgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
