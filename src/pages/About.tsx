import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroGallery from "@/assets/hero-gallery.jpg";
import galleryRoom1 from "@/assets/gallery-room-1.jpg";
import galleryRoom2 from "@/assets/gallery-room-2.jpg";

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  { year: "2015", title: "Wild by Nature Global Founded", description: "Established with a vision to connect art, nature, and community across continents." },
  { year: "2018", title: "First Pop-Up Gallery", description: "Our inaugural exhibition in a reclaimed warehouse drew over 2,000 visitors in a single weekend." },
  { year: "2020", title: "Digital Pivot", description: "Launched virtual gallery tours and online exhibitions, reaching a global audience of 50,000+." },
  { year: "2023", title: "Art at Central Opens", description: "Our permanent gallery space opens its doors in the heart of Cape Town's cultural district." },
  { year: "2025", title: "International Expansion", description: "Partnerships with galleries in London, Berlin, and São Paulo bring our vision to a global stage." },
  { year: "2026", title: "The Future", description: "Continuing to push boundaries with immersive installations, artist residencies, and cultural programming." },
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* Hero */}
      <section className="h-[70vh] relative overflow-hidden">
        <img src={heroGallery} alt="Gallery" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40 flex items-end px-6 md:px-12 pb-16">
          <div>
            <p className="micro-text text-primary-foreground/70 mb-4">Our Story</p>
            <h1 className="editorial-heading text-primary-foreground text-5xl md:text-8xl">About Us</h1>
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section className="px-6 md:px-12 py-12 md:py-20 max-w-4xl">
        <h2 className="editorial-heading text-foreground text-4xl md:text-6xl mb-12">
          Wild by Nature Global
        </h2>
        <p className="body-text text-muted-foreground mb-6">
          Wild by Nature Global was born from a simple yet radical belief: that art belongs everywhere, and to everyone. Founded as a collective of artists, curators, and cultural advocates, we set out to dismantle the barriers between art and everyday life.
        </p>
        <p className="body-text text-muted-foreground mb-6">
          Art at Central is the physical manifestation of that belief—a gallery space that refuses to be precious, instead inviting dialogue, provocation, and genuine connection between artwork and audience.
        </p>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-12 py-12 md:py-20 border-t border-border">
        <p className="micro-text text-muted-foreground mb-4">Heritage</p>
        <h2 className="editorial-heading text-foreground text-4xl md:text-6xl mb-16">Our Journey</h2>

        <div className="max-w-3xl">
          {timelineItems.map((item, i) => (
            <div key={i} className="timeline-item flex gap-8 md:gap-16 pb-16 border-l border-border pl-8 relative">
              <div className="absolute left-0 top-0 w-2 h-2 bg-foreground rounded-full -translate-x-[5px]" />
              <div className="flex-shrink-0">
                <span className="font-serif text-2xl md:text-3xl text-foreground">{item.year}</span>
              </div>
              <div>
                <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2">{item.title}</h3>
                <p className="body-text text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Images with Film Grain */}
      <section className="px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-hidden" data-cursor="art">
            <img src={galleryRoom1} alt="Gallery space" className="w-full aspect-[4/3] object-cover film-grain" />
          </div>
          <div className="overflow-hidden md:mt-24" data-cursor="art">
            <img src={galleryRoom2} alt="Gallery space" className="w-full aspect-[4/3] object-cover film-grain" />
          </div>
        </div>
      </section>

      {/* Address & Location */}
      <section className="px-6 md:px-12 py-12 md:py-20 border-t border-border">
        <p className="micro-text text-muted-foreground mb-4">Find Us</p>
        <h2 className="editorial-heading text-foreground text-4xl md:text-6xl mb-12">
          Visit the Gallery
        </h2>
        <p className="font-serif text-foreground text-2xl md:text-4xl leading-relaxed max-w-2xl">
          Building No. 112, 4th Floor,<br />
          Lohia House Building,<br />
          Near By ICICI Bank,<br />
          Chittaranjan Avenue (Central Ave),<br />
          Kolkata Central, Kolkata-700073,<br />
          West Bengal
        </p>
        <a
          href="https://maps.google.com/?q=Building+No+112+Lohia+House+Chittaranjan+Avenue+Kolkata+700073+West+Bengal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-12 micro-text border border-foreground text-foreground px-10 py-5 hover:bg-foreground hover:text-background transition-all duration-500"
        >
          Get Directions
        </a>
      </section>
    </div>
  );
};

export default About;
