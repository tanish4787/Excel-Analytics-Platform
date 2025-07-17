import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Upload,
  Brain,
  Users,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Smart File Upload",
    description:
      "Drag & drop Excel or CSV files with automatic data validation.",
  },
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description: "Generate beautiful, responsive charts without writing code.",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Get automated analysis, trends, and actionable insights.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share data, manage access, and collaborate in real-time.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance built-in.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Work with your data from anywhere, anytime.",
  },
];

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="text-slate-800">

      <section className="pt-28 pb-16 px-4 text-center">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Zap size={16} /> AI-Powered Analytics
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text mb-4 leading-tight">
              Upload. Analyze. Visualize.
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Turn Excel data into insights with beautiful charts and AI
              summaries, effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg"
              >
                Start Analyzing
                <ArrowRight className="inline ml-2" size={18} />
              </Link>
              <Link
                to="/login" 
                className="border border-gray-300 px-6 py-3 rounded-lg text-lg font-medium text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">Everything You Need</h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-10 text-lg">
            Designed for analysts, teams, and decision-makers who value speed
            and clarity.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 text-left shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="mb-4 p-3 bg-gradient-to-br from-blue-500 to-indigo-500 text-white w-fit rounded-lg shadow-md">
                  <feature.icon size={24} /> 
                </div>
                <h3 className="font-semibold text-xl mb-2 text-gray-800">{feature.title}</h3> 
                <p className="text-slate-600 text-base leading-relaxed">{feature.description}</p> 
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to transform your data?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Join 1,000+ teams already analyzing with Excel Analytics.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-700 px-7 py-3 rounded-lg text-lg font-medium hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;