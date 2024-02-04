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
import { useSubscribeToClean } from "@/hooks/useSubscribeToClean";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    reportId: number;
};

export function IWantToCleanModal({ isOpen, onClose, reportId }: Props) {
    const { mutate, isPending } = useSubscribeToClean({
        reportId,
        onSuccess: onClose,
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Subscribe to Clean</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>
                        Do you want to be the one who cleans it and claim the
                        reward?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={isPending}
                        loadingText="Submitting"
                        colorScheme="blue"
                        mr={3}
                        onClick={() => mutate()}
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
}

export default IWantToCleanModal;
