import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Courses from '@models/course/pages/Courses.tsx'
import CreateCourse from '@models/course/pages/CreateCourse.tsx'
import CourseDetails from '@models/course/pages/CourseDetails.tsx'
import EditCourse from '@models/course/pages/EditCourse.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import AppliedCourses from '@models/appliedCourse/pages/AppliedCourses.tsx'
import EditAppliedCourse from '@models/appliedCourse/pages/EditAppliedCourse.tsx'
import DayDetails from '@models/calendar/pages/DayDetails'
import HorizontalCalendar from '@models/calendar/pages/HorizontalCalendar'
import MonthView from '@models/calendar/pages/MonthView'
import WeekView from '@models/calendar/pages/WeekView'
import Home from '@models/Home'
import CreateModule from '@models/module/pages/CreateModule'
import EditModule from '@models/module/pages/EditModule'
import ModuleDetails from '@models/module/pages/ModuleDetails'
import Modules from '@models/module/pages/Modules'
import Login from '@models/login/Login.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AppliedCourseDetails from './models/appliedCourse/pages/AppliedCourseDetails.tsx'

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
    element: <Modules />,
  },
  {
    path: "/modules/details/*",
    element: <ModuleDetails />,
  },
  {
    path: "/modules/edit/*",
    element: <EditModule />,
  },
  {
    path: "/modules/create/*",
    element: <CreateModule />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/courses/details/*",
    element: <CourseDetails />,
  },
  {
    path: "/courses/edit/*",
    element: <EditCourse />,
  },
  {
    path: "/courses/create/*",
    element: <CreateCourse />,
  },
  {
    path: "/calendar/timeline/*",
    element: <HorizontalCalendar />,
  },
  {
    path: "/calendar/month/*",
    element: <MonthView />,
  },
  {
    path: "/calendar/week/*",
    element: <WeekView />,
  },
  {
    path: "/calendar/day/*",
    element: <DayDetails />,
  },
  {
    path: "/activecourses",
    element: <AppliedCourses />,
  },
  {
    path: "/activecourses/edit/*",
    element: <EditAppliedCourse />,
  },
  {
    path: "/activecourses/details/*",
    element: <AppliedCourseDetails />,
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
