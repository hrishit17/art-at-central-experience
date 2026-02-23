import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { upcomingEvents } from "@/data/mockData";

gsap.registerPlugin(ScrollTrigger);

const UpcomingEvents = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".event-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80 + i * 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Parallax on images — disable on touch devices
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (!isTouchDevice) {
        gsap.utils.toArray<HTMLElement>(".event-image").forEach((img) => {
          gsap.to(img, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-24 md:py-40">
      <p className="micro-text text-muted-foreground mb-4">Upcoming</p>
      <h2 className="editorial-heading text-foreground mb-16 md:mb-24" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>
        Exhibitions
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {upcomingEvents.map((event, i) => {
          const colSpan = i % 2 === 0 ? "md:col-span-7" : "md:col-span-5";
          return (
            <div key={event.id} className={`event-card col-span-1 ${colSpan} group`} data-cursor="art">
              <div className="overflow-hidden aspect-[4/5]">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="event-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                />
              </div>
              <div className="mt-4">
                <p className="micro-text text-muted-foreground">{event.category}</p>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-1">{event.title}</h3>
                <p className="body-text text-sm text-muted-foreground mt-2">{event.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UpcomingEvents;
