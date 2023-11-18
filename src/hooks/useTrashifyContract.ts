import { useAccountAbstraction } from "@store";
import { useMemo } from "react";
import { Trashify__factory as TrashifyFactory } from "@/typechain";
import { BigNumberish, ethers } from "ethers";
import { uploadToIpfs } from "@/utils"

export const useTrashifyContract = () => {
    const { web3Provider, chain } = useAccountAbstraction();

    const providerOrSigner = useMemo(() => {
        if (web3Provider) {
            return web3Provider.getSigner();
        } else {
            return new ethers.providers.JsonRpcProvider(
                chain.rpcUrls.default.http[0]
            );
        }
    }, [web3Provider, chain]);

    const contract = useMemo(() => {
        return TrashifyFactory.connect(chain.contractAddress, providerOrSigner);
    }, [chain.contractAddress, providerOrSigner]);


    const distributeRewards = async (reportId: string) => {
        const tx = await contract.distributeRewards(reportId)
        return await tx.wait();
    };

    const addReward = async (id: number, value: BigNumberish) => {
        const tx = await contract.addRewards(id, { value });

        return await tx.wait(2);
    };

    const approveReport = async (id: number) => {
        const tx = await contract.approveReport(id);

        return await tx.wait(2);
    };

    const deleteReport = async (reportId: string) => {
        const tx = await contract.deleteReport(reportId);
        return await tx.wait();
    };

    const subscribeToClean = async (reportId: string) => {
        const tx = await contract.subscribeToClean(reportId);
        return await tx.wait();
    };

    const verifyReportCleaning = async (reportId: string, isClean: boolean) => {
        const tx = await contract.handleVerificationRequest(reportId, isClean)
        return await tx.wait();
    };

    const submitCleanedReport = async (reportId: string, imageBase64: string) => {
        const uri = await uploadToIpfs(imageBase64)

        const tx = await contract.setReportAsCleaned(reportId, uri)

        return await tx.wait();
    }

    return {
        contract,
        providerOrSigner,
        distributeRewards,
        addReward,
        approveReport,
        deleteReport,
        subscribeToClean,
        verifyReportCleaning,
        submitCleanedReport
    };
};
