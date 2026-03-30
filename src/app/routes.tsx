import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Insurance } from "./pages/Insurance";
import { AIDoctorChat } from "./pages/AIDoctorChat";
import { HealthScanner } from "./pages/HealthScanner";
import { Products } from "./pages/Products";
import { Subscription } from "./pages/Subscription";
import { Web3Identity } from "./pages/Web3Identity";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "insurance", Component: Insurance },
      { path: "ai-doctor", Component: AIDoctorChat },
      { path: "scanner", Component: HealthScanner },
      { path: "products", Component: Products },
      { path: "subscription", Component: Subscription },
      { path: "web3", Component: Web3Identity },
    ],
  },
]);
