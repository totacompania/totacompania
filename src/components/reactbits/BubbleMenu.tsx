'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BubbleMenuProps {
  items: MenuItem[];
  triggerIcon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export default function BubbleMenu({
  items,
  triggerIcon,
  position = 'bottom-right',
  className = ''
}: BubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const getItemPosition = (index: number, total: number) => {
    const angle = position.includes('bottom') ? -180 : 0;
    const spread = 180;
    const startAngle = angle - spread / 2;
    const itemAngle = startAngle + (spread / (total - 1)) * index;
    const radius = 80;
    const x = Math.cos((itemAngle * Math.PI) / 180) * radius;
    const y = Math.sin((itemAngle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 ${positionClasses[position]} ${className}`}
    >
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0">
            {items.map((item, index) => {
              const pos = getItemPosition(index, items.length);

              const handleItemClick = () => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: pos.x,
                    y: pos.y,
                  }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                    delay: index * 0.05,
                  }}
                  className="absolute bottom-0 right-0"
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2"
                      onClick={handleItemClick}
                    >
                      <span className="hidden group-hover:block whitespace-nowrap bg-theater-brown text-white text-sm px-2 py-1 rounded shadow-lg">
                        {item.label}
                      </span>
                      <div className="w-12 h-12 rounded-full bg-kraft-400 text-theater-brown flex items-center justify-center shadow-lg hover:bg-kraft-500 hover:scale-110 transition-all">
                        {item.icon}
                      </div>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="group flex items-center gap-2"
                      onClick={handleItemClick}
                    >
                      <span className="hidden group-hover:block whitespace-nowrap bg-theater-brown text-white text-sm px-2 py-1 rounded shadow-lg">
                        {item.label}
                      </span>
                      <div className="w-12 h-12 rounded-full bg-kraft-400 text-theater-brown flex items-center justify-center shadow-lg hover:bg-kraft-500 hover:scale-110 transition-all">
                        {item.icon}
                      </div>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-theater-brown text-white flex items-center justify-center shadow-xl hover:bg-theater-brown/90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {triggerIcon || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
