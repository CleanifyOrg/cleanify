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

import { useAddRewards } from "@/hooks";
import { useCurrentChain } from "@/store";
import { useExchangeRate } from "@/api/coingecko/hooks/useExchangeRate";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    reportId: number;
};

export function DonationModal({ isOpen, onClose, reportId }: Props) {
    const { mutate, isPending } = useAddRewards({
        reportId,
        onSuccess: onClose,
    });
    const [donationAmount, setDonationAmount] = useState("");

    const chain = useCurrentChain();

    const coinSymbol = chain.nativeCurrency.symbol;

    const { data: exchangeRate } = useExchangeRate(coinSymbol);

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
                            equivalent to:{" "}
                            {Number(donationAmount) * (exchangeRate || 0)}$
                        </Text>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={isPending}
                        loadingText="Donating"
                        colorScheme="blue"
                        mr={3}
                        onClick={() => mutate(donationAmount)}
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
