import React from "react";
import ReactDOM from "react-dom/client";
import { CSSReset, ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { envConfig } from "@repo/config";
import { Theme } from "./theme.ts";
import { AccountAbstractionProvider } from "./store/accountAbstractionContext";
import { router } from "./router";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            staleTime: 30000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchInterval: false,
            refetchIntervalInBackground: false,
        },
    },
});

console.log({ envConfig });

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={Theme}>
                <CSSReset />
                <AccountAbstractionProvider>
                    <Flex flexDir="column" h="100vh">
                        <RouterProvider router={router} />
                    </Flex>
                </AccountAbstractionProvider>
            </ChakraProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
