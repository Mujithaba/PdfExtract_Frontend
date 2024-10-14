import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useDropzone } from "react-dropzone";
import {
  Check,
  FileText,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Upload,
  X,
} from "lucide-react";
import { uploadPDF } from "../api/pdfApi";
import { PDFDocument } from "pdf-lib";
import "react-pdf/dist/Page/TextLayer.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/slice/authSlice";

interface AlertProps {
  type: "error" | "success";
  message: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => (
  <div
    className={`p-4 mb-4 rounded-md ${
      type === "error"
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    <div className="flex">
      <AlertCircle className="h-5 w-5 mr-2" />
      <span>{message}</span>
    </div>
  </div>
);

const LoginAlert: React.FC<{
  onClose: () => void;
  onNavigateToLogin: () => void;
}> = ({ onClose, onNavigateToLogin }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Not Logged In</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="mb-6 text-gray-700">
          You need to be logged in to upload and process PDF files.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onNavigateToLogin}
            className="bg-gray-950 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const PDFExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [scale, setScale] = useState(1);
  const [key, setKey] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
console.log(userInfo,"userinfo");

const navigate = useNavigate()
const dispatch = useDispatch()

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }, []);


  const handleLogout =()=>{

    dispatch(logOut());
    navigate("/login");
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!userInfo) {
        setShowLoginAlert(true);
        return;
      }

      const selectedFile = acceptedFiles[0];
      if (selectedFile && selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        handleUpload(selectedFile);
      } else {
        showAlert("error", "Please select a valid PDF file");
      }
    },
    [userInfo]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handlePageToggle = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const handleUpload = async (selectedFile: File) => {
    try {
      const { fileId } = await uploadPDF(selectedFile);
      setFileId(fileId);
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);
      showAlert("success", "File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      showAlert(
        "error",
        "Error uploading file: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleExtract = async () => {
    if (!file || selectedPages.length === 0) {
      showAlert("error", "Please upload a file and select pages to extract");
      return;
    }
    try {
      const pdfDoc = await PDFDocument.create();
      const existingPdfBytes = await fetch(pdfUrl!).then((res) =>
        res.arrayBuffer()
      );
      const existingPdfDoc = await PDFDocument.load(existingPdfBytes);

      for (const pageNum of selectedPages) {
        const [copiedPage] = await pdfDoc.copyPages(existingPdfDoc, [
          pageNum - 1,
        ]);
        pdfDoc.addPage(copiedPage);
      }

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

      const link = document.createElement("a");
      link.href = pdfDataUri;
      link.download = "extracted-pages.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showAlert("success", "Pages extracted and download started");

      // Reset the component state
      setFile(null);
      setNumPages(null);
      setFileId(null);
      setSelectedPages([]);
      setPdfUrl(null);
      setScale(1);
      setKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error extracting pages:", error);
      showAlert(
        "error",
        "Error extracting pages: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const showAlert = (type: "error" | "success", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleZoomIn = () =>
    setScale((prevScale) => Math.min(prevScale + 0.2, 2));
  const handleZoomOut = () =>
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.6));

 
  const handleNavigateToLogin = () => {
    navigate("/login");
    console.log("Navigating to login page");
  };

  return (
    <div key={key} className="container mx-auto p-4 max-w-4xl">
    {userInfo && (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-gray-400 ms-56">
      PDF Page Extractor
    </h1>
    <button className="bg-gray-950 p-2 font-mono rounded text-white text-sm hover:bg-gray-800 transition" onClick={handleLogout}>
      Logout
    </button>
  </div>
)}



      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="mb-6 bg-gray-500 p-6 rounded-lg shadow-md">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-50 hover:text-gray-900" />
          <p className="mt-2 text-sm font-medium text-gray-900">
            {isDragActive
              ? "Drop the PDF file here"
              : "Drag & drop a PDF file here, or click to select"}
          </p>
          <p className="mt-1 text-xs text-gray-900">
            Only PDF files are accepted
          </p>
          {file && (
            <p className="mt-2 text-sm text-blue-500 font-semibold">
              Selected file: {file.name}
            </p>
          )}
        </div>
      </div>

      {pdfUrl && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            PDF Preview
          </h2>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleZoomOut}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l transition duration-300"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r transition duration-300"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="border border-gray-300 p-4 rounded-lg"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {numPages &&
                Array.from(new Array(numPages), (_, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedPages.includes(index + 1)
                        ? "ring-4 ring-blue-500 rounded-lg"
                        : ""
                    }`}
                    onClick={() => handlePageToggle(index + 1)}
                  >
                    <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md">
                      <Page
                        pageNumber={index + 1}
                        width={150 * scale}
                        scale={scale}
                        className="absolute inset-0 w-full h-full object-contain"
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          selectedPages.includes(index + 1)
                            ? "bg-blue-500 bg-opacity-30"
                            : "bg-black bg-opacity-0 hover:bg-opacity-30"
                        } transition-opacity duration-300`}
                      >
                        <span
                          className={`text-white font-bold ${
                            selectedPages.includes(index + 1)
                              ? "opacity-100"
                              : "opacity-0"
                          } transition-opacity duration-300`}
                        >
                          Page {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedPages.includes(index + 1)
                            ? "bg-blue-500 border-white"
                            : "bg-white border-gray-300"
                        } flex items-center justify-center transition-colors duration-300`}
                      >
                        {selectedPages.includes(index + 1) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Document>
        </div>
      )}

      {fileId && selectedPages.length > 0 && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Selected Pages
          </h2>
          <p className="mb-4 text-gray-600">
            Pages selected: {selectedPages.join(", ")}
          </p>
          <button
            onClick={handleExtract}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition duration-300 shadow-md"
          >
            <Check className="w-5 h-5 mr-2" />
            Extract Selected Pages
          </button>
        </div>
      )}

      {showLoginAlert && (
        <LoginAlert
          onClose={() => setShowLoginAlert(false)}
          onNavigateToLogin={handleNavigateToLogin}
        />
      )}
    </div>
  );
};

export default PDFExtractor;


// import React, { useState, useEffect, useCallback } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { useDropzone } from 'react-dropzone';
// import { Check, FileText, AlertCircle, ZoomIn, ZoomOut, Upload } from 'lucide-react';
// import { uploadPDF } from '../api/pdfApi';
// import { PDFDocument } from 'pdf-lib';
// import 'react-pdf/dist/Page/TextLayer.css';

// interface AlertProps {
//   type: 'error' | 'success';
//   message: string;
// }

// const Alert: React.FC<AlertProps> = ({ type, message }) => (
//   <div className={`p-4 mb-4 rounded-md ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//     <div className="flex">
//       <AlertCircle className="h-5 w-5 mr-2" />
//       <span>{message}</span>
//     </div>
//   </div>
// );

// const PDFExtractor: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [fileId, setFileId] = useState<string | null>(null);
//   const [selectedPages, setSelectedPages] = useState<number[]>([]);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [alert, setAlert] = useState<AlertProps | null>(null);
//   const [scale, setScale] = useState(1);
//   const [key, setKey] = useState(0);

//   useEffect(() => {
//     pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
//   }, []);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const selectedFile = acceptedFiles[0];
//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//       handleUpload(selectedFile);
//     } else {
//       showAlert('error', 'Please select a valid PDF file');
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 'application/pdf': ['.pdf'] },
//     multiple: false,
//   });

//   const handlePageToggle = (pageNum: number) => {
//     setSelectedPages((prev) =>
//       prev.includes(pageNum)
//         ? prev.filter((p) => p !== pageNum)
//         : [...prev, pageNum].sort((a, b) => a - b)
//     );
//   };

//   const handleUpload = async (selectedFile: File) => {
//     try {
//       const { fileId } = await uploadPDF(selectedFile);
//       setFileId(fileId);
//       const url = URL.createObjectURL(selectedFile);
//       setPdfUrl(url);
//       showAlert('success', 'File uploaded successfully');
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       showAlert('error', 'Error uploading file: ' + (error instanceof Error ? error.message : 'Unknown error'));
//     }
//   };

//   const handleExtract = async () => {
//     if (!file || selectedPages.length === 0) {
//       showAlert('error', 'Please upload a file and select pages to extract');
//       return;
//     }
//     try {
//       const pdfDoc = await PDFDocument.create();
//       const existingPdfBytes = await fetch(pdfUrl!).then(res => res.arrayBuffer());
//       const existingPdfDoc = await PDFDocument.load(existingPdfBytes);

//       for (const pageNum of selectedPages) {
//         const [copiedPage] = await pdfDoc.copyPages(existingPdfDoc, [pageNum - 1]);
//         pdfDoc.addPage(copiedPage);
//       }

//       const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

//       const link = document.createElement('a');
//       link.href = pdfDataUri;
//       link.download = 'extracted-pages.pdf';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       showAlert('success', 'Pages extracted and download started');

//       // Reset the component state
//       setFile(null);
//       setNumPages(null);
//       setFileId(null);
//       setSelectedPages([]);
//       setPdfUrl(null);
//       setScale(1);
//       setKey(prevKey => prevKey + 1);
//     } catch (error) {
//       console.error('Error extracting pages:', error);
//       showAlert('error', 'Error extracting pages: ' + (error instanceof Error ? error.message : 'Unknown error'));
//     }
//   };

//   const showAlert = (type: 'error' | 'success', message: string) => {
//     setAlert({ type, message });
//     setTimeout(() => setAlert(null), 5000);
//   };

//   const handleZoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 2));
//   const handleZoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.6));

//   return (
//     <div key={key} className="container mx-auto p-4 max-w-4xl">
//       <h1 className="text-3xl font-bold mb-6 text-gray-400 flex justify-center">PDF Page Extractor</h1>

//       {alert && <Alert type={alert.type} message={alert.message} />}

//       <div className="mb-6 bg-gray-500 p-6 rounded-lg shadow-md">
//         <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
//           <input {...getInputProps()} />
//           <Upload className="mx-auto h-12 w-12 text-gray-50 hover:text-gray-900" />
//           <p className="mt-2 text-sm font-medium text-gray-900">
//             {isDragActive ? 'Drop the PDF file here' : 'Drag & drop a PDF file here, or click to select'}
//           </p>
//           <p className="mt-1 text-xs text-gray-500">
//             Only PDF files are accepted
//           </p>
//           {file && (
//             <p className="mt-2 text-sm text-blue-500 font-semibold">
//               Selected file: {file.name}
//             </p>
//           )}
//         </div>
//       </div>

//       {pdfUrl && (
//         <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">PDF Preview</h2>
//           <div className="flex justify-center mb-4">
//             <button
//               onClick={handleZoomOut}
//               className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l transition duration-300"
//             >
//               <ZoomOut className="w-4 h-4" />
//             </button>
//             <button
//               onClick={handleZoomIn}
//               className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r transition duration-300"
//             >
//               <ZoomIn className="w-4 h-4" />
//             </button>
//           </div>
//           <Document
//             file={pdfUrl}
//             onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//             className="border border-gray-300 p-4 rounded-lg"
//           >
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {numPages && Array.from(new Array(numPages), (_, index) => (
//                 <div
//                   key={`page_${index + 1}`}
//                   className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
//                     selectedPages.includes(index + 1) ? 'ring-4 ring-blue-500 rounded-lg' : ''
//                   }`}
//                   onClick={() => handlePageToggle(index + 1)}
//                 >
//                   <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md">
//                     <Page
//                       pageNumber={index + 1}
//                       width={150 * scale}
//                       scale={scale}
//                       className="absolute inset-0 w-full h-full object-contain"
//                       renderAnnotationLayer={false}
//                       renderTextLayer={false}
//                     />
//                     <div className={`absolute inset-0 flex items-center justify-center ${
//                       selectedPages.includes(index + 1) ? 'bg-blue-500 bg-opacity-30' : 'bg-black bg-opacity-0 hover:bg-opacity-30'
//                     } transition-opacity duration-300`}>
//                       <span className={`text-white font-bold ${
//                         selectedPages.includes(index + 1) ? 'opacity-100' : 'opacity-0'
//                       } transition-opacity duration-300`}>Page {index + 1}</span>
//                     </div>
//                   </div>
//                   <div className="absolute top-2 right-2">
//                     <div className={`w-6 h-6 rounded-full border-2 ${
//                       selectedPages.includes(index + 1)
//                         ? 'bg-blue-500 border-white'
//                         : 'bg-white border-gray-300'
//                     } flex items-center justify-center transition-colors duration-300`}>
//                       {selectedPages.includes(index + 1) && (
//                         <Check className="w-4 h-4 text-white" />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Document>
//         </div>
//       )}

//       {fileId && selectedPages.length > 0 && (
//         <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Selected Pages</h2>
//           <p className="mb-4 text-gray-600">Pages selected: {selectedPages.join(', ')}</p>
//           <button
//             onClick={handleExtract}
//             className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition duration-300 shadow-md"
//           >
//             <Check className="w-5 h-5 mr-2" />
//             Extract Selected Pages
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFExtractor;
