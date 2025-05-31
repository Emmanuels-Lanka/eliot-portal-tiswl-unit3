"use client"

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface TVLinkCard {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

interface TVLinkCardsProps {
  cards: TVLinkCard[];
}

const TVLinkCards = ({ cards }: TVLinkCardsProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      const next = (idx + 1) % cards.length;
      cardRefs.current[next]?.focus();
      setFocusedIndex(next);
    } else if (e.key === 'ArrowLeft') {
      const prev = (idx - 1 + cards.length) % cards.length;
      cardRefs.current[prev]?.focus();
      setFocusedIndex(prev);
    } else if (e.key === 'Enter' || e.key === ' ') {
      window.open(cards[idx].url, '_blank');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 bg-gray-900">
      {cards.map((card, idx) => (
        <div
          key={card.id}
          ref={el => { cardRefs.current[idx] = el; }}
          tabIndex={0}
          aria-label={`Open ${card.title}`}
          className={`relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 
            ${hoveredCard === card.id || focusedIndex === idx ? 
              'shadow-xl ring-4 ring-blue-500/50 scale-[1.03]' : 
              'shadow-md hover:shadow-lg'}
            hover:cursor-pointer group focus:outline-none focus:ring-4 focus:ring-blue-400/70`}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => window.open(card.url, '_blank')}
          onFocus={() => setFocusedIndex(idx)}
          onBlur={() => setFocusedIndex(-1)}
          onKeyDown={e => handleKeyDown(e, idx)}
        >
          {/* Image with dark overlay */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={card.imageUrl}
              alt={card.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={idx < 4} // Lazy load after first 4
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent 
              transition-all duration-500 ${hoveredCard === card.id || focusedIndex === idx ? 'opacity-90' : 'opacity-70'}`} />
          </div>

          {/* Card content - Dark mode optimized */}
          <div className="p-5 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700">
            <div className="flex justify-between items-start gap-3">
              <h3 className={`text-lg font-semibold mb-2 line-clamp-2 transition-colors
                ${hoveredCard === card.id || focusedIndex === idx ? 'text-blue-400' : 'text-gray-100'}`}>
                {card.title}
              </h3>
              <ArrowUpRight 
                className={`flex-shrink-0 transition-all duration-300 mt-1
                  ${hoveredCard === card.id || focusedIndex === idx ? 
                    'text-blue-400 scale-110' : 
                    'text-gray-400'}`}
                size={20}
              />
            </div>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
              {card.description}
            </p>
            
            <div className="flex items-center mt-auto">
              <span className="text-xs text-blue-300 font-medium truncate">
                {new URL(card.url).hostname.replace('www.', '')}
                <span className="text-gray-400">{new URL(card.url).pathname}</span>
              </span>
            </div>
          </div>

          {/* Glow effect on hover/focus */}
          <div className={`absolute inset-0 rounded-2xl pointer-events-none 
            transition-all duration-300
            ${hoveredCard === card.id || focusedIndex === idx ? 
              'shadow-[0_0_20px_rgba(59,130,246,0.4)]' : ''}`} />
        </div>
      ))}
    </div>
  );
};

export default TVLinkCards;