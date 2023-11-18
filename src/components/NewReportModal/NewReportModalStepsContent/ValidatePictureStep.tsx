import { AnalyzeImageResponse } from "@/api/chatgpt";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Heading,
  ScaleFade,
  Spinner,
  VStack,
} from "@chakra-ui/react";

type Props = {
  isPending: boolean;
  data?: AnalyzeImageResponse;
  handleOnResetPhotos: () => void;
  goToPreviousStep: () => void;
};
export const ValidatePictureStep: React.FC<Props> = ({
  isPending,
  data,
  handleOnResetPhotos,
  goToPreviousStep,
}) => {
  const onTryAnotherClick = () => {
    handleOnResetPhotos();
    goToPreviousStep();
  };

  if (isPending)
    return (
      <ScaleFade
        initialScale={0.9}
        in={true}
        style={{ height: 400, width: "100%" }}
      >
        <VStack
          align="center"
          justify={"center"}
          alignSelf={"center"}
          spacing={4}
          h={"full"}
        >
          <Spinner size={"xl"} />
          <Heading size="sm">We are validating your image...</Heading>
        </VStack>
      </ScaleFade>
    );
  if (data?.isWastePollution)
    return (
      <ScaleFade
        initialScale={0.9}
        in={true}
        style={{ height: 400, width: "100%" }}
      >
        <VStack
          align="center"
          justify={"center"}
          alignSelf={"center"}
          spacing={2}
          h={"full"}
        >
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            borderRadius={"xl"}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              We validated your image
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              We validated your image and we're happy to tell you it qualifies
              for opening a report.
            </AlertDescription>
          </Alert>
        </VStack>
      </ScaleFade>
    );

  return (
    <ScaleFade
      initialScale={0.9}
      in={true}
      style={{ height: 400, width: "100%" }}
    >
      <VStack
        align="center"
        justify={"center"}
        alignSelf={"center"}
        spacing={2}
        h={"full"}
      >
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius={"xl"}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            We are not able to validate your image
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            It may be an issue on our side, or your image may not be elegible
            for opening a report
          </AlertDescription>
        </Alert>
        <Button variant="link" colorScheme="teal" onClick={onTryAnotherClick}>
          Try another one
        </Button>
      </VStack>
    </ScaleFade>
  );
};
