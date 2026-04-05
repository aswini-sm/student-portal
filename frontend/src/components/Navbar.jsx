import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 block w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-16 flex justify-between items-center w-[100%] max-w-full">
        <div className="flex items-center gap-2 text-indigo-600">
          <GraduationCap size={28} />
          <span className="font-bold text-xl tracking-tight hidden sm:block text-gray-900">Student Portal</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center">
            <span className="text-sm text-gray-500">Welcome back,</span>
            <span className="ml-1 text-sm font-semibold text-gray-900 capitalize">{username}</span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
