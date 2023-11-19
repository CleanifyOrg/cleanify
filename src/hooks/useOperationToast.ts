import { UseToastOptions, useToast } from "@chakra-ui/react";

export const useOperationToast = () => {
  const toast = useToast();

  const success = (props?: Partial<UseToastOptions>) => {
    toast({
      title: "Success!",
      status: "success",
      duration: 5000,
      isClosable: true,
      ...props,
    });
  };
  const error = (props?: Partial<UseToastOptions>) => {
    toast({
      title: `Something went wrong`,
      status: "error",
      duration: 5000,
      isClosable: true,
      ...props,
    });
  };

  return {
    success,
    error,
  };
};
