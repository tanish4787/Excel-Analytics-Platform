import axios from "axios"
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"



const AdminRoutes = () => {
    const [isAdmin, setIsAdmin] = useState(null)

    useEffect(() => {

        const checkAdmin = async () => {
            try {
                const res = await axios.get('/api/auth/validate-admin', { withCredentials: true })

                setIsAdmin(res.data?.role === 'admin')

            } catch (error) {
                setIsAdmin(false)
            }
        }

        checkAdmin()
    }, [])

    if (isAdmin === null) return <div>Loading...</div>
    return isAdmin ? <Outlet /> : <Navigate to='/dashboard' />
}


export default AdminRoutes