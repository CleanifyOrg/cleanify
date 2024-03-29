import { HStack, Tag, Tooltip, VStack } from "@chakra-ui/react";
import { formatEther } from "viem";
import { Report, ReportState } from "@/models";
import { useCurrentChain } from "@/store";

type Props = {
  report: Report;
};

export function ReportDetails({ report }: Props) {
  const totalDonationsAmount = formatEther(BigInt(report.totalRewards), "wei");

  const chain = useCurrentChain();
  const coinSymbol = chain.nativeCurrency.symbol;

  const renderStateTag = () => {
    switch (report.state) {
      case ReportState.Available:
        return (
          <Tooltip label="Area available to clean" placement="top">
            <Tag colorScheme="green">Available to clean</Tag>
          </Tooltip>
        );
      case ReportState.InReview:
        return (
          <Tooltip
            label="Submission under review by moderators"
            placement="top"
          >
            <Tag colorScheme="yellow">Under review</Tag>
          </Tooltip>
        );
      case ReportState.Cleaned:
        return (
          <Tooltip label="Area succesfully cleaned" placement="top">
            <Tag colorScheme="blue">Cleaned</Tag>
          </Tooltip>
        );
      case ReportState.PendingVerification:
        return (
          <Tooltip
            label="Area cleaned and under review by moderators"
            placement="top"
          >
            <Tag colorScheme="yellow">Completeness under review</Tag>
          </Tooltip>
        );
      default:
        return <Tag colorScheme="red">Unknown</Tag>;
    }
  };

  const renderTotalRewardsTag = () => {
    if (report.totalRewards === 0 && report.state !== ReportState.Available) {
      return (
        <Tooltip
          label="Once the report will be approved people will be able to contribute to the reward pool"
          placement="top"
        >
          <Tag colorScheme="orange">Rewards not added yet</Tag>
        </Tooltip>
      );
    } if (report.totalRewards === 0) {
      return (
        <Tooltip
          label="Incentivize someone to clean this area by contributing with a tip"
          placement="top"
        >
          <Tag colorScheme="orange">Rewards not added yet</Tag>
        </Tooltip>
      );
    } 
      return (
        <Tag colorScheme="orange">
          Total rewards: {totalDonationsAmount} {coinSymbol}
        </Tag>
      );
    
  };

  return (
    <VStack>
      <HStack justifyContent="left" w="full">
        {renderStateTag()}
        {renderTotalRewardsTag()}
      </HStack>
    </VStack>
  );
}
