import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Feed } from "./components/Feed";
import { Community } from "./components/Community";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Feed },
      { path: "community/:id", Component: Community },
    ],
  },
]);