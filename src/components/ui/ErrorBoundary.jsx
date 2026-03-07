import React from 'react';
import Button from './Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMsg: error.message };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <h1 className="text-4xl font-bold text-neon-purple mb-4">System Malfunction</h1>
                    <p className="text-gray-400 mb-4">Critical event component crashed.</p>
                    <p className="bg-red-500/20 text-red-400 border border-red-500/50 p-4 rounded font-mono text-sm max-w-xl mb-8 whitespace-pre-wrap">{this.state.errorMsg}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Reboot System
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
