import { createBrowserRouter, Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { Home, Report } from "./screens";
import { Navbar } from "./components";

export enum Routes {
  Home = "/",
  Report = "/report/:id",
}

export const router = createBrowserRouter([
  {
    element: (
      <>
        <Navbar />
        <Container
          alignItems="center"
          justifyContent="center"
          maxW="6xl"
          display="flex"
          flexGrow={1}
          overflow="auto"
        >
          <Outlet />
        </Container>
      </>
    ),
    children: [
      {
        path: Routes.Home,
        element: <Home />,
      },
      {
        path: Routes.Report,
        element: <Report />,
      },
    ],
  },
]);
