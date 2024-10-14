import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
  // </StrictMode>,
)
