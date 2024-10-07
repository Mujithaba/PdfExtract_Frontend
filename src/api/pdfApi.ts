// import pdfApi from '../services/axios';

// interface UploadResponse {
//   fileId: string;
//   fileUrl: string;
// }

// interface ExtractResponse {
//   downloadId: string;
// }

// export const uploadPDF = async (file: File): Promise<UploadResponse> => {
//   const formData = new FormData();
//   formData.append('pdf', file);

//   try {
//     const response = await pdfApi.post<UploadResponse>('/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     throw new Error('Error uploading file');
//   }
// };

// export const extractPages = async (fileId: string, pages: number[]): Promise<string> => {
//   try {
//     const response = await pdfApi.post<ExtractResponse>('/extract', {
//       fileId,
//       pages
//     });
//     return response.data.downloadId;
//   } catch (error) {
//     console.error('Error extracting pages:', error);
//     throw new Error('Error extracting pages');
//   }
// };

// export const getDownloadURL = (downloadId: string): string => {
//   return `${pdfApi.defaults.baseURL}/download/${downloadId}`;
// };


import pdfApi from '../services/axios';

interface UploadResponse {
  fileId: string;
  fileUrl: string;
}

export const uploadPDF = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await pdfApi.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error uploading file');
  }
};

export const getDownloadURL = (fileId: string): string => {
  return `${pdfApi.defaults.baseURL}/download/${fileId}`;
};
