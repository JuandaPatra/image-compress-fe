import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-gray-50 to-gray-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                 I
               </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                ImageTools
              </span>
            </div>
            <div className="flex space-x-1 sm:space-x-4">
              <NavLink
                to="/convert"
                className={({ isActive }) =>
                  `px-4 py-2  text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                Convert
              </NavLink>
              <NavLink
                to="/compress"
                className={({ isActive }) =>
                  `px-4 py-2  text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                Compress
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <Outlet />
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
         <p className="text-gray-400 text-sm hover:text-gray-500 transition-colors">
            © {new Date().getFullYear()} ImageTools. Crafted with accuracy.
         </p>
      </footer>
    </div>
  );
};

export default Layout;
