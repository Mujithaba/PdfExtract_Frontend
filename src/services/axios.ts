// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api/pdf';

// const pdfApi = axios.create({
//   baseURL: API_BASE_URL,
// });

// pdfApi.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );  

// export default pdfApi;

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/pdf';

const pdfApi = axios.create({
  baseURL: API_BASE_URL,
});

pdfApi.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);  

export default pdfApi;
