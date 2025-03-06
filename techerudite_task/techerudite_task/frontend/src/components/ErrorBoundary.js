import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { fallbackMessage } = this.props;
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-gray-800 p-6">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg mb-6">
            {fallbackMessage || "We encountered an unexpected error."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
