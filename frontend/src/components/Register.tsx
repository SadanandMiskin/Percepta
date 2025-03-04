import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import Header from './Header';
import { Loading } from './Loading';

interface GoogleAuthConfig {
  client_id: string;
  callback: (response: GoogleAuthResponse) => void;
}

interface GoogleAuthButtonConfig {
  theme: string;
  size: string;
  width: string;
}
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleAuthConfig) => void;
          renderButton: (element: HTMLElement, config: GoogleAuthButtonConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}
interface GoogleAuthResponse {
  credential: string;
}

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '963221736370-adpd9i7hsr3sn2f6qhkkctc8j177bghq.apps.googleusercontent.com',
        callback: handleGoogleCallback
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignIn")!,
        {
          theme: "outline",
          size: "large",
          width: "100%"
        }
      );
    }
  }, []);

  const handleGoogleCallback = async (response: GoogleAuthResponse) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/google`, {
        token: response.credential
      });
      login(res.data.token, res.data.user);
      navigate('/chat');
    } catch (err) {
      console.error(err);
      setError('Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      login(response.data.token, response.data.user);
      navigate('/chat');
    } catch (err) {
      console.log(err)
      setError( 'An error occurred');
    }finally{
      setIsLoading(false)
    }
  };

  return (
   <>
   <Header />
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-purple-300/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
        <div className='flex max-w-full justify-center items-center gap-3'>
            <img src='p.png' className='w-10'/>
            <h1 className='text-4xl font-bold'>Chat0sm</h1>

          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                disabled={isLoading}
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                disabled={isLoading}

              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                disabled={isLoading}

              />
                          </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>

            <div className="flex flex-col space-y-4">
            {/* <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button> */}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            {isLoading ? (
                           <div className="w-full flex justify-center py-2">
                             <Loading size="medium" color="indigo" message="Processing..." />
                           </div>
                         ) : (
                          <div className='flex justify-center'>

                          <div id="googleSignIn"></div>
                        </div>
                         )}

                         <Link
                           to="/login"
                           className={`text-center text-sm text-indigo-600 hover:text-indigo-500 ${
                             isLoading ? 'pointer-events-none opacity-50' : ''
                           }`}
                         >
                           Already have an account? Login
                         </Link>
          </div>
          </div>
        </form>
      </div>
    </div>
   </>
  );
};
