import { Routes, Route } from "react-router-dom";
import UserRoutes from "./UserRoutes";

export default function AppRoutes() {
  return (
    <Routes>

        <Route path="/*" element={<UserRoutes />} />
    </Routes>
  )
}
