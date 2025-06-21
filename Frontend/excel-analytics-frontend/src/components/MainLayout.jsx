import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-64px)] px-4">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default MainLayout;
