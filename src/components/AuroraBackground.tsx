'use client';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient de base */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/70" />

      {/* Cercles animes (effet aurora) */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-gradient-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[20%] right-[5%] w-[35vw] h-[35vw] bg-gradient-to-br from-yellow-200/25 to-amber-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] right-[30%] w-[25vw] h-[25vw] bg-gradient-to-br from-orange-100/20 to-red-100/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
    </div>
  );
}
