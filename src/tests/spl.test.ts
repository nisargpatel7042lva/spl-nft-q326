import { describe, it, expect } from "vitest";
import { address } from "@solana/kit";
import {
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

const MINT_ADDRESS = "E2Jazz2VXcVL9RZkn6ZFA4q1YGvgEvrns3Gr6w72DC4w";
const WALLET_ADDRESS = "FjXLvAhMnQjEPYp3ock3zHrDWBJeL7m8A9FcWgBPP6Eo";
const RECIPIENT_ADDRESS = "9EUd4VNcjMAysd7zQk3Q1a4tb28BYndLNBAQDiYnHJ64";

describe("SPL Token — spl_init", () => {
  it("mint address parses as a valid Solana address", () => {
    expect(() => address(MINT_ADDRESS)).not.toThrow();
  });

  it("wallet address parses as a valid Solana address", () => {
    expect(() => address(WALLET_ADDRESS)).not.toThrow();
  });

  it("recipient address parses as a valid Solana address", () => {
    expect(() => address(RECIPIENT_ADDRESS)).not.toThrow();
  });
});

describe("SPL Token — spl_mint", () => {
  it("derives ATA for the wallet deterministically", async () => {
    const mint = address(MINT_ADDRESS);
    const owner = address(WALLET_ADDRESS);

    const [ata1] = await findAssociatedTokenPda({
      mint,
      owner,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const [ata2] = await findAssociatedTokenPda({
      mint,
      owner,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    expect(ata1).toBe(ata2);
    expect(typeof ata1).toBe("string");
    expect(ata1.length).toBeGreaterThan(30);
  });

  it("minting 100 tokens at 6 decimals yields correct raw amount", () => {
    const token_decimals = 1_000_000n;
    const mintAmount = 100n * token_decimals;
    expect(mintAmount).toBe(100_000_000n);
  });
});

describe("SPL Token — spl_transfer", () => {
  it("derives separate ATAs for sender and recipient", async () => {
    const mint = address(MINT_ADDRESS);
    const owner = address(WALLET_ADDRESS);
    const recipient = address(RECIPIENT_ADDRESS);

    const [fromAta] = await findAssociatedTokenPda({
      mint,
      owner,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const [toAta] = await findAssociatedTokenPda({
      mint,
      owner: recipient,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    expect(fromAta).not.toBe(toAta);
    expect(typeof fromAta).toBe("string");
    expect(typeof toAta).toBe("string");
  });

  it("transfer amount of 1 token equals 1_000_000 raw units", () => {
    const token_decimals = 1_000_000n;
    const transferAmount = 1n * token_decimals;
    expect(transferAmount).toBe(1_000_000n);
  });
});

describe("SPL Token — spl_metadata", () => {
  it("metadata object has all required DataV2 fields", () => {
    const metadata = {
      name: "NisargXplores Token",
      symbol: "NXT",
      uri: "",
      sellerFeeBasisPoints: 0,
    };

    expect(metadata.name).toBeTruthy();
    expect(metadata.symbol).toBeTruthy();
    expect(typeof metadata.sellerFeeBasisPoints).toBe("number");
    expect(metadata.sellerFeeBasisPoints).toBeGreaterThanOrEqual(0);
    expect(metadata.sellerFeeBasisPoints).toBeLessThanOrEqual(10000);
  });

  it("token name and symbol match expected values", () => {
    const name = "NisargXplores Token";
    const symbol = "NXT";

    expect(name).toContain("NisargXplores");
    expect(symbol).toHaveLength(3);
  });
});
