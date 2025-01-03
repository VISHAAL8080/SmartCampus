import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { UserRole } from '../../types/auth';
import { useAuth } from './hooks/useAuth';

const roleConfig = {
  admin: {
    title: 'Admin Login',
    icon: <UserCircle className="w-12 h-12 text-blue-600" />,
    color: 'blue'
  },
  faculty: {
    title: 'Faculty Login',
    icon: <UserCircle className="w-12 h-12 text-green-600" />,
    color: 'green'
  },
  student: {
    title: 'Student Login',
    icon: <UserCircle className="w-12 h-12 text-purple-600" />,
    color: 'purple'
  }
};

export default function LoginForm() {
  const { userType } = useParams<{ userType: UserRole }>();
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');

  const config = roleConfig[userType as UserRole];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login(registerNumber, password, userType as UserRole);
    if (result.success) {
      navigate(`/${userType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="flex flex-col items-center mb-8">
          {config.icon}
          <h2 className="text-2xl font-bold text-gray-900 mt-4">{config.title}</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Register Number
            </label>
            <input
              type="text"
              required
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your register number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${config.color}-600 hover:bg-${config.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.color}-500 disabled:opacity-50`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}