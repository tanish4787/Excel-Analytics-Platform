// import LandingPage from '../pages/LandingPage'
// import Login from '../pages/Login'
// import Register from '../pages/Register'
// import DashboardLayout from '../components/DashboardLayout'
// import DashboardHome from '../pages/DashboardHome'
// import InsightPage from '../pages/InsightPage'
// import UploadPage from '../pages/UploadPage'
// import History from '../pages/History'
// import Analyze from '../pages/Analyze'
// import AIinsights from '../pages/AIinsights'
// import Admin from '../pages/Admin'

// export const publicRoutes = [

//     {
//         path: '/',
//         element: <DashboardLayout />,
//         children: [
//             { index: true, element: <DashboardHome /> },
//             { path: 'uploads', element: <UploadPage /> },
//             { path: 'insights', element: <InsightPage /> },
//             ,
//         ],
//     },
//     { path: '/login', element: <Login /> },
//     { path: '/register', element: <Register /> },
// ]

// export const privateRoutes = [

//     // { path: '/dashboard', element: <Dashboard /> },
//     { path: '/analyze', element: <Analyze /> },
//     { path: '/history', element: <History /> },
//     { path: '/ai-insights', element: <AIinsights /> },
// ]

// export const adminRoutes = [
//     { path: '/admin', element: <Admin /> },
// ]





import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardLayout from '../components/DashboardLayout';
import DashboardHome from '../pages/DashboardHome';
import InsightPage from '../pages/InsightPage';
import UploadPage from '../pages/UploadPage';
import History from '../pages/History';
import Analyze from '../pages/Analyze';
import AIinsights from '../pages/AIinsights';
import Admin from '../pages/Admin';

export const publicRoutes = [
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
            { index: true, element: <DashboardHome /> },
            { path: 'uploads', element: <UploadPage /> },
            { path: 'insights', element: <InsightPage /> },
        ],
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/landing', element: <LandingPage /> }, // Optional: keep for future
];

export const privateRoutes = [
    { path: '/analyze', element: <Analyze /> },
    { path: '/history', element: <History /> },
    { path: '/ai-insights', element: <AIinsights /> },
];

export const adminRoutes = [
    { path: '/admin', element: <Admin /> },
];
