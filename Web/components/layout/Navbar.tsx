import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Layers, Shield, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'Security', path: '/security' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-neutral-950/80 backdrop-blur-xl border-white/10 py-4'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <img src="/logo.jpg" alt="ChatVault Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow object-cover" />
          <span className="text-xl font-bold tracking-tight text-white">
            ChatVault
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-primary-400 ${
                  isActive ? 'text-white' : 'text-neutral-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <User size={16} />
                    <span>{user.email}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={async () => {
                      await signOut();
                      navigate('/');
                    }}
                  >
                    <LogOut size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    Login
                  </NavLink>
                  <Button size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Get Extension</Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-950 border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-neutral-300 hover:text-primary-400"
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="h-px bg-white/10 w-full my-2" />
              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <User size={18} />
                        <span>{user.email}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        variant="secondary"
                        onClick={async () => {
                          await signOut();
                          setMobileOpen(false);
                          navigate('/');
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <NavLink to="/login" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-neutral-300">Login</NavLink>
                      <Button className="w-full" onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Get Extension</Button>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};