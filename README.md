# Register a wallet controlled by an AWS KMS key on ImmutableX

This script registers a wallet controlled by an AWS KMS key on ImmutableX.

## AWS KMS key setup

You need to create an asymmetric AWS KMS key compatible with the Ethereum network. Use the following settings:

<!-- Image showing the settings -->

![AWS KMS key settings](images/aws_kmw_setup.jpg)

## Setup AWS profile

The recommended way to use the script is to setup an AWS profile in the console running the script. Alternatively, you can set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables.

## Generate a Stark private key

Because AWS KMS uses undeterministic signing, you cannot use the `generateLegacyStarkPrivateKey` function of the ImmutableX [Core SDK](https://github.com/immutable/imx-core-sdk#how-to-generate-stark-keys-on-immutablex) to generate the Stark private key deterministically from the L1 signature. If you do this, you will get a new private key every time, essentially locking you out of almost all L2 functionality of your wallet.

Instead, the currentyl recommended way from ImmutableX is to use the `generateStarkPrivateKey` function to create a new random Stark key. This key should then be persisted in an environmental variable in the application using it. This is considered safe, because all API calls to IMX require the L1 signature as well, which is signed with the AWS KMS key.

To generate a new Stark private key, you can run the `generate-stark-key` as shown below.

> IMPORTANT - Make sure you keep this private key, because you will need it in the future if you want to transfer tokens from this wallet.

## Configure environment variables

Create a copy of the `.env.example` file and name it `.env`. Then, fill in the following environment variables:

-   `AWS_KMS_REGION`: the region of the AWS KMS key
-   `AWS_KMS_KEY_ID`: the ID of the AWS KMS key

The other environment variables are optional.

## Prepare the script

Install the dependencies of the script:

```bash
yarn install
```

## Generate a new Stark private key

Cerate a new key and store it in the `STARK_PRIVATE_KEY` environment variable:

```bash
yarn generate-stark-key
```

## Run the script

To run the script execute the following command:

```bash
yarn register
```
