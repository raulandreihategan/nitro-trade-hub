
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-xl md:text-2xl font-display font-bold text-nitro-700">
            NITRO<span className="text-nitro-500">GAMES</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-nitro-600'
                  : 'text-gray-700 hover:text-nitro-500 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="ml-4">
            <Button className="btn-primary flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? 
            <X className="h-6 w-6" /> : 
            <Menu className="h-6 w-6" />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden flex flex-col pt-20`}
      >
        <div className="container px-4 py-6 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-nitro-600 bg-nitro-50'
                  : 'text-gray-700 hover:text-nitro-500 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="mt-6">
            <Button className="w-full btn-primary flex items-center justify-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
