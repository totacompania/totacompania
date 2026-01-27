'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Theater,
  Calendar,
  Image as ImageIcon,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Handshake,
  GraduationCap,
  Mail,
  Newspaper,
  Sparkles,
  School
} from 'lucide-react';

const sidebarItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/admin/spectacles', icon: Theater, label: 'Spectacles' },
  { href: '/admin/events', icon: Calendar, label: 'Agenda' },
  { href: '/admin/equipe', icon: Users, label: 'Equipe' },
  { href: '/admin/theater-groups', icon: GraduationCap, label: 'Groupes Theatre' },
  { href: '/admin/interventions', icon: School, label: 'Interventions' },
  { href: '/admin/stages', icon: Sparkles, label: 'Stages Enfants' },
  { href: '/admin/partenaires', icon: Handshake, label: 'Partenaires' },
  { href: '/admin/mediatheque', icon: ImageIcon, label: 'Photos & Medias' },
  { href: '/admin/messages', icon: Mail, label: 'Messages' },
  { href: '/admin/newsletter', icon: Newspaper, label: 'Newsletter' },
  { href: '/admin/settings', icon: Settings, label: 'Parametres' }
];

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifier l'authentification
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('tota-admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setIsLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    sessionStorage.removeItem('tota-admin-auth');
    router.push('/admin/login');
  };

  // Page de login - pas de layout admin
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#844cfc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Non authentifie - ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - fond plus violet */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 transform transition-transform z-50 lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, #2d1b4e 0%, #1a1035 50%, #0f0a1f 100%)' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#844cfc]/30 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#844cfc] flex items-center justify-center">
              <Theater className="w-5 h-5 text-white" />
            </div>
            <span className="font-title font-bold text-white">Tota Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                  isActive
                    ? 'bg-[#844cfc] text-white'
                    : 'text-[#dbcbff] hover:bg-[#844cfc]/30 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#844cfc]/30 flex-shrink-0 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-[#dbcbff] hover:bg-[#844cfc]/30 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Retour au site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Deconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 md:h-16 bg-white border-b border-[#844cfc]/10 flex items-center justify-between px-3 md:px-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-[#dbcbff]/30 -ml-1"
          >
            <Menu className="w-6 h-6 text-[#844cfc]" />
          </button>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
              Bienvenue, <strong className="text-[#844cfc]">Admin</strong>
            </span>
            <div className="relative group">
              <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 hover:bg-[#dbcbff]/30">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-[#844cfc] text-white flex items-center justify-center text-sm">
                  A
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-[#844cfc]/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#dbcbff]/30"
                >
                  Parametres
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[#f02822] hover:bg-[#dbcbff]/30"
                >
                  Deconnexion
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
