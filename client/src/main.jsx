import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignUp from './components/SignUp.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from './components/Login.jsx'
import  Home  from './components/Home.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'

const router = createBrowserRouter([
  {
  path : '/',
  element: <App />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/home',
    element: <Home/>
  },
  {
    path: '/forgotpassword',
    element: <ForgotPassword/>
  }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
