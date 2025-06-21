const Footer = () => {
    return (
        <footer className="w-full bg-white border-t mt-10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Excel Analytics. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <a href="/privacy" className="hover:underline">Privacy</a>
                    <a href="/terms" className="hover:underline">Terms</a>
                    <a href="/contact" className="hover:underline">Contact</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
