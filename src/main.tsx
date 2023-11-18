import React from "react";
import ReactDOM from "react-dom/client";
import { AccountAbstractionProvider } from "./store/accountAbstractionContext.tsx";
import { CSSReset, ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "./theme.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={Theme}>
        <CSSReset />
        <AccountAbstractionProvider>
          <Flex flexDir={"column"} h={"100vh"}>
            <RouterProvider router={router} />
          </Flex>
        </AccountAbstractionProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
