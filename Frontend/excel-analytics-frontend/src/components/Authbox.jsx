import React from 'react';
import { Link } from 'react-router-dom';

const AuthBox = ({ children, activeTab }) => {
    return (
            <div className="flex w-full max-w-5xl mx-auto mt-20 bg-white/50 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20">


            <div className="w-1/2 bg-blue-900 text-white flex flex-col justify-center items-center p-10">
                <h1 className="text-2xl font-bold mb-4">📈 Excel Analytics</h1>
                <p className="text-center text-sm leading-relaxed">
                    Upload. Analyze. Visualize.<br />
                    Turn your spreadsheets into insights.<br /><br />
                    You're one step away from secure, powerful analytics — all in one place.
                </p>
            </div>


            <div className="w-1/2 bg-white p-8">
                <div className="flex justify-around mb-6 text-gray-600 border-b">

                    <Link
                        to="/login"
                        className={`py-2 w-1/2 text-center font-semibold border-b-2 ${activeTab === 'login'
                                ? 'text-blue-600 border-blue-600'
                                : 'border-transparent'
                            }`}
                    >
                        SIGN IN
                    </Link>


                    <Link
                        to="/register"
                        className={`py-2 w-1/2 text-center font-semibold border-b-2 ${activeTab === 'register'
                                ? 'text-blue-600 border-blue-600'
                                : 'border-transparent'
                            }`}
                    >
                        SIGN UP
                    </Link>
                </div>

                {children}
            </div>
        </div>
    )
}

export default AuthBox;
