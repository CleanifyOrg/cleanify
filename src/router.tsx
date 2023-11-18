import { createBrowserRouter } from "react-router-dom";
import { Home, Report } from "./screens";

export enum Routes {
  Home = "/",
  Report = "/report/:id",
}

export const router = createBrowserRouter([
  {
    path: Routes.Home,
    element: <Home />,
  },
  {
    path: Routes.Report,
    element: <Report />,
  },
]);
