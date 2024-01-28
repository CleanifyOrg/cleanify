import { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import { parseEther } from "viem";
import { getExchangeRate } from "@/api/getExchangeRate";
import { useCleanifyContract } from "@/hooks";
import { useOperationToast } from "@/hooks/useOperationToast";
import { useCurrentChain } from "@/store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
  refreshReport: () => void;
};

export function DonationModal({
  isOpen,
  onClose,
  reportId,
  refreshReport,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  const chain = useCurrentChain();

  const coinSymbol = chain.nativeCurrency.symbol;

  const { data: exchangeRate } = useQuery({
    queryKey: ["exchangeRate", coinSymbol],
    queryFn: () => getExchangeRate(coinSymbol),
  });

  const { contract } = useCleanifyContract();
  const { success, error } = useOperationToast();

  const handleDonate = async () => {
    setLoading(true);
    try {
      const options = {
        value: String(parseEther(donationAmount)),
      };
      const tx = await contract.addRewards(reportId, options);
      await tx.wait();
      success({
        title: "Successfully donated",
      });
    } catch (e) {
      console.log("e", e);
      error();
    } finally {
      setLoading(false);
    }

    refreshReport();

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Make a Donation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Donation Amount ({coinSymbol})</FormLabel>
            <Input
              type="number"
              placeholder="Enter donation amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <Text pt={2}>
              equivalent to: {Number(donationAmount) * (exchangeRate || 0)}$
            </Text>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={loading}
            loadingText="Donating"
            colorScheme="blue"
            mr={3}
            onClick={handleDonate}
          >
            Donate
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DonationModal;
