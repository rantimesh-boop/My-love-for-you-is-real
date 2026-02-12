import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MEMES = [
  // Using descriptive Unsplash keywords for "couple fun" as placeholders
  { 
    id: 1, 
    url: "https://images.unsplash.com/photo-1516575334481-f85287c2c81d?w=800&auto=format&fit=crop", 
    caption: "Us trying to decide what to eat" 
  },
  { 
    id: 2, 
    url: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop", 
    caption: "When you steal my hoodie" 
  },
  { 
    id: 3, 
    url: "https://images.unsplash.com/photo-1621516942691-10c71a32a688?w=800&auto=format&fit=crop", 
    caption: "Me waiting for your reply like..." 
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&auto=format&fit=crop",
    caption: "You: I'm not dramatic. Also You:"
  }
];

export function MemeCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative max-w-sm mx-auto mt-8 group">
      <div className="overflow-hidden rounded-xl shadow-xl border-4 border-white" ref={emblaRef}>
        <div className="flex">
          {MEMES.map((meme) => (
            <div className="flex-[0_0_100%] min-w-0 relative" key={meme.id}>
              {/* Descriptive comment for Unsplash images */}
              {/* Couple funny moment */}
              <img 
                src={meme.url} 
                alt={meme.caption}
                className="w-full h-64 object-cover" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-center">
                <p className="text-white font-medium text-sm md:text-base font-display">{meme.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-primary opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-primary opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        onClick={scrollNext}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
