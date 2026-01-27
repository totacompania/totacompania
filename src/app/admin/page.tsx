'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Theater,
  Calendar,
  Eye,
  FileText,
  Users,
  Plus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  spectacles: number;
  events: number;
  media: number;
  messages: number;
}

const recentEvents = [
  { title: 'Festival Rencarts 2024', date: '15 juin 2024', status: 'A venir' },
  { title: 'Contes du Plexiglas - Médiathèque Nancy', date: '22 mai 2024', status: 'A venir' },
  { title: 'Atelier Théâtre - École Primaire', date: '10 mai 2024', status: 'Passe' }
];

const quickActions = [
  { label: 'Nouveau spectacle', href: '/admin/spectacles/new', icon: Theater },
  { label: 'Nouvel événement', href: '/admin/events/new', icon: Calendar },
  { label: 'Nouvel article', href: '/admin/articles/new', icon: FileText }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsConfig = [
    { label: 'Spectacles', value: stats?.spectacles ?? 0, icon: Theater, color: 'bg-primary', href: '/admin/spectacles' },
    { label: 'Événements', value: stats?.events ?? 0, icon: Calendar, color: 'bg-accent', href: '/admin/events' },
    { label: 'Medias', value: stats?.media ?? 0, icon: FileText, color: 'bg-accent-gold', href: '/admin/mediatheque' },
    { label: 'Messages', value: stats?.messages ?? 0, icon: Users, color: 'bg-green-500', href: '/admin/messages' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Bienvenue sur le panneau d'administration de Tota Compania
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <action.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.href} className="block">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400 mt-2" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-gray-900">
                Prochains événements
              </h2>
              <Link
                href="/admin/events"
                className="text-sm text-primary hover:underline"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEvents.map((event, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      event.status === 'A venir'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-display font-bold text-lg text-gray-900">
              Actions rapides
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              href="/admin/spectacles/new"
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="p-3 bg-primary/10 rounded-lg">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Ajouter un spectacle</h3>
                <p className="text-sm text-gray-500">Créer une nouvelle fiche spectacle</p>
              </div>
            </Link>

            <Link
              href="/admin/events/new"
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-accent hover:bg-accent/5 transition-colors"
            >
              <div className="p-3 bg-accent/10 rounded-lg">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Ajouter une date</h3>
                <p className="text-sm text-gray-500">Planifier un nouvel événement</p>
              </div>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Voir le site</h3>
                <p className="text-sm text-gray-500">Ouvrir le site public dans un nouvel onglet</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
