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
import Repository from './components/Repository';
import Your from './components/Your';
import PreQuestions from './components/PreQuestions';
import PostQuestions from './components/PostQuestions';
import ViewPre from './components/ViewPre';
import GeneralQuestions from './components/GeneralQuestions';

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
    },
    {
        path: '/repository',
        element: <AuthorizeUser><Repository/></AuthorizeUser>
    },
    {
        path: '/your',
        element: <AuthorizeUser><Your/></AuthorizeUser>
    },
    {
        path: '/preQuestions',
        element: <AuthorizeUser><PreQuestions/></AuthorizeUser>
    },
    {
        path: '/postQuestions',
        element: <AuthorizeUser><PostQuestions/></AuthorizeUser>
    },
    {
        path: '/preQuestions/:questionNo/:questionID',
        element: <AuthorizeUser><ViewPre/></AuthorizeUser>
    },
    {
        path: '/generalQuestions',
        element: <AuthorizeUser><GeneralQuestions/></AuthorizeUser>
    }
])

export default function App() {
    return (
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
    )
}