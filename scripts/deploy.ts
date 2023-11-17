import hre from "hardhat";
import { moderators } from "./arguments";

async function main() {
  const lock = await hre.viem.deployContract("Trashify", [moderators]);

  console.log(
    `Trashify deployed to ${lock.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
