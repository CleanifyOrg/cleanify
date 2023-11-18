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
};

export const IWantToCleanModal = ({ isOpen, onClose, reportId }: Props) => {
  const { contract } = useCleanifyContract();

  const handleCreateCleaningRequest = useCallback(async () => {
    await contract.subscribeToClean(reportId);
    onClose();
  }, [contract, reportId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Make a Donation</ModalHeader>
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
