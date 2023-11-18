import React from "react";
import ReactDOM from "react-dom/client";
import { AccountAbstractionProvider } from "./store/accountAbstractionContext.tsx";
import { CSSReset, ChakraProvider, Container, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/Navbar.tsx";
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
            <Navbar />
            <Container
              alignItems={"center"}
              justifyContent={"center"}
              maxW={"6xl"}
              display={"flex"}
              flexGrow={1}
              overflow={"auto"}
            >
              <RouterProvider router={router} />
            </Container>
          </Flex>
        </AccountAbstractionProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
