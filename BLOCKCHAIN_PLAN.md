# Blockchain Integration Plan (PM-27)

## 🎯 Overview
Add **blockchain-based smart contracts** for:
- **Escrow Payments**: Automatic release when milestones met
- **NFT Creator Certificates**: Unique digital certificates for creators
- **Transparent Ledger**: All payments recorded on-chain
- **Crypto Payouts**: Pay creators in USDC/DAI (stablecoins)

## 📊 Blockchain Features

### 1. Smart Contract for Escrow
```solidity
// contracts/CreatorEscrow.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CreatorEscrow {
    address public brand;
    address public creator;
    uint256 public amount;
    bool public milestoneMet;
    
    event PaymentReleased(address to, uint256 amount);
    
    constructor(address _creator, uint256 _amount) {
        brand = msg.sender;
        creator = _creator;
        amount = _amount;
    }
    
    function confirmMilestone() public {
        require(msg.sender == brand, "Only brand can confirm");
        milestoneMet = true;
    }
    
    function releasePayment() public {
        require(milestoneMet, "Milestone not met yet");
        payable(creator).transfer(amount);
        emit PaymentReleased(creator, amount);
    }
}
```

### 2. Install Dependencies
```bash
npm install ethers @walletconnect/react-native
# For web: ethers + wagmi
# For mobile: @walletconnect/react-native
```

### 3. Create Blockchain API Routes
- **POST /api/blockchain/deploy-escrow** — Deploy escrow contract
- **POST /api/blockchain/confirm-milestone** — Brand confirms milestone
- **POST /api/blockchain/release-payment** — Release payment to creator
- **GET /api/blockchain/balance/:address** — Get wallet balance

### 4. Create Smart Contract Interface
```typescript
// lib/blockchain.ts
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com'
);

export async function deployEscrow(creatorAddress: string, amount: string) {
  const wallet = new ethers.Wallet(process.env.BRAND_PRIVATE_KEY!, provider);
  const factory = new ethers.ContractFactory(escrowABI, wallet);
  const contract = await factory.deploy(creatorAddress, ethers.parseEther(amount));
  await contract.waitForDeployment();
  return await contract.getAddress();
}
```

### 5. UI Components
- **EscrowSetup** — Brand sets up escrow for campaign
- **MilestoneConfirmation** — Brand confirms milestone completion
- **PaymentRelease** — Automatic release when conditions met
- **WalletBalance** — Show creator's wallet balance

### 6. Wallet Integration (Mobile)
- **WalletConnect** — Scan QR to connect wallet
- **MetaMask** — Deep linking to MetaMask app
- **Coinbase Wallet** — Alternative wallet option

## ✅ Next Steps
1. Install `ethers` library
2. Create `contracts/` directory with Solidity files
3. Create `lib/blockchain.ts` helper functions
4. Create API routes for blockchain interactions
5. Create UI components for escrow/payments
6. Test: Deploy local contract (Hardhat/Ganache)
7. Commit PM-27.

## 💰 Cost Savings
- **Smart Contracts**: Self-hosted (free) vs Escrow.com (1-5% fee)
- **NFT Certificates**: OpenSea (2.5% fee) vs Custom (0%)
- **Crypto Payouts**: Stablecoins (low fee) vs Bank Transfer (₹50+)

**Savings**: ~₹2L/year in escrow fees
