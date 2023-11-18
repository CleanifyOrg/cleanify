import React from "react";
import ReactDOM from "react-dom/client";
import { Home } from "./App";
import { CSSReset, ChakraProvider, Container } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountAbstractionProvider } from "./store/accountAbstractionContext.tsx";
import { Navbar } from "./components/Navbar.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AccountAbstractionProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <CSSReset />
          <Navbar />
          <Container
            alignItems={"center"}
            justifyContent={"center"}
            maxW={"6xl"}
            display={"flex"}
            flexGrow={1}
            overflow={"auto"}
          >
            <Home />
          </Container>
        </ChakraProvider>
      </QueryClientProvider>
    </AccountAbstractionProvider>
  </React.StrictMode>
);
