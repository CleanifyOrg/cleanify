import {
  HStack,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { FaUser } from "react-icons/fa";

import { ConnectedWalletOwner } from ".";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ConnectedWalletModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={2}>
            <Icon as={FaUser} boxSize={5} />
            <Heading size="md"> Connected wallet</Heading>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ConnectedWalletOwner onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
