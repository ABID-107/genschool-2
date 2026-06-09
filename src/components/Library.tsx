"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getBooks, BOOK_CATEGORIES, type Book } from '@/lib/libraryStore';

interface LibraryProps {
  books?: Book[];
}

export default function Library({ books: propBooks }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDigitalOnly, setShowDigitalOnly] = useState(false);

  const books = (propBooks || getBooks()).filter(b => !b.isArchived);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesDigital = !showDigitalOnly || book.pdfUrl.length > 0;
    return matchesSearch && matchesCategory && matchesDigital;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">Digital Library</h3>
          <p className="text-sm text-slate-500 mt-1">Access your educational resources anywhere, anytime.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search books, authors, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>


          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm cursor-pointer"
          >
            <option value="All">All Categories</option>
            {BOOK_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            onClick={() => setShowDigitalOnly(!showDigitalOnly)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shadow-sm ${showDigitalOnly ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            Digital Only
          </button>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={book.id}
              className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                {book.thumbnail ? (
                  <Image
                    src={book.thumbnail}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <span className="material-symbols-outlined text-[64px]">auto_stories</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-95"
                  >
                    {book.pdfUrl ? 'View Details' : 'View Details'}
                  </button>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-white/20 text-indigo-600 text-[10px] font-bold rounded-full shadow-sm">
                    {book.category}
                  </span>
                  {book.availableCopies > 0 ? (
                    <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-sm">
                      {book.availableCopies} left
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-full shadow-sm">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h4 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{book.title}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 mb-2">by {book.author}</p>
                {book.publisher && (
                  <p className="text-[10px] text-slate-400 mb-4">{book.publisher} &middot; {book.edition || book.publicationYear}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span className="text-[10px] font-bold">Added {new Date(book.createdAt).getFullYear()}</span>
                  </div>
                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-20 text-center flex flex-col items-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[40px]">library_books</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 font-bricolage">No books found</h4>
          <p className="text-slate-500 text-sm mt-2 max-w-xs">We couldn't find any books matching your search or category filter.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setShowDigitalOnly(false); }}
            className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Book Preview Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedBook(null)}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <div className="w-full md:w-1/3 bg-slate-50 p-8 flex flex-col items-center text-center overflow-y-auto">
                {selectedBook.thumbnail ? (
                  <Image
                    src={selectedBook.thumbnail}
                    alt={selectedBook.title}
                    width={192}
                    height={256}
                    className="object-cover rounded-2xl shadow-xl mb-8"
                  />
                ) : (
                  <div className="w-48 h-64 bg-slate-200 rounded-2xl shadow-xl mb-8 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[64px]">auto_stories</span>
                  </div>
                )}
                <h4 className="text-2xl font-bold text-slate-900 font-bricolage leading-tight mb-2">
                  {selectedBook.title}
                </h4>
                <p className="text-slate-500 font-medium mb-2">by {selectedBook.author}</p>
                {selectedBook.publisher && (
                  <p className="text-xs text-slate-400 mb-4">{selectedBook.publisher} &middot; {selectedBook.edition || selectedBook.publicationYear}</p>
                )}

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100">
                    {selectedBook.category}
                  </span>
                  {selectedBook.availableCopies > 0 ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">
                      {selectedBook.availableCopies} of {selectedBook.totalCopies} available
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full border border-rose-100">
                      Currently unavailable
                    </span>
                  )}
                  {selectedBook.pdfUrl && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
                      Digital Copy
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-auto">
                  {selectedBook.description}
                </p>

                <div className="w-full space-y-3 pt-8">
                  {selectedBook.pdfUrl && (
                    <a
                      href={selectedBook.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      Open PDF
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="w-full py-3.5 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-white transition-all active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-slate-200 relative group">
                {selectedBook.pdfUrl ? (
                  <iframe
                    src={selectedBook.pdfUrl}
                    className="w-full h-full"
                    title={selectedBook.title}
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8">
                    <span className="material-symbols-outlined text-[80px] mb-4">menu_book</span>
                    <p className="text-lg font-semibold text-slate-500">No Digital Copy Available</p>
                    <p className="text-sm mt-2">This book is only available in physical format. Visit the library to borrow it.</p>
                    <p className="text-xs mt-4 text-slate-400">Shelf: {selectedBook.shelfLocation || 'Unassigned'}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md hover:bg-white text-slate-900 rounded-full shadow-lg transition-all z-10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

