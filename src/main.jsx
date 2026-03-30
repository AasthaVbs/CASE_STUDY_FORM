import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import "react-toastify/dist/ReactToastify.css"
import "./styles/global.css"
import "../style.css"
import "../style.scss"
import "../responsive.scss"
import "./styles/app-background.css"

ReactDOM.createRoot(document.getElementById(`root`)).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={4200}
          theme="dark"
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          limit={4}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
