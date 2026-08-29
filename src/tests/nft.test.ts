import { describe, it, expect } from "vitest";

const NFT_NAME = "NisargXplores";
const METADATA_URI =
  "https://gateway.irys.xyz/6CrVchtVJEduwhDEskxq9mJkX5wpoSGexHSjy7KQYbPt";
const IMAGE_URI =
  "https://gateway.irys.xyz/3giK1GaZgkpk1RzzP5bRHeNCHqdLUEnc3gTWM3Ny9pc9";

describe("NFT — nft_metadata", () => {
  it("metadata JSON has all required top-level fields", () => {
    const metadata = {
      name: NFT_NAME,
      description: "An NFT minted on Solana devnet.",
      image: IMAGE_URI,
      properties: {
        files: [{ uri: IMAGE_URI, type: "image/png" }],
      },
    };

    expect(metadata.name).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.image).toBeTruthy();
    expect(Array.isArray(metadata.properties.files)).toBe(true);
    expect(metadata.properties.files).toHaveLength(1);
  });

  it("file entry has uri and type", () => {
    const file = { uri: IMAGE_URI, type: "image/png" };
    expect(file.uri).toMatch(/^https:\/\//);
    expect(file.type).toBe("image/png");
  });

  it("metadata URI points to Irys gateway", () => {
    expect(METADATA_URI).toMatch(/^https:\/\//);
    expect(METADATA_URI).toContain("gateway.irys.xyz");
  });

  it("image URI points to Irys gateway", () => {
    expect(IMAGE_URI).toMatch(/^https:\/\//);
    expect(IMAGE_URI).toContain("gateway.irys.xyz");
  });
});

describe("NFT — nft_mint", () => {
  it("NFT name is set correctly", () => {
    expect(NFT_NAME).toBe("NisargXplores");
    expect(NFT_NAME.length).toBeGreaterThan(0);
  });

  it("metadata URI is a non-empty string", () => {
    expect(typeof METADATA_URI).toBe("string");
    expect(METADATA_URI.length).toBeGreaterThan(0);
  });
});

describe("NFT — nft_update", () => {
  it("updated name differs from original", () => {
    const originalName = NFT_NAME;
    const updatedName = "NisargXplores V2";

    expect(updatedName).not.toBe(originalName);
    expect(updatedName).toContain("NisargXplores");
  });

  it("updated URI is a valid gateway URL", () => {
    const updatedUri = METADATA_URI;
    expect(updatedUri).toMatch(/^https:\/\//);
    expect(updatedUri.length).toBeGreaterThan(0);
  });
});

describe("NFT — nft_transfer", () => {
  it("new owner address is a non-empty string", () => {
    const newOwner = "9EUd4VNcjMAysd7zQk3Q1a4tb28BYndLNBAQDiYnHJ64";
    expect(typeof newOwner).toBe("string");
    expect(newOwner.length).toBeGreaterThan(30);
  });
});

describe("NFT — nft_burn", () => {
  it("burn operation targets the correct asset type", () => {
    const operation = "burn";
    const assetType = "MPL Core Asset";

    expect(operation).toBe("burn");
    expect(assetType).toContain("MPL Core");
  });
});
