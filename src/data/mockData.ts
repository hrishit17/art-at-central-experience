import heroGallery from "@/assets/hero-gallery.jpg";
import artistPortrait from "@/assets/artist-portrait.jpg";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";
import galleryRoom1 from "@/assets/gallery-room-1.jpg";
import galleryRoom2 from "@/assets/gallery-room-2.jpg";
import galleryRoom3 from "@/assets/gallery-room-3.jpg";

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  category: string;
}

export interface Artist {
  id: string;
  name: string;
  portrait: string;
  bio: string;
  quote: string;
  works: { title: string; image: string; year: string }[];
}

export interface GalleryRoom {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const heroImage = heroGallery;

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Echoes of Form",
    date: "March 15 — April 20, 2026",
    description: "A group exhibition exploring the boundaries between sculpture and space.",
    image: artwork2,
    category: "Group Exhibition",
  },
  {
    id: "2",
    title: "Chromatic Tensions",
    date: "April 2 — May 10, 2026",
    description: "Bold abstract works that challenge the viewer's perception of color and emotion.",
    image: artwork1,
    category: "Solo Exhibition",
  },
  {
    id: "3",
    title: "Nature, Abstracted",
    date: "May 1 — June 15, 2026",
    description: "Photography and mixed media exploring nature through an abstracted lens.",
    image: artwork3,
    category: "Photography",
  },
  {
    id: "4",
    title: "Material Memory",
    date: "June 5 — July 20, 2026",
    description: "Mixed media and collage works examining texture, decay, and beauty.",
    image: artwork4,
    category: "Mixed Media",
  },
];

export const featuredArtist: Artist = {
  id: "1",
  name: "Thomas Hargrove",
  portrait: artistPortrait,
  bio: "Thomas Hargrove has been reshaping the contemporary art landscape for over two decades. Born in Cape Town, South Africa, his work bridges the gap between raw emotional expression and meticulous formal composition. His large-scale canvases draw from a deep well of personal history, cultural observation, and an unwavering commitment to the transformative power of art.\n\nHargrove's practice is rooted in the belief that art should create a visceral, almost physical response. His brushwork is at once aggressive and tender, building layers of pigment that reveal fragments of underlying narratives. Each piece is an excavation—a process of adding and removing until the essential truth of the work emerges.\n\nHis exhibitions have spanned galleries in London, New York, Berlin, and Tokyo, earning him recognition as one of the most compelling voices of his generation.",
  quote: "Art is not about what you see. It's about the space between what you see and what you feel—that is where the truth lives.",
  works: [
    { title: "Chromatic Dissolution I", image: artwork1, year: "2024" },
    { title: "Geometric Silence", image: artwork2, year: "2025" },
    { title: "Infrared Canopy", image: artwork3, year: "2025" },
    { title: "Gilded Fragments", image: artwork4, year: "2026" },
  ],
};

export const galleryRooms: GalleryRoom[] = [
  {
    id: "1",
    name: "The Main Hall",
    image: galleryRoom1,
    description: "Our flagship exhibition space featuring rotating contemporary works.",
  },
  {
    id: "2",
    name: "The Vault",
    image: galleryRoom2,
    description: "An intimate space for large-scale, singular installations.",
  },
  {
    id: "3",
    name: "The Salon",
    image: galleryRoom3,
    description: "A warm, contemplative space for immersive viewing experiences.",
  },
];

export const missionWords = [
  "We", "believe", "art", "is", "not", "a", "luxury—", "it", "is", "a",
  "necessity.", "A", "mirror", "held", "up", "to", "the", "world,",
  "reflecting", "truths", "we", "cannot", "yet", "articulate.", "Art", "at",
  "Central", "exists", "to", "bridge", "the", "gap", "between", "the",
  "artist's", "vision", "and", "the", "viewer's", "soul,", "creating",
  "spaces", "where", "transformation", "is", "not", "just", "possible—",
  "it", "is", "inevitable.",
];
