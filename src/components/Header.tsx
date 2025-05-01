
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Use direct path to logo image with proper URL handling for all environments
  const logoPath = "/lovable-uploads/8a8980a6-d9dd-403a-83d0-5c0b142b0f6e.png";

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2">
            <img 
              src={logoPath}
              alt="e-tutors logo" 
              className="h-12" 
              width="48"
              height="48"
              onError={(e) => {
                console.error("Logo failed to load, trying fallback");
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://api.dicebear.com/6.x/initials/svg?seed=ET";
              }}
            />
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
              to="/products" 
              className={({isActive}) => cn(
                "text-sm transition-colors hover:text-primary focus-ring rounded-md px-2 py-1",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              Products
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({isActive}) => cn(
                "text-sm transition-colors hover:text-primary focus-ring rounded-md px-2 py-1",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              Pricing
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
            <div className="flex items-center gap-2">
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
            className="inline-flex items-center justify-center rounded-full w-8 h-8 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground focus-ring"
            aria-label="Toggle theme"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon hidden dark:block"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun block dark:hidden"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
