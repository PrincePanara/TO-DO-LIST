import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-4 bg-red-100 text-red-900 border border-red-500 m-4 rounded">
          <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
          <pre className="text-sm whitespace-pre-wrap">{this.state.error?.toString()}</pre>
          <pre className="text-xs text-red-700 mt-2">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
