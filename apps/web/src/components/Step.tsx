import {
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
} from "@chakra-ui/react";
import { capitalizeFirstLetter } from "@/utils";

type Props = {
  activeStep: number;
  steps: {
    title: string;
    description: string;
  }[];
};
export const NewReportModalSteps: React.FC<Props> = ({ steps, activeStep }) => (
    <Stepper index={activeStep} w="full">
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle>{capitalizeFirstLetter(step.title)}</StepTitle>
            {/* <StepDescription>{step.description}</StepDescription> */}
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
