import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import UserProtected from "../protected/userProtected";

const Register = lazy(() => import("../components/Register"));
const Login = lazy(() => import("../components/Login"));
const PDFExtractor = lazy(() => import("../components/pdfExtract"));

export default function UserRoutes() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route index element={<PDFExtractor />} />
          <Route element={<UserProtected />}>
            <Route path="/pdfExtractor" element={<PDFExtractor />} />
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </div>
  );
}
