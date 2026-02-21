import { useState } from "react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  content: string;
}

const posts: BlogPost[] = [
  {
    id: "1",
    title: "The Quiet Revolution of Minimalism in Contemporary Art",
    excerpt: "How the stripping away of excess has become the most powerful statement in modern galleries.",
    date: "Feb 10, 2026",
    category: "Essay",
    image: artwork2,
    readTime: "8 min read",
    content: "Minimalism in art is often misunderstood as simplicity. But the reality is far more complex. When an artist chooses to reduce their palette, their forms, their gestures—they are making a deliberate decision to amplify what remains. Every line carries the weight of a thousand lines not drawn.\n\nIn our current exhibition 'Echoes of Form,' we see this principle at work across three distinct practices. Each artist arrives at minimalism from a different direction, yet all converge on the same truth: that less is not merely more—it is everything.\n\nThe viewer's role shifts in these encounters. Without the usual visual noise to process, attention sharpens. You begin to notice the grain of the canvas, the slight variance in a supposedly uniform surface, the way light moves differently across a matte versus glossy finish. This is not passive viewing. It is active seeing.",
  },
  {
    id: "2",
    title: "Colour as Language: A Conversation with Thomas Hargrove",
    excerpt: "Our artist of the month discusses the emotional architecture of his chromatic practice.",
    date: "Jan 28, 2026",
    category: "Interview",
    image: artwork1,
    readTime: "12 min read",
    content: "Thomas Hargrove doesn't simply use colour—he speaks it. In a rare studio visit, the South African painter reveals the deeply personal vocabulary that drives his increasingly acclaimed practice.",
  },
  {
    id: "3",
    title: "Why Photography Belongs on Gallery Walls",
    excerpt: "Revisiting the old debate with fresh eyes and a new generation of lens-based artists.",
    date: "Jan 15, 2026",
    category: "Opinion",
    image: artwork3,
    readTime: "6 min read",
    content: "The question of whether photography is 'real art' has been asked and answered a hundred times over. Yet it persists. Perhaps the better question is not whether photography belongs in galleries, but what happens when it's there.",
  },
  {
    id: "4",
    title: "The Alchemy of Mixed Media",
    excerpt: "When artists refuse to choose a single medium, magic happens.",
    date: "Jan 5, 2026",
    category: "Feature",
    image: artwork4,
    readTime: "10 min read",
    content: "Mixed media art is, by its nature, an act of rebellion. It refuses the neat categories that art history so loves to impose. It combines, layers, collides—and in doing so, creates something entirely new.",
  },
];

const Blogs = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [readProgress, setReadProgress] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = target.scrollTop / (target.scrollHeight - target.clientHeight);
    setReadProgress(Math.min(progress * 100, 100));
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen pt-24" onScroll={handleScroll}>
        {/* Reading Progress */}
        <div className="fixed top-0 left-0 w-full h-[2px] z-[200] bg-border">
          <div
            className="h-full bg-foreground transition-all duration-100"
            style={{ width: `${readProgress}%` }}
          />
        </div>

        <div className="px-6 md:px-12 max-w-3xl mx-auto py-12">
          <button
            onClick={() => setSelectedPost(null)}
            className="micro-text text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            ← Back to Journal
          </button>

          <p className="micro-text text-muted-foreground mb-4">
            {selectedPost.category} · {selectedPost.date}
          </p>
          <h1 className="editorial-heading text-foreground text-4xl md:text-6xl mb-8">
            {selectedPost.title}
          </h1>
          <p className="micro-text text-muted-foreground mb-12">{selectedPost.readTime}</p>

          <div className="overflow-hidden mb-12" data-cursor="art">
            <img src={selectedPost.image} alt={selectedPost.title} className="w-full aspect-[16/9] object-cover" />
          </div>

          {selectedPost.content.split("\n\n").map((p, i) => (
            <p key={i} className="body-text text-foreground mb-6 text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      <div className="px-6 md:px-12">
        <p className="micro-text text-muted-foreground mb-4">The</p>
        <h1 className="editorial-heading text-foreground text-5xl md:text-8xl mb-16 md:mb-24">
          Journal
        </h1>

        {/* Editorial Grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Featured Post */}
          <div
            className="col-span-12 md:col-span-8 group cursor-none"
            onClick={() => setSelectedPost(posts[0])}
            data-cursor="art"
          >
            <div className="overflow-hidden aspect-[16/9]">
              <img
                src={posts[0].image}
                alt={posts[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-4">
              <p className="micro-text text-muted-foreground">{posts[0].category} · {posts[0].date}</p>
              <h2 className="font-serif text-2xl md:text-4xl text-foreground mt-2">{posts[0].title}</h2>
              <p className="body-text text-muted-foreground mt-2 max-w-xl">{posts[0].excerpt}</p>
            </div>
          </div>

          {/* Sidebar Posts */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-8">
            {posts.slice(1).map((post) => (
              <div
                key={post.id}
                className="group cursor-none border-t border-border pt-6"
                onClick={() => setSelectedPost(post)}
                data-cursor="art"
              >
                <p className="micro-text text-muted-foreground">{post.category} · {post.readTime}</p>
                <h3 className="font-serif text-xl text-foreground mt-2 group-hover:text-muted-foreground transition-colors">
                  {post.title}
                </h3>
                <p className="body-text text-sm text-muted-foreground mt-1">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
};

export default Blogs;
