# NFTMarketPlaceERC1155

The ERC-1155 NFT Marketplace Contract is a decentralized application that facilitates the buying and selling of unique digital assets known as Non-Fungible Tokens (NFTs) based on the ERC-1155 standard. NFTs represent ownership of digital items, such as art, collectibles, virtual real estate, and more, and they are indivisible and unique.

## Features

- ERC-1155 Standard: The contract implements the ERC-1155 standard, allowing it to create and manage NFTs as unique tokens.
- Listing Functionality: Sellers can list their ERC-1155 NFTs on the marketplace by providing details like the token ID, unit price, and a digital representation (e.g., URI) of the asset.
- Royalty Fees: The contract supports royalty fees, enabling creators to receive a percentage of subsequent sales when their NFT is resold on the marketplace.
- Primary Buy: Buyers can purchase ERC-1155 NFTs listed on the marketplace using Ether (ETH) or other compatible tokens. Upon successful purchase, ownership of the NFT is transferred to the buyer.
- Ownership Tracking: The contract keeps track of the current owner of each ERC-1155 NFT and ensures that NFTs are not duplicated or minted multiple times.

## Getting Started

1. Clone the repository:

   `git clone` https://github.com/SynysterGate7/NFTMarketPlaceERC1155.git
   `cd NFTMarketPlaceERC1155`

2. Install dependencies:

   `npm install`

3. Compile the contract:

   `npx hardhat compile`

4. Run tests:

   `npx hardhat test`

## Usage

To use the ERC-1155 NFT Marketplace Contract, you can deploy it to the Ethereum network or a local development network using Hardhat. You can interact with the contract using a web3-enabled wallet or any Ethereum-compatible development tool.

1. Deploy the contract to the Ethereum network:

Modify the `hardhat.config.js` file to specify your desired network configuration, such as the Ethereum mainnet, Rinkeby, or a local development network.

2. Interact with the contract:

Once the contract is deployed, you can interact with it by calling its functions. For example, sellers can list their ERC-1155 NFTs using the `buyNft` function, while buyers can purchase NFTs using the same function.

## Testing

The contract includes a suite of unit tests to ensure its functionality is robust and free from critical bugs. To run the tests, use the following command:`npx hardhat test`

## Contributing

Contributions to the ERC-1155 NFT Marketplace Contract are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## Acknowledgements

The ERC-1155 NFT Marketplace Contract is built using Solidity and Hardhat. We would like to thank the Ethereum community and the developers behind Solidity, Hardhat, and other dependencies for their valuable contributions to the ecosystem.

---
