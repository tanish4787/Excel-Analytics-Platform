import { useEffect, useState } from "react"
import { Outlet, Navigate } from 'react-router-dom'
import axios from 'axios'

const PrivateRoutes = () => {
    const [auth, setAuth] = useState(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/auth/validate-token', { withCredentials: true, })

                setAuth(res.data?.success)


            } catch (error) {
                setAuth(false)
            }
        }

        checkAuth()
    }, [])

    if (auth === null) return <div>Loading...</div>
    return auth ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoutes