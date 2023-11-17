import { humanAddress } from "@/utils";
import { HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";

type AddressLabelProps = {
  address: string;
  isTransactionAddress?: boolean;
  showBlockExplorerLink?: boolean;
  showCopyIntoClipboardButton?: boolean;
};

export const AddressLabel = ({
  address,
  isTransactionAddress,
  showBlockExplorerLink,
  showCopyIntoClipboardButton = true,
}: AddressLabelProps) => {
  const { chain } = useAccountAbstraction();

  const blockExplorerLink = `${chain?.blockExplorers?.default.url}/${
    isTransactionAddress ? "tx" : "address"
  }/${address}`;

  return (
    <HStack alignItems="center" justifyContent="center" as="span">
      <Tooltip label={address}>
        <span>{humanAddress(address)}</span>
      </Tooltip>

      {/* Button to copy into clipboard */}
      {showCopyIntoClipboardButton && (
        <Tooltip
          label={`Copy this ${
            isTransactionAddress ? "transaction hash" : "address"
          } into your clipboard`}
        >
          <IconButton
            icon={<FaCopy />}
            aria-label={`Copy this ${
              isTransactionAddress ? "transaction hash" : "address"
            } into your clipboard`}
            onClick={() => navigator?.clipboard?.writeText?.(address)}
            size={"small"}
            color="inherit"
          />
        </Tooltip>
      )}

      {/* Button to etherscan */}
      {showBlockExplorerLink && blockExplorerLink && (
        <Tooltip label={"View details on block explorer"}>
          <IconButton
            icon={<FaExternalLinkAlt />}
            aria-label="View details on block explorer"
            as="a"
            href={blockExplorerLink}
            target="_blank"
            rel="noopener"
            size={"small"}
            color="inherit"
          />
        </Tooltip>
      )}
    </HStack>
  );
};
