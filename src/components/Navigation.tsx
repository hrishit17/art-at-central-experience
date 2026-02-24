import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import gsap from "gsap";
import logo from "@/assets/logo.png";

interface NavigationProps {
  onToggleFocusMode: () => void;
  isFocusMode: boolean;
}

const Navigation = ({ onToggleFocusMode, isFocusMode }: NavigationProps) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);

  const links = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/exhibitions", label: "Exhibitions" },
    { path: "/blogs", label: "Journal" },
    { path: "/contact", label: "Contact" },
  ];

  const isDarkHero = location.pathname === "/" || location.pathname === "/about";

  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(menuRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      if (menuLinksRef.current) {
        gsap.fromTo(
          menuLinksRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.07, delay: 0.15 }
        );
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999]">
      <div
        className="flex items-center justify-between px-6 md:px-12 py-3 transition-all duration-500"
        style={{
          backgroundColor: isDarkHero ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: isDarkHero ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <Link to="/" className="relative z-[101]">
          <img
            src={logo}
            alt="Art at Central"
            className="h-12 md:h-14 w-auto object-contain transition-all duration-500"
            style={{ filter: menuOpen ? 'none' : isDarkHero ? 'invert(1)' : 'none' }}
          />
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
                backgroundColor: menuOpen ? 'hsl(0 0% 6%)' : isDarkHero ? '#ffffff' : 'hsl(0 0% 6%)',
                transform: menuOpen && i === 0 ? 'rotate(45deg) translateY(3.5px)' :
                  menuOpen && i === 2 ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Fullscreen Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center"
          style={{ opacity: 0 }}
        >
          <div ref={menuLinksRef} className="flex flex-col items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="editorial-heading text-4xl text-foreground hover:text-muted-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { onToggleFocusMode(); setMenuOpen(false); }}
              className="micro-text text-muted-foreground mt-8 hover:text-foreground transition-colors"
            >
              {isFocusMode ? "Light Mode" : "Focus Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
