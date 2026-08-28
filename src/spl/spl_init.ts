import {
  appendTransactionMessageInstructions,
  assertIsTransactionMessageWithBlockhashLifetime,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { getCreateAccountInstruction } from "@solana-program/system";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const walletPath = join(__dirname, "../../devnet-wallet.json");
let wallet: number[];

try {
  wallet = JSON.parse(readFileSync(walletPath, "utf8")) as number[];
} catch {
  throw new Error(
    `Missing devnet wallet. Create ${walletPath} as a JSON array of secret-key bytes.`,
  );
}

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);

(async () => {
  try {
    //create a signer from your wallet
    const signer = await createKeyPairSignerFromBytes(new Uint8Array(wallet));
    //generate a new mint signer for address
    const mintSigner = await generateKeyPairSigner();

    //get the size of the mint account
    const space = BigInt(getMintSize());

    //get the minimum balance for the rent exemption
    const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const sendAndConfirm = sendAndConfirmTransactionFactory({rpc, rpcSubscriptions});

    const msg = createTransactionMessage({ version: 0 });
    
    const msgWithPayer = setTransactionMessageFeePayerSigner(signer, msg);
  
    const msgWithLifetime = setTransactionMessageLifetimeUsingBlockhash(
      latestBlockhash,
      msgWithPayer,
    );

    const txMessage = appendTransactionMessageInstructions(
      [
        getCreateAccountInstruction({
          payer: signer,
          newAccount: mintSigner,
          lamports: rent,
          space,
          programAddress: TOKEN_PROGRAM_ADDRESS,
        }),
        
        getInitializeMintInstruction({
          mint: mintSigner.address,
          decimals: 6,
          mintAuthority: signer.address,
        }),
      ],
      msgWithLifetime,
    );

    assertIsTransactionMessageWithBlockhashLifetime(txMessage);
    const signedTx = await signTransactionMessageWithSigners(txMessage);
    
    assertIsTransactionWithBlockhashLifetime(signedTx);

    const signature = getSignatureFromTransaction(signedTx);

    //send and confirm the transaction
    await sendAndConfirm(signedTx, { commitment: "confirmed" });
    
    console.log(
`Mint created successfully with address: ${mintSigner.address} and signature: ${signature}`
    );
    
  } catch (error) {
    console.log(error);
  }
})();
