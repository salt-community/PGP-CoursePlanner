import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import Modules from './pages/Modules.tsx'
import ModuleDetails from './pages/ModuleDetails.tsx'
import EditModule from './pages/EditModule.tsx'
import CreateModule from './pages/CreateModule.tsx'

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
]);

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
