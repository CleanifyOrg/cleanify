import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
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
            px={8}
            maxW={"xl"}
          >
            <App />
          </Container>
        </ChakraProvider>
      </QueryClientProvider>
    </AccountAbstractionProvider>
  </React.StrictMode>
);
