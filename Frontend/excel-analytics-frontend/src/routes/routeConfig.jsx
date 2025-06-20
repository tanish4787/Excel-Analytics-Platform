import LandingPage from '../pages/LandingPage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import History from '../pages/History'
import Analyze from '../pages/Analyze'
import AIinsights from '../pages/AIinsights'
import Admin from '../pages/Admin'

export const publicRoutes = [

    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
]

export const privateRoutes = [

    { path: '/dashboard', element: <Dashboard /> },
    { path: '/analyze', element: <Analyze /> },
    { path: '/history', element: <History /> },
    { path: '/ai-insights', element: <AIinsights /> },
]

export const adminRoutes = [
    { path: '/admin ', element: <Admin /> },
]