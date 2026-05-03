import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <div className="space-y-2">
            <h1 className="text-xl font-semibold">404</h1>
            <p className="text-slate-600">Route not found.</p>
            <Link to="/" className="text-blue-600 hover:underline">
                Go home
            </Link>
        </div>
    );
}
