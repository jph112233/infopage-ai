import React, { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';
import { ProsperaLogo } from './ProsperaLogo';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple authentication check
    if (username === 'pwihoit' && password === 'Tlawruby12') {
      // Store authentication in sessionStorage
      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('authTimestamp', Date.now().toString());
      onLogin();
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  const corporateTheme = {
    primary: '#09122B',
    secondary: '#14B87C',
    surface: '#F5F7FA',
    accent: '#DCE93B',
    textMain: '#09122B',
    textLight: '#B1B2C9',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: corporateTheme.surface }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: `${corporateTheme.primary}15` }}
            >
              <Lock className="w-8 h-8" style={{ color: corporateTheme.primary }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: corporateTheme.textMain }}>InfoPage AI</h1>
            <p style={{ color: corporateTheme.textLight }}>Please sign in to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                  style={{
                    focusRingColor: corporateTheme.primary,
                    focusBorderColor: corporateTheme.primary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = corporateTheme.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${corporateTheme.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your username"
                  required
                  autoFocus
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = corporateTheme.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${corporateTheme.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              style={{
                backgroundColor: isLoading ? corporateTheme.textLight : corporateTheme.primary,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#0a1a3a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = corporateTheme.primary;
                }
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        {/* Prospera Logo */}
        <div className="mt-16 mb-8 flex justify-center">
          <ProsperaLogo />
        </div>
      </div>
    </div>
  );
};

