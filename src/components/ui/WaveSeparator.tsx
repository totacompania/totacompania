'use client';

interface WaveSeparatorProps {
  topColor?: string;
  bottomColor?: string;
  variant?: 'wave1' | 'wave2' | 'wave3';
  flip?: boolean;
  className?: string;
}

export default function WaveSeparator({
  topColor = '#0a0a0f',
  bottomColor = '#dbcbff',
  variant = 'wave1',
  flip = false,
  className = ''
}: WaveSeparatorProps) {
  const waves = {
    wave1: (
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
        className={`w-full h-20 md:h-24 lg:h-32 ${flip ? 'rotate-180' : ''}`}
      >
        <path
          d="M0,60 C180,120 360,0 540,60 C720,120 900,0 1080,60 C1260,120 1350,30 1440,60 L1440,120 L0,120 Z"
          fill={bottomColor}
        />
        <path
          d="M0,80 C180,40 360,100 540,80 C720,60 900,100 1080,80 C1260,60 1380,90 1440,80 L1440,120 L0,120 Z"
          fill={bottomColor}
          fillOpacity="0.5"
        />
      </svg>
    ),
    wave2: (
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        className={`w-full h-16 md:h-20 lg:h-24 ${flip ? 'rotate-180' : ''}`}
      >
        <path
          d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z"
          fill={bottomColor}
        />
      </svg>
    ),
    wave3: (
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
        className={`w-full h-12 md:h-16 lg:h-20 ${flip ? 'rotate-180' : ''}`}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={bottomColor}
        />
        <path
          d="M0,50 C300,20 600,70 900,50 C1200,30 1350,60 1440,50 L1440,80 L0,80 Z"
          fill={bottomColor}
          fillOpacity="0.6"
        />
        <path
          d="M0,60 C200,80 400,40 600,60 C800,80 1000,40 1200,60 C1300,70 1380,50 1440,60 L1440,80 L0,80 Z"
          fill={bottomColor}
          fillOpacity="0.3"
        />
      </svg>
    )
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ background: topColor, marginBottom: '-1px' }}>
      {waves[variant]}
    </div>
  );
}

// Presets pour les transitions courantes
export function WaveVioletDarkToLight({ flip = false }: { flip?: boolean }) {
  return <WaveSeparator topColor="#0a0a0f" bottomColor="#dbcbff" variant="wave3" flip={flip} />;
}

export function WaveVioletLightToWhite({ flip = false }: { flip?: boolean }) {
  return <WaveSeparator topColor="rgba(219,203,255,0.5)" bottomColor="#faf8f5" variant="wave1" flip={flip} />;
}

export function WaveWhiteToVioletLight({ flip = false }: { flip?: boolean }) {
  return <WaveSeparator topColor="#faf8f5" bottomColor="rgba(219,203,255,0.5)" variant="wave2" flip={flip} />;
}

export function WaveVioletLightToDark({ flip = false }: { flip?: boolean }) {
  return <WaveSeparator topColor="rgba(219,203,255,0.5)" bottomColor="#0a0a0f" variant="wave3" flip={flip} />;
}

export function WaveWhiteToDark({ flip = false }: { flip?: boolean }) {
  return <WaveSeparator topColor="#faf8f5" bottomColor="#0a0a0f" variant="wave1" flip={flip} />;
}
