import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  LogOut,
  Menu,
  User,
  X,
  Settings,
  Users,
  Key,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMobile();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Don't render Navbar on auth page
  if (location === "/auth") {
    return null;
  }

  const isLanding = location === "/";

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <FileText className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">AI Resume Builder</span>
              </a>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLanding ? (
              <>
                <a href="#features" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary">
                  Features
                </a>
                <a href="#templates" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary">
                  Templates
                </a>
                {user ? (
                  <Button asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/auth">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth">Register</Link>
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/dashboard' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                    Dashboard
                  </a>
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium ${location.startsWith('/admin') ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                      Admin
                    </a>
                  </Link>
                )}
                
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {user.name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <a className="flex items-center cursor-pointer w-full">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </a>
                        </Link>
                      </DropdownMenuItem>
                      {user.isAdmin && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/users">
                              <a className="flex items-center cursor-pointer w-full">
                                <Users className="mr-2 h-4 w-4" />
                                <span>Manage Users</span>
                              </a>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/resumes">
                              <a className="flex items-center cursor-pointer w-full">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Manage Resumes</span>
                              </a>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/api-keys">
                              <a className="flex items-center cursor-pointer w-full">
                                <Key className="mr-2 h-4 w-4" />
                                <span>API Keys</span>
                              </a>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isLanding ? (
              <>
                <a 
                  href="#features" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#templates" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Templates
                </a>
                {user ? (
                  <Link href="/dashboard">
                    <a 
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-blue-600 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth">
                      <a 
                        className="block px-3 py-2 rounded-md text-base font-medium text-primary bg-white border border-primary hover:bg-blue-50 text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </a>
                    </Link>
                    <Link href="/auth">
                      <a 
                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-blue-600 text-center mt-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </a>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <a 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/dashboard' ? 'text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                </Link>
                
                <Link href="/profile">
                  <a 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/profile' ? 'text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </a>
                </Link>
                
                {user?.isAdmin && (
                  <>
                    <Link href="/admin">
                      <a 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/admin' ? 'text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </a>
                    </Link>
                    <Link href="/admin/users">
                      <a 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/admin/users' ? 'text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Manage Users
                      </a>
                    </Link>
                    <Link href="/admin/resumes">
                      <a 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/admin/resumes' ? 'text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Manage Resumes
                      </a>
                    </Link>
                    <Link href="/admin/api-keys">
                      <a 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/admin/api-keys' ? 'text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        API Keys
                      </a>
                    </Link>
                  </>
                )}
                
                <button
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50 text-left"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
