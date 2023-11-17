import hre from "hardhat";
import { moderators, admins } from "./arguments";

async function main() {
  const lock = await hre.viem.deployContract("Trashify", [moderators, admins]);

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
