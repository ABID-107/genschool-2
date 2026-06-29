"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarEvent, EventType } from '../lib/types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'class': return 'badge-navy';
      case 'homework': return 'badge-amber';
      case 'exam': return 'badge-rose';
      case 'event': return 'badge-green';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="card overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)] font-heading">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
            <button onClick={prevMonth} className="p-1.5 hover:bg-[var(--bg-secondary)] hover:shadow-sm rounded-lg transition-all text-[var(--text-muted)]" aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
              Today
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-[var(--bg-secondary)] hover:shadow-sm rounded-lg transition-all text-[var(--text-muted)]" aria-label="Next month">
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
                    className={`badge text-[10px] truncate cursor-pointer hover:shadow-sm hover:scale-[1.02] active:scale-95 transition-all ${getEventColor(event.type)}`}
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
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-content max-w-md"
            >
              <div className="modal-header">
                <div>
                  <span className={`badge mb-2 ${getEventColor(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <h4 className="text-xl font-bold text-[var(--text-primary)] font-heading">
                    {selectedEvent.title}
                  </h4>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="btn btn-ghost btn-icon" aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body space-y-4">
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-color)]">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
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
                      <span className="material-symbols-outlined text-[20px]">book</span>
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
                      <span className="material-symbols-outlined text-[20px]">person</span>
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

              <div className="modal-footer">
                <button onClick={() => setSelectedEvent(null)} className="btn btn-secondary flex-1">
                  Close
                </button>
                <button className="btn btn-primary flex-1">
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
