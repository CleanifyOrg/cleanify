import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

type TxToastState = {
    title: string;
    description: string;
    isLoading: boolean;
};
export function useTxToast({ isLoading, title, description }: TxToastState) {
    const toast = useToast();

    useEffect(() => {
        if (isLoading) {
            toast({
                title,
                description,
                status: "loading",
                duration: null,
                position: "bottom-left",
                isClosable: true,
            });
        }
        else {
            toast.closeAll();
        }
    }, [toast, isLoading, title, description]);


}