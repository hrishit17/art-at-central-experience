import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface NavigationProps {
  onToggleFocusMode: () => void;
  isFocusMode: boolean;
}

const Navigation = ({ onToggleFocusMode, isFocusMode }: NavigationProps) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/exhibitions", label: "Exhibitions" },
    { path: "/blogs", label: "Journal" },
    { path: "/contact", label: "Contact" },
  ];

  // Determine if we're on a page with a dark hero (home, about)
  const isDarkHero = location.pathname === "/" || location.pathname === "/about";

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999]">
      <div
        className="flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-500"
        style={{
          backgroundColor: isDarkHero
            ? 'rgba(0, 0, 0, 0.25)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: isDarkHero
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <Link to="/" className="relative z-[101]">
          <span
            className="micro-text tracking-[0.2em] transition-colors duration-500"
            style={{ color: isDarkHero ? '#ffffff' : 'hsl(0 0% 6%)' }}
          >
            Art at Central
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="micro-text relative overflow-hidden group transition-colors duration-500"
              style={{ color: isDarkHero ? '#ffffff' : 'hsl(0 0% 6%)' }}
            >
              <span className={`inline-block transition-transform duration-300 ${location.pathname === link.path ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {link.label}
              </span>
            </Link>
          ))}
          <button
            onClick={onToggleFocusMode}
            className="ml-4 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Toggle focus mode"
          >
            {isFocusMode ? (
              <EyeOff size={16} style={{ color: isDarkHero ? '#ffffff' : 'hsl(0 0% 6%)' }} />
            ) : (
              <Eye size={16} style={{ color: isDarkHero ? '#ffffff' : 'hsl(0 0% 6%)' }} />
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative z-[101] flex flex-col gap-1.5"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-px transition-all duration-300"
              style={{
                backgroundColor: isDarkHero ? '#ffffff' : 'hsl(0 0% 6%)',
                transform: menuOpen && i === 0 ? 'rotate(45deg) translateY(3.5px)' :
                  menuOpen && i === 2 ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="editorial-heading text-4xl text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              onToggleFocusMode();
              setMenuOpen(false);
            }}
            className="micro-text text-muted-foreground mt-8"
          >
            {isFocusMode ? "Light Mode" : "Focus Mode"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
