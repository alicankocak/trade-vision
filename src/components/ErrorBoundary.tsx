import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', height: '100vh' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <h1 style={{ color: '#e11d48', marginTop: 0 }}>Uygulama Hatası</h1>
                        <p>Bir hata oluştu. Lütfen geliştiriciye bildirin.</p>

                        <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '4px', overflow: 'auto', marginBottom: '20px' }}>
                            <strong style={{ color: '#e11d48', display: 'block', marginBottom: '10px' }}>
                                {this.state.error?.toString()}
                            </strong>
                            <pre style={{ fontSize: '11px', color: '#475569' }}>
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Sayfayı Yenile
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
