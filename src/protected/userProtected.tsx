import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";
import PDFExtractor from "../components/pdfExtract";


export default function userProtected() {
    const { userInfo } = useSelector((state: RootState) => state.auth);

    return userInfo ? <PDFExtractor /> : <Navigate to="/" replace />;
}
