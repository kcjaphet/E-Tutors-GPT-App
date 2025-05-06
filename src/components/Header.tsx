import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useMediaQuery } from '@/hooks/use-media-query';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isMobile } = useMediaQuery();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold">e-tutors</h1>
        </Link>

        {isMobile ? (
          <>
            {/* Mobile menu */}
            <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            {showMobileMenu && (
              <div className="fixed inset-0 top-[65px] z-50 bg-background">
                <nav className="container grid gap-4 p-6">
                  <Link to="/products" className="text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Products</Link>
                  <Link to="/pricing" className="text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Pricing</Link>
                  
                  {currentUser ? (
                    <>
                      <Link to="/dashboard" className="text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Dashboard</Link>
                      <Link to="/documents" className="text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Documents</Link>
                      <Link to="/account" className="text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Account</Link>
                      <Button variant="outline" className="mt-4" onClick={handleLogout}>Log Out</Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="text-lg font-medium" onClick={() => setShowMobileMenu(false)}>Log In</Link>
                      <Link to="/signup">
                        <Button className="w-full mt-4" onClick={() => setShowMobileMenu(false)}>
                          Sign Up Free
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Desktop menu */}
            <nav className="flex items-center space-x-6">
              <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
                Products
              </Link>
              <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </Link>
              
              {currentUser && (
                <>
                  <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link to="/documents" className="text-sm font-medium transition-colors hover:text-primary">
                    Documents
                  </Link>
                </>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.email || 'User')}`} />
                        <AvatarFallback>{currentUser.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{currentUser.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/documents">Documents</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account">Account Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign Up Free</Button>
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
