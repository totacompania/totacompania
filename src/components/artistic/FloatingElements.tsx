'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const Pencil = ({ color = '#c41e3a', className = '' }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 100 20" className={className} width="80" height="16">
    <polygon points="0,10 15,0 15,20" fill="#f4d6a0" />
    <rect x="15" y="0" width="70" height="20" fill={color} />
    <rect x="15" y="0" width="70" height="5" fill={color} opacity="0.7" />
    <rect x="85" y="2" width="15" height="16" fill="#1a1a1a" rx="2" />
    <circle cx="7" cy="10" r="2" fill="#2a1f14" />
  </svg>
);

const Paperclip = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 60" className={className} width="20" height="50">
    <path
      d="M12 5 C6 5 2 10 2 16 L2 44 C2 52 7 57 12 57 C17 57 22 52 22 44 L22 20 C22 14 18 10 12 10 C8 10 6 14 6 18 L6 40"
      fill="none"
      stroke="#888"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const Clothespin = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 20 50" className={className} width="16" height="40">
    <rect x="2" y="0" width="16" height="30" rx="3" fill="#d4a574" />
    <rect x="4" y="30" width="5" height="18" fill="#d4a574" />
    <rect x="11" y="30" width="5" height="18" fill="#d4a574" />
    <ellipse cx="10" cy="15" rx="4" ry="6" fill="#a08060" />
  </svg>
);

const Pushpin = ({ color = '#c41e3a', className = '' }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 30 40" className={className} width="24" height="32">
    <circle cx="15" cy="12" r="10" fill={color} />
    <circle cx="15" cy="12" r="6" fill={color} opacity="0.7" />
    <rect x="14" y="20" width="2" height="18" fill="#888" />
    <circle cx="15" cy="10" r="2" fill="white" opacity="0.4" />
  </svg>
);

const Star = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} width="24" height="24">
    <path
      d="M12 2L15 9L22 9L16 14L18 22L12 17L6 22L8 14L2 9L9 9Z"
      fill="#f4c430"
      stroke="#dd9933"
      strokeWidth="1"
    />
  </svg>
);

interface FloatingElementsProps {
  variant?: 'header' | 'section' | 'minimal';
}

export default function FloatingElements({ variant = 'header' }: FloatingElementsProps) {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const y3 = useTransform(scrollY, [0, 500], [0, 75]);
  const rotate1 = useTransform(scrollY, [0, 500], [0, 15]);
  const rotate2 = useTransform(scrollY, [0, 500], [0, -10]);

  if (variant === 'minimal') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="floating-element top-[10%] left-[5%]"
          style={{ y: y1, rotate: rotate1 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Star />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="floating-element top-[15%] left-[3%] hidden md:block"
        style={{ y: y1, rotate: rotate1 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="rotate-[25deg]">
          <Pencil color="#c41e3a" className="w-20 h-4" />
        </div>
      </motion.div>

      <motion.div
        className="floating-element top-[25%] right-[5%] hidden md:block"
        style={{ y: y2, rotate: rotate2 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="rotate-[-15deg]">
          <Pencil color="#1e3a5f" className="w-16 h-3" />
        </div>
      </motion.div>

      <motion.div
        className="floating-element bottom-[30%] left-[8%] hidden lg:block"
        style={{ y: y3 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="rotate-[45deg]">
          <Pencil color="#2d5a27" className="w-14 h-3" />
        </div>
      </motion.div>

      <motion.div
        className="floating-element top-[40%] left-[2%] hidden md:block"
        style={{ y: y2 }}
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Paperclip className="w-5 h-12" />
      </motion.div>

      <motion.div
        className="floating-element top-[5%] left-[20%] hidden lg:block"
        style={{ rotate: rotate1 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Clothespin className="rotate-12" />
      </motion.div>

      <motion.div
        className="floating-element bottom-[25%] right-[3%] hidden md:block"
        style={{ rotate: rotate2 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      >
        <Clothespin className="-rotate-6" />
      </motion.div>

      <motion.div
        className="floating-element top-[20%] right-[25%] hidden lg:block"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Pushpin color="#c41e3a" />
      </motion.div>

      <motion.div
        className="floating-element top-[8%] left-[40%]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Star className="w-6 h-6" />
      </motion.div>
    </div>
  );
}
