import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProtectedRoute from './components/ProtectedRoute.jsx';
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
import Projects from './components/Projects.jsx';
import Tasks from './components/Tasks.jsx';
import ProjectDetails from './components/ProjectDetails.jsx';

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
  {
    path: '/forgotpassword',
    element: <ForgotPassword/>
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <SideBarLayout/>
      </ProtectedRoute>
    ),
    children:[
      {
        path:'/home',
        element:<Home/>
      },
      {
        path:'/home/settings',
        element:<Settings/>
      },
      {
        path: '/home/projects',
        element: <Projects/>
      },
      {
        path: '/home/projects/details',
        element: <ProjectDetails/>
      },
      {
        path: '/home/tasks',
        element: <Tasks/>
      }
    ]
  }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <ToastContainer position={'top-right'} autoClose={3000}/>
  </StrictMode>
)
