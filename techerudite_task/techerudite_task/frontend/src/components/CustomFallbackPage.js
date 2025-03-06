import React from "react";

const CustomFallbackPage = ({ error, errorInfo }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-gray-800 p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
      <p className="text-lg mb-6">We encountered an error on this page.</p>
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Error Details</h2>
        {error && <p className="text-red-500"><strong>Error:</strong> {error.toString()}</p>}
        {errorInfo && (
          <details className="mt-2 text-gray-600">
            <summary className="cursor-pointer">Stack Trace</summary>
            <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
          </details>
        )}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
      >
        Refresh Page
      </button>
    </div>
  );
};

export default CustomFallbackPage;
