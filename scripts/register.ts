import { KMS } from "aws-sdk";
import { Config, createStarkSigner, generateLegacyStarkPrivateKey, ImmutableX } from "@imtbl/core-sdk";
import { KMSSigner } from "@rumblefishdev/eth-signer-kms";
import { ethers } from "ethers";

const main = async () => {
    // Initialize the AWS KMS key
    const accessKeyId = process.env.AWS_KMS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_KMS_SECRET_ACCESS_KEY;
    const credentials = accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined;

    const kms = new KMS({
        region: process.env.AWS_KMS_REGION,
        credentials,
    });

    // Initialize the signer for L1
    const provider = new ethers.providers.AlchemyProvider(process.env.NETWORK, process.env.ALCHEMY_API_KEY);
    const ethSigner = new KMSSigner(provider, String(process.env.AWS_KMS_KEY_ID), kms);
    console.log("Signer Address:", await ethSigner.getAddress());

    // Initialize the signer for L2
    const starkPrivateKey =
        process.env.STARK_PRIVATE_KEY || "000000000000000000000000000000000000000000000000000000000000000";
    const starkSigner = createStarkSigner(starkPrivateKey);

    // Initialize the ImmutableX Core SDK
    const imx = new ImmutableX(process.env.NETWORK === "mainnet" ? Config.PRODUCTION : Config.SANDBOX);

    // Register the account on IMX
    try {
        console.info("Waiting for signer registration...");
        await imx.registerOffchain({
            ethSigner,
            starkSigner,
        });
        console.log("Signer registered successfully!");
    } catch (error: any) {
        console.log("Couldn't resgister account:", error.code);
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
