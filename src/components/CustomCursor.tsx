import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHoveringArt, setIsHoveringArt] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      if (isHoveringLink) {
        // Magnetic snap - slight lag
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power3.out" });
      } else {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
      }
    };

    const onArtEnter = () => setIsHoveringArt(true);
    const onArtLeave = () => setIsHoveringArt(false);
    const onLinkEnter = () => setIsHoveringLink(true);
    const onLinkLeave = () => setIsHoveringLink(false);

    window.addEventListener("mousemove", onMouseMove);

    // Observe DOM for art-cursor and link elements
    const attachListeners = () => {
      document.querySelectorAll("[data-cursor='art']").forEach((el) => {
        el.addEventListener("mouseenter", onArtEnter);
        el.addEventListener("mouseleave", onArtLeave);
      });
      document.querySelectorAll("a, button, [data-cursor='link']").forEach((el) => {
        el.addEventListener("mouseenter", onLinkEnter);
        el.addEventListener("mouseleave", onLinkLeave);
      });
    };

    attachListeners();
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, [isHoveringLink]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (isHoveringArt) {
      gsap.to(cursor, {
        width: 80,
        height: 80,
        borderRadius: "50%",
        duration: 0.4,
        ease: "power3.out",
      });
      if (textRef.current) {
        gsap.to(textRef.current, { opacity: 1, duration: 0.3 });
      }
    } else {
      gsap.to(cursor, {
        width: 8,
        height: 8,
        borderRadius: "50%",
        duration: 0.3,
        ease: "power3.out",
      });
      if (textRef.current) {
        gsap.to(textRef.current, { opacity: 0, duration: 0.2 });
      }
    }
  }, [isHoveringArt]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    if (isHoveringLink && !isHoveringArt) {
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: "power3.out" });
    } else if (!isHoveringArt) {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power3.out" });
    }
  }, [isHoveringLink, isHoveringArt]);

  // Hide on touch devices
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;
  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{
        width: 8,
        height: 8,
        background: isHoveringArt
          ? "hsl(var(--foreground) / 0.15)"
          : "hsl(var(--foreground))",
        backdropFilter: isHoveringArt ? "blur(20px)" : "none",
        border: isHoveringArt ? "1px solid hsl(var(--foreground) / 0.3)" : "none",
        mixBlendMode: isHoveringArt ? "normal" : "difference",
        borderRadius: "50%",
        willChange: "transform",
      }}
    >
      <span
        ref={textRef}
        className="micro-text text-foreground opacity-0 select-none"
        style={{ fontSize: "0.55rem", letterSpacing: "0.2em" }}
      >
        VIEW
      </span>
    </div>
  );
};

export default CustomCursor;
