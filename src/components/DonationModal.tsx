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
import { useAccountAbstraction } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getExchangeRate } from "@/api/getExchangeRate";
import { parseEther } from "viem";
import { useCleanifyContract } from "@/hooks";
import { useOperationToast } from "@/hooks/useOperationToast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
};

export const DonationModal = ({ isOpen, onClose, reportId }: Props) => {
  const [donationAmount, setDonationAmount] = useState("");

  const { chain } = useAccountAbstraction();
  const coinSymbol = chain.nativeCurrency.symbol;

  const { data: exchangeRate } = useQuery({
    queryKey: ["exchangeRate", coinSymbol],
    queryFn: () => getExchangeRate(coinSymbol),
  });

  const { contract } = useCleanifyContract();
  const { success, error } = useOperationToast();

  const handleDonate = async () => {
    const options = {
      value: String(parseEther(donationAmount)),
    };
    const tx = await contract.addRewards(reportId, options);
    try {
      await tx.wait();
      success({
        title: "Successfully donated",
      });
    } catch (e) {
      console.log("e", e);
      error();
    }

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
          <Button colorScheme="blue" mr={3} onClick={handleDonate}>
            Donate
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DonationModal;
