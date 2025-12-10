import React from 'react';

export default class DebugErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error?.message);
        this.setState({ error, errorInfo });
    }

    componentDidUpdate(prevProps, prevState) {
        // Auto-retry once after first error
        if (this.state.hasError && this.state.retryCount === 0) {
            setTimeout(() => {
                this.setState({ hasError: false, retryCount: 1 });
            }, 500);
        }
    }

    handleRetry = () => {
        this.setState(prev => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prev.retryCount + 1
        }));
    };

    render() {
        if (this.state.hasError && this.state.retryCount > 0) {
            // Only show error UI after auto-retry has failed
            return (
                <div style={{ padding: '2rem', background: '#FEF2F2', border: '1px solid #EF4444', borderRadius: '8px', color: '#991B1B', margin: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Something went wrong.</h2>
                    <details open style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
                        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Details</summary>
                        <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', maxHeight: '300px', overflow: 'auto' }}>
                            <p><strong>Error:</strong> {this.state.error?.message || 'Unknown error'}</p>
                            <pre style={{ marginTop: '0.5rem', background: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>
                                {this.state.errorInfo?.componentStack || 'No stack trace'}
                            </pre>
                        </div>
                    </details>
                    <button
                        onClick={this.handleRetry}
                        style={{ padding: '0.5rem 1rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        // During auto-retry, render children (attempt to re-render)
        if (this.state.hasError && this.state.retryCount === 0) {
            return null; // Briefly show nothing during auto-retry
        }

        return this.props.children;
    }
}
