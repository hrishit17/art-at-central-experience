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

      // Parallax on images
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-24 md:py-40">
      <p className="micro-text text-muted-foreground mb-4">Upcoming</p>
      <h2 className="editorial-heading text-foreground text-5xl md:text-7xl mb-16 md:mb-24">
        Exhibitions
      </h2>

      {/* Asymmetrical Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Large Card */}
        <div className="event-card col-span-12 md:col-span-7 group" data-cursor="art">
          <div className="overflow-hidden aspect-[4/3]">
            <img
              src={upcomingEvents[0].image}
              alt={upcomingEvents[0].title}
              className="event-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="mt-4">
            <p className="micro-text text-muted-foreground">{upcomingEvents[0].category}</p>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-1">{upcomingEvents[0].title}</h3>
            <p className="body-text text-sm text-muted-foreground mt-2">{upcomingEvents[0].date}</p>
          </div>
        </div>

        {/* Small Card */}
        <div className="event-card col-span-12 md:col-span-5 md:mt-24 group" data-cursor="art">
          <div className="overflow-hidden aspect-[3/4]">
            <img
              src={upcomingEvents[1].image}
              alt={upcomingEvents[1].title}
              className="event-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="mt-4">
            <p className="micro-text text-muted-foreground">{upcomingEvents[1].category}</p>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-1">{upcomingEvents[1].title}</h3>
            <p className="body-text text-sm text-muted-foreground mt-2">{upcomingEvents[1].date}</p>
          </div>
        </div>

        {/* Medium Card */}
        <div className="event-card col-span-12 md:col-span-5 group" data-cursor="art">
          <div className="overflow-hidden aspect-[4/3]">
            <img
              src={upcomingEvents[2].image}
              alt={upcomingEvents[2].title}
              className="event-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="mt-4">
            <p className="micro-text text-muted-foreground">{upcomingEvents[2].category}</p>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-1">{upcomingEvents[2].title}</h3>
            <p className="body-text text-sm text-muted-foreground mt-2">{upcomingEvents[2].date}</p>
          </div>
        </div>

        {/* Tall Card */}
        <div className="event-card col-span-12 md:col-span-7 md:-mt-16 group" data-cursor="art">
          <div className="overflow-hidden aspect-[16/9]">
            <img
              src={upcomingEvents[3].image}
              alt={upcomingEvents[3].title}
              className="event-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="mt-4">
            <p className="micro-text text-muted-foreground">{upcomingEvents[3].category}</p>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-1">{upcomingEvents[3].title}</h3>
            <p className="body-text text-sm text-muted-foreground mt-2">{upcomingEvents[3].date}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
