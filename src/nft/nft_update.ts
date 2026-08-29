import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { fetchAsset, mplCore, update } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplCore());

// Paste your asset address printed by nft_mint.ts
const assetAddress = publicKey("GtcD7udReiKqAE3MrwJs9ZjdoZBQkZHVQx4AxpiXEFmi");

// New metadata URI after re-uploading updated JSON via nft_metadata.ts
const updatedUri =
  "https://gateway.irys.xyz/6CrVchtVJEduwhDEskxq9mJkX5wpoSGexHSjy7KQYbPt";

(async () => {
  try {
    const asset = await fetchAsset(umi, assetAddress);

    const tx = await update(umi, {
      asset,
      name: "NisargXplores V2",
      uri: updatedUri,
    }).sendAndConfirm(umi);

    const signature = base58.deserialize(tx.signature)[0];

    console.log(`NFT updated successfully!`);
    console.log(`New name: NisargXplores V2`);
    console.log(`Signature: ${signature}`);
    console.log(
      `Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    );
  } catch (e) {
    console.log(`Error: ${e}`);
  }
})();
