'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Calendar, MapPin, Clock, Ticket, ArrowRight, X, ExternalLink } from 'lucide-react';

interface Event {
  id: number;
  _id?: string;
  title: string;
  description: string;
  location: string;
  address: string;
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  ticketUrl: string;
  externalUrl?: string;
  price: string;
  spectacleId: number;
  spectacleTitle: string;
  spectacleSlug: string;
  spectacleImage: string;
}

export default function AgendaPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredEvents = events.filter(event => {
    if (filter === 'upcoming') return event.date >= today;
    if (filter === 'past') return event.date < today;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
      full: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      short: date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      })
    };
  };

  const hasEndDate = (event: Event) => {
    return event.endDate && event.endDate !== event.date;
  };

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-theater-brown to-theater-brown/90">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-6">
              <Calendar className="w-8 h-8" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Agenda
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Retrouvez toutes nos dates de spectacles et evenements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex justify-center gap-4">
            {[
              { key: 'upcoming', label: 'A venir' },
              { key: 'past', label: 'Passes' },
              { key: 'all', label: 'Tous' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as 'upcoming' | 'past' | 'all')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  filter === item.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">
                {filter === 'upcoming'
                  ? 'Aucun evenement a venir pour le moment.'
                  : filter === 'past'
                  ? 'Aucun evenement passe.'
                  : 'Aucun evenement.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event, index) => {
                const dateInfo = formatDate(event.date);
                const endDateInfo = hasEndDate(event) ? formatDate(event.endDate) : null;
                const isPast = event.date < today;

                return (
                  <motion.div
                    key={event.id || event._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${isPast ? 'opacity-60' : ''}`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Date Badge - Affiche plage de dates si date de fin */}
                        <div className="bg-primary text-white p-6 text-center md:w-32 flex-shrink-0">
                          {endDateInfo ? (
                            <>
                              <div className="text-xs opacity-75 mb-1">Du</div>
                              <div className="text-2xl font-bold">{dateInfo.day}</div>
                              <div className="text-xs">{dateInfo.month}</div>
                              <div className="text-xs opacity-75 my-1">au</div>
                              <div className="text-2xl font-bold">{endDateInfo.day}</div>
                              <div className="text-xs">{endDateInfo.month}</div>
                              {dateInfo.year !== endDateInfo.year && (
                                <div className="text-xs opacity-75">{endDateInfo.year}</div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="text-3xl font-bold">{dateInfo.day}</div>
                              <div className="text-sm">{dateInfo.month}</div>
                              <div className="text-xs opacity-75">{dateInfo.year}</div>
                            </>
                          )}
                        </div>

                        {/* Image */}
                        {event.spectacleImage && (
                          <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                            <Image
                              src={event.spectacleImage}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <h2 className="font-display text-xl font-bold text-theater-brown">
                                {event.title}
                              </h2>
                              {event.spectacleSlug && (
                                <Link
                                  href={`/spectacles/${event.spectacleSlug}`}
                                  className="text-primary hover:underline text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {event.spectacleTitle}
                                </Link>
                              )}
                              {event.description && (
                                <p className="text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                              )}
                            </div>

                            {/* Boutons Billetterie et Lien externe */}
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              {event.externalUrl && (
                                <a
                                  href={event.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Plus d'infos
                                </a>
                              )}
                              {event.ticketUrl && !isPast && (
                                <a
                                  href={event.ticketUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                  <Ticket className="w-4 h-4" />
                                  Reserver
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Infos: Horaires, Lieu, Prix */}
                          <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500">
                            {/* Date complete avec date de fin */}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {endDateInfo
                                  ? `Du ${dateInfo.short} au ${endDateInfo.short}`
                                  : dateInfo.full.charAt(0).toUpperCase() + dateInfo.full.slice(1)
                                }
                              </span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {event.time}
                                {event.endTime && ` - ${event.endTime}`}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {event.location}
                                {event.address && `, ${event.address}`}
                              </span>
                            </div>
                            {event.price && (
                              <div className="font-medium text-primary">
                                {event.price}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              {selectedEvent.spectacleImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={selectedEvent.spectacleImage}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {!selectedEvent.spectacleImage && (
                <div className="flex justify-end p-4 border-b">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="p-6">
                {/* Title */}
                <h2 className="font-display text-2xl font-bold text-theater-brown mb-2">
                  {selectedEvent.title}
                </h2>

                {selectedEvent.spectacleSlug && (
                  <Link
                    href={`/spectacles/${selectedEvent.spectacleSlug}`}
                    className="text-primary hover:underline"
                  >
                    Voir le spectacle : {selectedEvent.spectacleTitle}
                  </Link>
                )}

                {/* Date & Time */}
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-3 text-lg font-semibold text-theater-brown">
                    <Calendar className="w-5 h-5 text-primary" />
                    {hasEndDate(selectedEvent) ? (
                      <span>
                        Du {formatDate(selectedEvent.date).full}
                        <br />
                        <span className="text-base">au {formatDate(selectedEvent.endDate).full}</span>
                      </span>
                    ) : (
                      formatDate(selectedEvent.date).full
                    )}
                  </div>
                  {selectedEvent.time && (
                    <div className="flex items-center gap-3 mt-2 text-gray-600">
                      <Clock className="w-5 h-5 text-primary" />
                      {selectedEvent.time}
                      {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-theater-brown">{selectedEvent.location}</p>
                      {selectedEvent.address && (
                        <p className="text-gray-600">{selectedEvent.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-theater-brown mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Price */}
                {selectedEvent.price && (
                  <div className="mt-4">
                    <span className="inline-block px-4 py-2 bg-secondary/30 rounded-lg font-semibold text-theater-brown">
                      {selectedEvent.price}
                    </span>
                  </div>
                )}

                {/* Actions - Liens Billetterie et Externe */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {selectedEvent.externalUrl && (
                    <a
                      href={selectedEvent.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      En savoir plus
                    </a>
                  )}
                  {selectedEvent.ticketUrl && selectedEvent.date >= today && (
                    <a
                      href={selectedEvent.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <Ticket className="w-5 h-5" />
                      Reserver des places
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-theater-brown mb-4">
              Vous souhaitez organiser un evenement ?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Contactez-nous pour programmer un spectacle dans votre structure.
            </p>
            <Link href="/contact" className="btn-primary">
              Nous contacter
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
