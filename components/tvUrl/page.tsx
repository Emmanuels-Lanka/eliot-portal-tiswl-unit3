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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {cards.map((card, idx) => (
        <div
          key={card.id}
          ref={el => { cardRefs.current[idx] = el; }}
          tabIndex={0}
          aria-label={card.title}
          className={`relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 
            ${hoveredCard === card.id || focusedIndex === idx ? 'shadow-2xl border-blue-400 border-2 scale-[1.025]' : 'shadow-md'}
            hover:cursor-pointer group focus:outline-none focus:ring-4 focus:ring-blue-300`}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => window.open(card.url, '_blank')}
          onFocus={() => setFocusedIndex(idx)}
          onBlur={() => setFocusedIndex(-1)}
          onKeyDown={e => handleKeyDown(e, idx)}
        >
          {/* Image with overlay on hover */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={card.imageUrl}
              alt={card.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-all duration-300 
              ${hoveredCard === card.id || focusedIndex === idx ? 'bg-opacity-40' : 'bg-opacity-20'}`} />
          </div>

          {/* Card content */}
          <div className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <h3 className={`text-xl font-bold mb-2 line-clamp-2 transition-colors duration-300
                ${hoveredCard === card.id || focusedIndex === idx ? 'text-blue-700' : 'text-gray-800'}`}>
                {card.title}
              </h3>
              <ArrowUpRight 
                className={`text-gray-400 transition-all duration-300 
                  ${hoveredCard === card.id || focusedIndex === idx ? 'text-blue-500 scale-125' : ''}`}
                size={22}
              />
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {card.description}
            </p>
            <div className="flex items-center">
              <span className="text-xs text-blue-600 font-mono break-all">
                {new URL(card.url).hostname.replace('www.', '') + new URL(card.url).pathname}
              </span>
            </div>
          </div>

          {/* Hover/focus border effect */}
          <div className={`absolute inset-0 border-2 border-transparent rounded-2xl transition-all duration-300 pointer-events-none
            ${hoveredCard === card.id || focusedIndex === idx ? 'border-blue-400' : ''}`} />
        </div>
      ))}
    </div>
  );
};

export default TVLinkCards;