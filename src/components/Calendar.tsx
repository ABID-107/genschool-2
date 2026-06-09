
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarEvent, EventType } from '../lib/types';

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
      case 'class': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'homework': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'exam': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'event': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Calendar Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-slate-900 font-bricolage">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
            <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Today
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
          {(['month', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto custom-scrollbar">
        {prevMonthDays.map(i => (
          <div key={`prev-${i}`} className="border-r border-b border-slate-100 bg-slate-50/30 p-2 min-h-[100px]"></div>
        ))}
        {days.map(day => {
          const dayEvents = getEventsForDay(day);
          const isToday = day === new Date().getDate() && 
                         currentDate.getMonth() === new Date().getMonth() && 
                         currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div key={day} className="border-r border-b border-slate-100 p-2 min-h-[100px] hover:bg-slate-50/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 group-hover:text-indigo-600'}`}>
                  {day}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border truncate cursor-pointer hover:shadow-sm hover:scale-[1.02] active:scale-95 transition-all ${getEventColor(event.type)}`}
                  >
                    {event.title}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setSelectedEvent(null)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 ${getEventColor(selectedEvent.type).split(' ')[0]}`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider mb-3 ${getEventColor(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <h4 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">
                    {selectedEvent.title}
                  </h4>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-slate-50 text-slate-400 rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</p>
                    <p className="text-sm font-semibold">
                      {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {selectedEvent.subject && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <span className="material-symbols-outlined text-[20px]">book</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</p>
                      <p className="text-sm font-semibold">{selectedEvent.subject}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.teacher && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Teacher</p>
                      <p className="text-sm font-semibold">{selectedEvent.teacher}</p>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {selectedEvent.description || 'No additional details available for this event.'}
                  </p>
                </div>

                <div className="flex gap-3 pt-6">
                  <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                    View Details
                  </button>
                  <button onClick={() => setSelectedEvent(null)} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

