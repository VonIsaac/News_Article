
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import {QueryClientProvider} from '@tanstack/react-query'
import AdminDashboard from "./components/admin/AdminDashboard"
import {queryClient} from './utils/htttps'
import NewsList from "./components/users/NewsList"
import NewsDetails from "./components/users/NewsDetails"
import SignupForm from "./components/auth/Signup"
import LoginForm from "./components/auth/Login"
function App() {
    const  router = createBrowserRouter([
      {
        path: '/',
        element: <Navigate to={'/user/login'} />
      },
      {
        path: '/user/login',
        element: <LoginForm />
      },
      {
        path: '/user/signup',
        element: <SignupForm />
      },
      {
        path: '/news-list',
        element: <NewsList />
      },
      {
        path: '/news-list/:id',
        element: <NewsDetails />
      },
      {
        path: '/admin',
        element: <AdminDashboard />
      }
    ]);

  return (
    <>
       <QueryClientProvider client={queryClient}>
          <RouterProvider  router={router}/>
       </QueryClientProvider>
    </>
  )
}

export default App
