import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { galleryRooms } from "@/data/mockData";

gsap.registerPlugin(ScrollTrigger);

const HorizontalGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden h-screen">
      {/* Header */}
      <div className="absolute top-8 left-6 md:left-12 z-10 pt-16">
        <p className="micro-text text-muted-foreground mb-2">The Spaces</p>
        <h2 className="editorial-heading text-foreground text-4xl md:text-6xl">
          Gallery Rooms
        </h2>
      </div>

      {/* Horizontal Track */}
      <div
        ref={trackRef}
        className="flex items-center h-full gap-8 pl-6 md:pl-12 pt-24"
        style={{ width: "fit-content" }}
      >
        {galleryRooms.map((room) => (
          <div
            key={room.id}
            className="relative flex-shrink-0 h-[70vh] group"
            style={{ width: "70vw" }}
            data-cursor="art"
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground">{room.name}</h3>
              <p className="body-text text-sm text-primary-foreground/70 mt-1 max-w-xs">
                {room.description}
              </p>
            </div>
          </div>
        ))}
        {/* Spacer */}
        <div className="flex-shrink-0 w-[30vw]" />
      </div>
    </section>
  );
};

export default HorizontalGallery;
