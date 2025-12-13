'use client';

import React, { useState, useEffect } from 'react';

export default function TestAPIPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, success: boolean, data?: any, error?: any) => {
    setTestResults(prev => [...prev, { test, success, data, error, timestamp: new Date() }]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Test 1: Health check
    try {
      const response = await fetch('/api/v1/health');
      const data = await response.json();
      addResult('Health Check', response.ok, data);
    } catch (error) {
      addResult('Health Check', false, null, error.message);
    }

    // Test 2: Centers endpoint (should work without auth)
    try {
      const response = await fetch('/api/v1/centers');
      const data = await response.json();
      addResult('Get Centers', response.ok, data);
    } catch (error) {
      addResult('Get Centers', false, null, error.message);
    }

    // Test 3: Login with valid credentials
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@inamsos.id', password: 'admin123' })
      });
      const data = await response.json();
      addResult('Login (Valid)', response.ok, data);
    } catch (error) {
      addResult('Login (Valid)', false, null, error.message);
    }

    // Test 4: Login with invalid credentials
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'wrong' })
      });
      const data = await response.json();
      addResult('Login (Invalid)', !response.ok, data); // Should fail
    } catch (error) {
      addResult('Login (Invalid)', false, null, error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">API Integration Test</h1>
          <p className="text-gray-600 mb-6">
            Testing backend API connectivity and functionality
          </p>
          <button
            onClick={runTests}
            disabled={isLoading}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? 'Running Tests...' : 'Run API Tests'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.test}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.success ? 'Success' : 'Failed'}
                    </p>
                    {result.data && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    {result.error && (
                      <p className="mt-2 text-sm text-red-700">{result.error}</p>
                    )}
                  </div>
                  <div className={`ml-4 w-4 h-4 rounded-full flex-shrink-0 ${
                    result.success ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {result.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Environment info */}
        <div className="mt-12 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Environment Information</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
            <p><strong>Backend URL:</strong> {process.env.NODE_ENV === 'production' ? 'https://api.inamsos.id' : 'http://localhost:3001'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>Browser:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-2).join(' ') : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}