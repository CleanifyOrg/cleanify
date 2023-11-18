import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useCleanifyContract } from "@/hooks";
import { useCallback } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
  refreshReport: () => void;
};

export const IWantToCleanModal = ({ isOpen, onClose, reportId, refreshReport }: Props) => {
  const { contract } = useCleanifyContract();

  const handleCreateCleaningRequest = useCallback(async () => {
    const tx = await contract.subscribeToClean(reportId);

    await tx.wait();

    refreshReport();

    onClose();
  }, [contract, reportId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Subscribe to Clean</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Do you want to be the one who cleans it and claim the reward?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleCreateCleaningRequest}
          >
            Yes, I want to clean it
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IWantToCleanModal;
