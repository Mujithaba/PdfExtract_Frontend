

// // export default PDFExtractor;
// import React, { useState, useEffect } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { Upload, Check } from 'lucide-react';
// import { uploadPDF } from '../api/pdfApi';
// import { PDFDocument } from 'pdf-lib'; // Importing pdf-lib
// import 'react-pdf/dist/Page/TextLayer.css';
// import { message } from 'antd';

// const PDFExtractor: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [fileId, setFileId] = useState<string | null>(null);
//   const [selectedPages, setSelectedPages] = useState<number[]>([]);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   useEffect(() => {
//     // Set worker source for PDF.js
//     pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
//   }, []);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//     } else {
//       message.error('Please select a valid PDF file');
//     }
//   };

//   const handlePageToggle = (pageNum: number) => {
//     setSelectedPages((prev) =>
//       prev.includes(pageNum)
//         ? prev.filter((p) => p !== pageNum)
//         : [...prev, pageNum].sort((a, b) => a - b)
//     );
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       message.error('Please select a file first');
//       return;
//     }
//     try {
//       const { fileId } = await uploadPDF(file);
//       setFileId(fileId);
//       // Set PDF URL after successful upload
//       const url = URL.createObjectURL(file);
//       setPdfUrl(url);
//       message.success('File uploaded successfully');
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       message.error('Error uploading file: ' + (error instanceof Error ? error.message : 'Unknown error'));
//     }
//   };

//   const handleExtract = async () => {
//     if (!file || selectedPages.length === 0) {
//       message.error('Please upload a file and select pages to extract');
//       return;
//     }
//     try {
//       // Create a new PDF document
//       const pdfDoc = await PDFDocument.create();
//       const existingPdfBytes = await fetch(pdfUrl!).then(res => res.arrayBuffer());
//       const existingPdfDoc = await PDFDocument.load(existingPdfBytes);

//       // Copy the selected pages to the new PDF document
//       for (const pageNum of selectedPages) {
//         const [copiedPage] = await pdfDoc.copyPages(existingPdfDoc, [pageNum - 1]);
//         pdfDoc.addPage(copiedPage);
//       }

//       // Serialize the PDF document to bytes (a Uint8Array)
//       const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

//       // Create a link element and trigger download
//       const link = document.createElement('a');
//       link.href = pdfDataUri;
//       link.download = 'extracted-pages.pdf';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       message.success('Pages extracted and download started');
//     } catch (error) {
//       console.error('Error extracting pages:', error);
//       message.error('Error extracting pages: ' + (error instanceof Error ? error.message : 'Unknown error'));
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">PDF Page Extractor</h1>

//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF</label>
//         <div className="flex items-center">
//           <input
//             type="file"
//             onChange={handleFileChange}
//             accept=".pdf"
//             className="hidden"
//             id="pdf-upload"
//           />
//           <label
//             htmlFor="pdf-upload"
//             className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
//           >
//             <Upload className="w-4 h-4 mr-2" />
//             Choose File
//           </label>
//           <span className="ml-3">{file ? file.name : 'No file chosen'}</span>
//         </div>
//         {file && !fileId && (
//           <button
//             onClick={handleUpload}
//             className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
//           >
//             <Upload className="w-4 h-4 mr-2" />
//             Upload PDF
//           </button>
//         )}
//       </div>

//       {pdfUrl && (
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold mb-4">PDF Preview</h2>
//           <Document
//             file={pdfUrl}
//             onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//             className="border border-gray-300 p-4"
//           >
//             {numPages && Array.from(new Array(numPages), (_, index) => (
//               <div key={`page_${index + 1}`} className="mb-4">
//                 <Page
//                   pageNumber={index + 1}
//                   width={300}
//                   className="border border-gray-200"
//                 />
//                 <label className="flex items-center mt-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedPages.includes(index + 1)}
//                     onChange={() => handlePageToggle(index + 1)}
//                     className="form-checkbox h-5 w-5 text-blue-600"
//                   />
//                   <span className="ml-2 text-gray-700">
//                     Select Page {index + 1}
//                   </span>
//                 </label>
//               </div>
//             ))}
//           </Document>
//         </div>
//       )}

//       {fileId && selectedPages.length > 0 && (
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold mb-4">Selected Pages</h2>
//           <p className="mb-2">Pages selected: {selectedPages.join(', ')}</p>
//           <button
//             onClick={handleExtract}
//             className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
//           >
//             <Check className="w-4 h-4 mr-2" />
//             Extract Selected Pages
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFExtractor;
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Upload, Check, FileText, AlertCircle } from 'lucide-react';
import { uploadPDF } from '../api/pdfApi';
import { PDFDocument } from 'pdf-lib';
import 'react-pdf/dist/Page/TextLayer.css';

const Alert: React.FC<{ type: 'error' | 'success'; message: string }> = ({ type, message }) => (
  <div className={`p-4 mb-4 rounded-md ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
    <div className="flex">
      <AlertCircle className="h-5 w-5 mr-2" />
      <span>{message}</span>
    </div>
  </div>
);

const PDFExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      showAlert('error', 'Please select a valid PDF file');
    }
  };

  const handlePageToggle = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  const handleUpload = async () => {
    if (!file) {
      showAlert('error', 'Please select a file first');
      return;
    }
    try {
      const { fileId } = await uploadPDF(file);
      setFileId(fileId);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      showAlert('success', 'File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      showAlert('error', 'Error uploading file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleExtract = async () => {
    if (!file || selectedPages.length === 0) {
      showAlert('error', 'Please upload a file and select pages to extract');
      return;
    }
    try {
      const pdfDoc = await PDFDocument.create();
      const existingPdfBytes = await fetch(pdfUrl!).then(res => res.arrayBuffer());
      const existingPdfDoc = await PDFDocument.load(existingPdfBytes);

      for (const pageNum of selectedPages) {
        const [copiedPage] = await pdfDoc.copyPages(existingPdfDoc, [pageNum - 1]);
        pdfDoc.addPage(copiedPage);
      }

      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = 'extracted-pages.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showAlert('success', 'Pages extracted and download started');
    } catch (error) {
      console.error('Error extracting pages:', error);
      showAlert('error', 'Error extracting pages: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const showAlert = (type: 'error' | 'success', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Clear alert after 5 seconds
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">PDF Page Extractor</h1>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF</label>
        <div className="flex items-center">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </label>
          <span className="ml-3 text-gray-600">{file ? file.name : 'No file chosen'}</span>
        </div>
        {file && !fileId && (
          <button
            onClick={handleUpload}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload PDF
          </button>
        )}
      </div>

      {pdfUrl && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">PDF Preview</h2>
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="border border-gray-300 p-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {numPages && Array.from(new Array(numPages), (_, index) => (
                <div key={`page_${index + 1}`} className="flex flex-col items-center">
                  <Page
                    pageNumber={index + 1}
                    width={150}
                    className="border border-gray-200 shadow-sm"
                  />
                  <label className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={selectedPages.includes(index + 1)}
                      onChange={() => handlePageToggle(index + 1)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Page {index + 1}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </Document>
        </div>
      )}

      {fileId && selectedPages.length > 0 && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Selected Pages</h2>
          <p className="mb-2 text-gray-600">Pages selected: {selectedPages.join(', ')}</p>
          <button
            onClick={handleExtract}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
          >
            <Check className="w-4 h-4 mr-2" />
            Extract Selected Pages
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFExtractor;