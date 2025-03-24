
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto w-full py-6 md:py-10 border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p>© {currentYear} GPTTextTools. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors focus-ring rounded-md px-2 py-1">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors focus-ring rounded-md px-2 py-1">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://twitter.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors focus-ring rounded-full p-2"
            aria-label="Twitter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
          <a 
            href="https://github.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors focus-ring rounded-full p-2"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
