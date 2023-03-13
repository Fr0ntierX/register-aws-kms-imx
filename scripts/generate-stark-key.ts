import { Config, createStarkSigner, generateStarkPrivateKey, ImmutableX } from "@imtbl/core-sdk";

const main = async () => {
    // Generate a Stark private key
    const starkPrivateKey = await generateStarkPrivateKey();

    console.log("Stark Private Key:", starkPrivateKey);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
