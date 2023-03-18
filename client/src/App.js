import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/** import all components */
import Username from './components/Username';
import Reset from './components/Reset';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Password from './components/Password';
import PageNotFound from './components/PageNotFound';
import Dashboard from './components/Dashboard';
import Questionnaire from './components/Questionnaire';
import Pre from './components/Pre';
import Post from './components/Post';

// auth middleware
import { AuthorizeUser,ProtectRoute } from './middleware/auth';

/** root routes */
const router = createBrowserRouter([
    {
        path: '/',
        element: <Username></Username>
    },
    {
        path: '/register',
        element: <Register></Register>
    },
    {
        path: '/password',
        element: <ProtectRoute><Password/></ProtectRoute>
    },
    {
        path: '/dashboard',
        element: <AuthorizeUser><Dashboard/></AuthorizeUser>
    },
    {
        path: '/recovery',
        element: <Recovery></Recovery>
    },
    {
        path: '/reset',
        element: <Reset></Reset>
    },
    {
        path: '*',
        element: <PageNotFound></PageNotFound>
    },
    {
        path: '/questionnaire',
        element: <AuthorizeUser><Questionnaire/></AuthorizeUser>
    },
    {
        path: '/pre',
        element: <AuthorizeUser><Pre/></AuthorizeUser>
    },
    {
        path: '/post',
        element: <AuthorizeUser><Post/></AuthorizeUser>
    }
])

export default function App() {
    return (
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
    )
}