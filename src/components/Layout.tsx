import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";

const Layout = () => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    if (isFocusMode) {
      document.documentElement.classList.add("focus-mode");
    } else {
      document.documentElement.classList.remove("focus-mode");
    }
  }, [isFocusMode]);

  return (
    <SmoothScroll>
      <Navigation
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        isFocusMode={isFocusMode}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
    </SmoothScroll>
  );
};

export default Layout;
