# SPL Token and NFT Scripts - Solana Devnet

Scripts for minting SPL tokens, attaching on-chain metadata, and creating/managing NFTs using MPL Core on Solana devnet.

## Setup

### 1. Add your wallet

Place your devnet wallet keypair at the project root:

```
root/
└── devnet-wallet.json
```

It should be a JSON array of secret-key bytes, e.g. `[174, 23, ...]`.

Fund it with devnet SOL:

```bash
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your NFT image

Place a PNG image here for the NFT scripts:

```
src/nft/
└── nft pic.png
```

## References

- [Solana Token Docs](https://solana.com/docs/tokens) - mint accounts, token accounts, ATAs
- [Solana Kit](https://www.solanakit.com/) - JS SDK for building and sending transactions
- [Metaplex Token Metadata](https://developers.metaplex.com/token-metadata) - on-chain metadata for SPL tokens
- [Metaplex Core](https://developers.metaplex.com/core) - NFT standard used in the NFT scripts

## Task 1 - Mint and Transfer an SPL Token

Uses **@solana/kit** and **@solana-program/token** for transactions, and **mpl-token-metadata** via UMI for on-chain metadata.

| Script | Command | What it does |
|---|---|---|
| `spl_init.ts` | `npm run spl:init` | Creates a new mint account and logs the mint address |
| `spl_metadata.ts` | `npm run spl:metadata` | Attaches name, symbol, and URI to the mint |
| `spl_mint.ts` | `npm run spl:mint` | Creates your ATA and mints 100 tokens into it |
| `spl_transfer.ts` | `npm run spl:transfer` | Creates the recipient's ATA and transfers 1 token |

Run them in order. After `spl:init`, paste the printed mint address into `spl_metadata.ts`, `spl_mint.ts`, and `spl_transfer.ts` before running each.

### How it works

1. `spl_init` creates a **mint account** (the factory that controls token supply) with `decimals: 6`.
2. `spl_metadata` calls `createMetadataAccountV3` via the Token Metadata program to attach a human-readable name and symbol to the mint.
3. `spl_mint` derives the sender's **Associated Token Account (ATA)** via `findAssociatedTokenPda`, creates it, then calls `getMintToInstruction` to mint 100 tokens (100,000,000 raw units).
4. `spl_transfer` derives both ATAs, creates the recipient's ATA if needed, then calls `getTransferCheckedInstruction` to move 1 token.

## Task 2 - Mint an NFT using MPL Core

Uses **mpl-core** via UMI. Images and metadata are stored on Irys (decentralized storage).

| Script | Command | What it does |
|---|---|---|
| `nft_image.ts` | `npm run nft:image` | Uploads your PNG to Irys and logs the image URI |
| `nft_metadata.ts` | `npm run nft:metadata` | Builds the metadata JSON, uploads it, and logs the metadata URI |
| `nft_mint.ts` | `npm run nft:mint` | Mints the NFT on-chain using the metadata URI and logs the asset address |

Run them in order. Paste the URI printed by each step into the next script before running it.

**Minted NFT:** [GtcD7udReiKqAE3MrwJs9ZjdoZBQkZHVQx4AxpiXEFmi](https://explorer.solana.com/address/GtcD7udReiKqAE3MrwJs9ZjdoZBQkZHVQx4AxpiXEFmi?cluster=devnet)

### How it works

MPL Core stores an NFT as a single **Asset account** with no separate mint or token accounts. The `create` instruction sets the owner, name, and off-chain metadata URI in one transaction.

## Task 3 - Update NFT Metadata

| Script | Command | What it does |
|---|---|---|
| `nft_update.ts` | `npm run nft:update` | Updates the asset name to `NisargXplores V2` and sets a new URI |

The wallet must be the **update authority** of the asset. The wallet that minted the NFT is the update authority by default.

### How it works

`fetchAsset` loads the current on-chain state, then `update` sends a transaction that replaces the name and URI fields. Only the update authority can call this instruction.

## Extension Challenges

### 5 - Transfer NFT Ownership

| Script | Command | What it does |
|---|---|---|
| `nft_transfer.ts` | `npm run nft:transfer` | Transfers ownership of the asset to a new wallet |

### 6 - Burn NFT and Reclaim Rent

| Script | Command | What it does |
|---|---|---|
| `nft_burn.ts` | `npm run nft:burn` | Permanently destroys the asset and returns the rent lamports to the owner |

> Burning is irreversible. The asset account is closed and rent is returned to the current owner.

## Testing

Unit tests live in `src/tests/` and use [Vitest](https://vitest.dev/). They cover:

- Address format validation (mint, wallet, recipient)
- Deterministic ATA derivation via `findAssociatedTokenPda`
- Token amount and decimal arithmetic
- SPL metadata structure (`DataV2Args` required fields)
- NFT metadata JSON structure (name, description, image, files)
- NFT update, transfer, and burn parameter validation

```bash
npm test
```

### Test results

![All tests passing](src/image.png)
