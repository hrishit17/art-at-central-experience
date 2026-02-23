import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="px-6 md:px-12 py-12">
        {/* Massive Title */}
        <h2
          className="editorial-heading text-foreground leading-none select-none"
          style={{ fontSize: "clamp(3rem, 12vw, 12rem)" }}
        >
          ART AT CENTRAL
        </h2>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div>
            <p className="micro-text text-muted-foreground mb-4">Navigate</p>
            <div className="flex flex-col gap-2">
              <Link to="/" className="body-text text-sm text-foreground hover:text-muted-foreground transition-colors">Home</Link>
              <Link to="/about" className="body-text text-sm text-foreground hover:text-muted-foreground transition-colors">About</Link>
              <Link to="/exhibitions" className="body-text text-sm text-foreground hover:text-muted-foreground transition-colors">Exhibitions</Link>
              <Link to="/blogs" className="body-text text-sm text-foreground hover:text-muted-foreground transition-colors">Journal</Link>
              <Link to="/contact" className="body-text text-sm text-foreground hover:text-muted-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <p className="micro-text text-muted-foreground mb-4">Social</p>
            <div className="flex flex-col gap-2">
              <a href="https://www.facebook.com/share/1CSgLALKed/" target="_blank" rel="noopener noreferrer" className="body-text text-sm text-foreground hover:text-muted-foreground hover:translate-x-1 transition-all duration-300">Facebook</a>
              <a href="https://www.instagram.com/wild_bynature_official?igsh=dHM2dGdpcG01MHJt" target="_blank" rel="noopener noreferrer" className="body-text text-sm text-foreground hover:text-muted-foreground hover:translate-x-1 transition-all duration-300">Instagram</a>
            </div>
          </div>
          <div>
            <p className="micro-text text-muted-foreground mb-4">Visit</p>
            <p className="body-text text-sm text-foreground">
              Building No. 112, 4th Floor<br />
              Lohia House, Chittaranjan Ave<br />
              Kolkata-700073, West Bengal
            </p>
          </div>
          <div>
            <p className="micro-text text-muted-foreground mb-4">Hours</p>
            <p className="body-text text-sm text-foreground">
              Tue — Sat<br />
              10:00 — 18:00<br />
              Sun by appointment
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-16 pt-8 border-t border-border">
          <p className="micro-text text-muted-foreground">
            © 2026 Art at Central. A division of Wild by Nature Global.
          </p>
          <p className="micro-text text-muted-foreground mt-2 md:mt-0">
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
