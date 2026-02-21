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
    { path: "/blogs", label: "Journal" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999]">
      <div className="flex items-center justify-between px-6 md:px-12 py-5 bg-background/10 backdrop-blur-md border-b border-border/10">
        <Link to="/" className="relative z-[101]">
          <span className="micro-text text-primary-foreground tracking-[0.2em]" style={{ color: 'white' }}>
            Art at Central
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="micro-text relative overflow-hidden group"
              style={{ color: 'white' }}
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
              <EyeOff size={16} style={{ color: 'white' }} />
            ) : (
              <Eye size={16} style={{ color: 'white' }} />
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative z-[101] flex flex-col gap-1.5"
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-px transition-all duration-300"
            style={{
              backgroundColor: 'white',
              transform: menuOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
            }}
          />
          <span
            className="block w-5 h-px transition-all duration-300"
            style={{
              backgroundColor: 'white',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-px transition-all duration-300"
            style={{
              backgroundColor: 'white',
              transform: menuOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center gap-8 mix-blend-normal">
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
