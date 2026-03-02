import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Feed } from "./components/Feed";
import { Messages } from "./components/Messages";
import { People } from "./components/People";
import { Analytics } from "./components/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Feed },
      { path: "messages", Component: Messages },
      { path: "people", Component: People },
      { path: "analytics", Component: Analytics },
    ],
  },
]);
