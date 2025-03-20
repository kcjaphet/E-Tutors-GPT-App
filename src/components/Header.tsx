
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              GPTTextTools
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
              to="/tools" 
              className={({isActive}) => cn(
                "text-sm transition-colors hover:text-primary focus-ring rounded-md px-2 py-1",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              Tools
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
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
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
