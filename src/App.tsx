import PDFExtractor from "./components/pdfExtract";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
     {/* <PDFExtractor/> */}
     <AppRoutes />
    </Router>
  );
}

export default App;
