import { Link } from 'react-router-dom';
import Button from './Button';

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple opacity-50">404</h1>
            <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-gray-400 mb-8">The system cannot locate the requested resource. Check your coordinates.</p>
            <Link to="/">
                <Button variant="primary">Return to Base</Button>
            </Link>
        </div>
    );
};
export default ErrorPage;
