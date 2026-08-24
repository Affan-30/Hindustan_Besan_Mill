import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./layouts/ProtectedRoute.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DailyEntry from "./pages/DailyEntry.jsx";
import Production from "./pages/Production.jsx";
import WorkerPayments from "./pages/WorkerPayments.jsx";
import OtherPayments from "./pages/OtherPayments.jsx";
import RawMaterials from "./pages/RawMaterials.jsx";
import Bills from "./pages/Bills.jsx";
import Sales from "./pages/Sales.jsx";
import Workers from "./pages/Workers.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import DailyReport from "./pages/reports/DailyReport.jsx";
import RangeReport from "./pages/reports/RangeReport.jsx";
import MonthlyReport from "./pages/reports/MonthlyReport.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public marketing/landing page — shown before login */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Management platform — everything below opens after login */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="daily-entry" element={<DailyEntry />} />
        <Route path="production" element={<Production />} />
        <Route path="worker-payments" element={<WorkerPayments />} />
        <Route path="other-payments" element={<OtherPayments />} />
        <Route path="raw-materials" element={<RawMaterials />} />
        <Route path="bills" element={<Bills />} />
        <Route path="sales" element={<Sales />} />
        <Route path="workers" element={<Workers />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="reports/daily" element={<DailyReport />} />
        <Route path="reports/range" element={<RangeReport />} />
        <Route path="reports/monthly" element={<MonthlyReport />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}