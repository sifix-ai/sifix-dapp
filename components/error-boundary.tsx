"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Log to monitoring service (optional)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "exception", {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full rounded-xl border border-card-border bg-card p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <h1 className="text-xl font-semibold">Something went wrong</h1>
            </div>

            <p className="text-muted mb-6">
              {this.state.error?.message || "An unexpected error occurred. Please try again."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-colors"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-card-border bg-surface text-foreground hover:bg-card-border transition-colors"
              >
                <Home size={16} />
                Home
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-muted hover:text-foreground">
                  Error details
                </summary>
                <pre className="mt-2 p-3 rounded-lg bg-surface text-xs font-mono overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}