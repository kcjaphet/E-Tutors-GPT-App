
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              CompanyName
            </span>
          </NavLink>
          
          <nav className="hidden md:flex items-center gap-6">
            <NavLink 
              to="/" 
              className={({isActive}) => cn(
                "text-sm transition-colors hover:text-primary focus-ring rounded-md px-2 py-1",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className={({isActive}) => cn(
                "text-sm transition-colors hover:text-primary focus-ring rounded-md px-2 py-1",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              About
            </NavLink>
            <NavLink 
              to="/services" 
              className={({isActive}) => cn(
                "text-sm transition-colors hover:text-primary focus-ring rounded-md px-2 py-1",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              Services
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({isActive}) => cn(
                "text-sm transition-colors hover:text-primary focus-ring rounded-md px-2 py-1",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              Contact
            </NavLink>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="text-sm hidden md:block">
                Hello, {currentUser.displayName || currentUser.email}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-sm"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/signup')}
                className="text-sm"
              >
                Sign up
              </Button>
            </div>
          )}
          
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="container py-3 space-y-1">
            <NavLink 
              to="/" 
              className={({isActive}) => cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className={({isActive}) => cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/services" 
              className={({isActive}) => cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({isActive}) => cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive ? "bg-gray-100 dark:bg-gray-800 text-primary" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
            
            {!currentUser && (
              <div className="pt-2 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
