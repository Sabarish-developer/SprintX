import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import App from './App.jsx'
import SignUp from './components/SignUp.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from './components/Login.jsx'
import  Home  from './components/Home.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import SideBarLayout from './components/DashboardLayout.jsx'
import  Settings  from './components/Settings.jsx'
import ErrorPage from './components/ErrorPage.jsx'

const router = createBrowserRouter([
  {
  path : '/',
  element: <App />,
  errorElement: <ErrorPage/>
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/login',
    element: <Login/>
  },
  // {
  //   path: '/home',
  //   element: <Home/>
  // },
  {
    path: '/forgotpassword',
    element: <ForgotPassword/>
  },
  {
    path: '/home',
    element: <SideBarLayout/>,
    children:[
      {
        path:'/home',
        element:<Home/>
      },
      {
        path:'/home/settings',
        element:<Settings/>
      },
    ]
  }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <ToastContainer position={'top-right'} autoClose={3000}/>
  </StrictMode>
)
