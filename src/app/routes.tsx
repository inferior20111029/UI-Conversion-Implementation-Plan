import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Insurance } from "./pages/Insurance";
import { AIDoctorChat } from "./pages/AIDoctorChat";
import { HealthScanner } from "./pages/HealthScanner";
import { Products } from "./pages/Products";
import { Subscription } from "./pages/Subscription";
import { Web3Identity } from "./pages/Web3Identity";
import { Login } from "./pages/Login";
import { AddPet } from "./pages/AddPet";
import { AddHealthRecord } from "./pages/AddHealthRecord";
import { InsuranceDetail } from "./pages/InsuranceDetail";

export const router = createBrowserRouter([
  // Public
  { path: "/login", Component: Login },

  // Protected
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "pets/add", Component: AddPet },
      { path: "pets/:petId/edit", Component: AddPet },
      { path: "pets/:petId/add-record", Component: AddHealthRecord },
      { path: "insurance", Component: Insurance },
      { path: "insurance/:planId", Component: InsuranceDetail },
      { path: "ai-doctor", Component: AIDoctorChat },
      { path: "scanner", Component: HealthScanner },
      { path: "products", Component: Products },
      { path: "subscription", Component: Subscription },
      { path: "web3", Component: Web3Identity },
    ],
  },
]);
