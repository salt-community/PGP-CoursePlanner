import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import ModuleDetails from './pages/modulePages/ModuleDetails.tsx'
import EditModule from './pages/modulePages/EditModule.tsx'
import Modules from './pages/modulePages/Modules.tsx'
import CreateModule from './pages/modulePages/CreateModule.tsx'
import Courses from './pages/coursePages/Courses.tsx'
import CreateCourse from './pages/coursePages/CreateCourse.tsx'
import DayDetails from './pages/Home/DayDetails.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/home/*",
    element: <Home />,
  },
  {
    path: "/home/details/*",
    element: <DayDetails/>,
  },
  {
    path: "/modules",
    element: <Modules/>,
  },
  {
    path: "/modules/details/*",
    element: <ModuleDetails/>,
  },
  {
    path: "/modules/edit/*",
    element: <EditModule/>,
  },
  {
    path: "/modules/create/*",
    element: <CreateModule/>,
  },
  {
    path: "/courses",
    element: <Courses/>,
  },
  {
    path: "/courses/create/*",
    element: <CreateCourse/>,
  },
]);

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
