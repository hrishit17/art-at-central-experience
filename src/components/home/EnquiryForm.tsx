import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const EnquiryForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (triggerRef.current) {
        gsap.fromTo(
          triggerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: triggerRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-24 md:py-40 text-center">
      <p className="micro-text text-muted-foreground mb-4">Get in Touch</p>
      <h2 className="editorial-heading text-foreground text-5xl md:text-7xl mb-8">
        Make an Enquiry
      </h2>
      <p className="body-text text-muted-foreground max-w-lg mx-auto mb-12">
        Interested in a piece, an exhibition, or hosting a private viewing? We'd love to hear from you.
      </p>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="micro-text border border-foreground text-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-500"
      >
        Open Enquiry Form
      </button>

      {/* Sliding Form */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 z-[200]"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={formRef}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] z-[201] glassmorphism bg-background/90 p-8 md:p-12 flex flex-col justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-foreground hover:text-muted-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="editorial-heading text-foreground text-3xl mb-8">Enquiry</h3>

            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Full Name"
                className="input-editorial w-full"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="input-editorial w-full"
              />
              <input
                type="text"
                placeholder="Subject"
                className="input-editorial w-full"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="input-editorial w-full resize-none"
              />
              <button
                type="submit"
                className="micro-text border border-foreground text-foreground px-8 py-4 mt-4 hover:bg-foreground hover:text-background transition-all duration-500 self-start"
              >
                Send Enquiry
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  );
};

export default EnquiryForm;
