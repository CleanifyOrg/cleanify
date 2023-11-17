import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CSSReset, ChakraProvider, Container } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
