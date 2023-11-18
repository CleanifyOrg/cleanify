# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Deploy contracts

Create a .mnemonic and a .infura file in the root directory of the project. The .mnemonic file should contain the mnemonic of the wallet that will deploy the contracts. The .infura file should contain the infura key.

Run the following command to deploy the contracts:

```bash
npx hardhat run --network goerli scripts/deploy.ts
```

## Verify contracts

Run the following command to verify the contracts:

```bash
npx hardhat verify --constructor-args scripts/arguments.ts --network goerli DEPLOYED_CONTRACT_ADDRESS

```

## Latest deploy

Goerli: [0xa4a3f1fa20995f9bf9805f226db4e5a042f8628b](https://goerli.etherscan.io/address/0xa4a3f1fa20995f9bf9805f226db4e5a042f8628b)
Base Goerli: [0xa4a3f1fa20995f9bf9805f226db4e5a042f8628b](https://goerli.basescan.org/address/0xa4a3f1fa20995f9bf9805f226db4e5a042f8628b)