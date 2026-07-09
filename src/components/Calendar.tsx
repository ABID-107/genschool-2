"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarEvent, EventType } from '../lib/types';
import { ChevronLeft, ChevronRight, X, Clock, BookOpen, User } from 'lucide-react';

interface CalendarProps {
  events: CalendarEvent[];
}

export default function Calendar({ events }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'class': return 'bg-[var(--green-100)] text-[var(--green-800)]';
      case 'homework': return 'bg-[var(--amber-100)] text-[var(--amber-800)]';
      case 'exam': return 'bg-[var(--color-error)]/10 text-[var(--color-error)]';
      case 'event': return 'bg-[var(--green-50)] text-[var(--brand-primary)]';
      default: return 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]';
    }
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
            <button onClick={prevMonth} className="btn-ghost btn-icon rounded-lg" aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="btn-ghost px-3 py-1 text-xs font-bold">
              Today
            </button>
            <button onClick={nextMonth} className="btn-ghost btn-icon rounded-lg" aria-label="Next month">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
          {(['month', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === v ? 'bg-[var(--bg-secondary)] text-[var(--brand-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto custom-scrollbar">
        {prevMonthDays.map(i => (
          <div key={`prev-${i}`} className="border-r border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/20 p-2 min-h-[100px]" />
        ))}
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          const isToday = day === new Date().getDate() &&
                         currentDate.getMonth() === new Date().getMonth() &&
                         currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div key={day} className="border-r border-b border-[var(--border-color)] p-2 min-h-[100px] hover:bg-[var(--bg-tertiary)]/30 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all ${isToday ? 'bg-[var(--brand-primary)] text-white shadow-md' : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]'}`}>
                  {day}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`text-[10px] px-1.5 py-0.5 rounded-md truncate cursor-pointer hover:shadow-sm hover:scale-[1.02] active:scale-95 transition-all font-semibold ${getEventBadge(event.type)}`}
                  >
                    {event.title}
                  </motion.div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] font-semibold text-[var(--text-muted)] px-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-xl max-w-md w-full"
            >
              <div className="flex items-start justify-between p-6 pb-4 border-b border-[var(--border-color)]">
                <div>
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-bold mb-2 ${getEventBadge(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <h4 className="text-xl font-bold text-[var(--text-primary)]">
                    {selectedEvent.title}
                  </h4>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="btn-icon btn-ghost rounded-lg" aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-color)]">
                    <Clock size={20} className="text-[var(--brand-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Time</p>
                    <p className="text-sm font-semibold">
                      {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                      {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {selectedEvent.subject && (
                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-color)]">
                      <BookOpen size={20} className="text-[var(--brand-mid)]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Subject</p>
                      <p className="text-sm font-semibold">{selectedEvent.subject}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.teacher && (
                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-color)]">
                      <User size={20} className="text-[var(--brand-accent)]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Teacher</p>
                      <p className="text-sm font-semibold">{selectedEvent.teacher}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[var(--border-color)]">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {selectedEvent.description || 'No additional details available for this event.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-6 pt-4 border-t border-[var(--border-color)]">
                <button onClick={() => setSelectedEvent(null)} className="btn-ghost px-4 py-2 rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all flex-1">
                  Close
                </button>
                <button className="btn px-4 py-2 rounded-xl text-sm font-bold bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-deep)] transition-all flex-1">
                  View Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}