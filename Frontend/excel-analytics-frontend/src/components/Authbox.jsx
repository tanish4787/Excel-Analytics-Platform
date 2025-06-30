import React from "react";
import { Link } from "react-router-dom";

const AuthBox = ({ children, activeTab }) => {
    return (
        <div className=" flex items-center justify-center shadow-xl   ">
            <div className="w-full max-w-md rounded-2xl shadow-xl p-6 h-fit sm:p-8 border">

                <div className="text-center mb-6">
                    <div className="flex justify-center mb-2">
                        <div className="transition-all duration-1000 opacity-100 translate-y-0">

                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 mb-6 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-zap w-4 h-4 mr-2"
                                >
                                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                                </svg>
                                AI-Powered Analytics
                            </div>
                        </div>


                    </div>
                    <h2 className="text-xl font-semibold text-indigo-700">Excel Analytics</h2>
                    <p className="text-sm text-gray-500">Welcome back to your analytics platform</p>
                </div>

                <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200">
                    <Link
                        to="/login"
                        className={`w-1/2 py-2 text-center text-sm font-medium ${activeTab === "login"
                            ? "bg-white text-gray-900"
                            : "bg-gray-50 text-gray-400 hover:text-indigo-500"
                            }`}
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className={`w-1/2 py-2 text-center text-sm font-medium ${activeTab === "register"
                            ? "bg-white text-gray-900"
                            : "bg-gray-50 text-gray-400 hover:text-indigo-500"
                            }`}
                    >
                        Sign Up
                    </Link>
                </div>

                <div>{children}</div>
            </div>
        </div>
    )
}

export default AuthBox;
