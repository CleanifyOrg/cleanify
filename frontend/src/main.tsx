import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CSSReset, ChakraProvider, Container } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <CSSReset />
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
  </React.StrictMode>
);
