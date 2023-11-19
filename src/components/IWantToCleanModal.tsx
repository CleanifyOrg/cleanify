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
import { useCallback, useState } from "react";
import { useOperationToast } from "@/hooks/useOperationToast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
  refreshReport: () => void;
};

export const IWantToCleanModal = ({
  isOpen,
  onClose,
  reportId,
  refreshReport,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const { contract } = useCleanifyContract();
  const { success, error } = useOperationToast();

  const handleCreateCleaningRequest = useCallback(async () => {
    setLoading(true);
    try {
      const tx = await contract.subscribeToClean(reportId);
      await tx.wait();
      success({
        title: "Successfully requested",
        description:
          "Check the status of your request, to see when you can clean it.",
      });
    } catch (e) {
      console.log("e", e);
      error();
    } finally {
      setLoading(false);
    }

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
            isLoading={loading}
            loadingText="Submitting"
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
