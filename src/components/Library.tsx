"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getBooks, BOOK_CATEGORIES, type Book } from '@/lib/libraryStore';
import { X, Search, Download, BookOpen } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] font-heading tracking-tight">Digital Library</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">Access your educational resources anywhere, anytime.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search books, authors, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select sm:w-44"
          >
            <option value="All">All Categories</option>
            {BOOK_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            onClick={() => setShowDigitalOnly(!showDigitalOnly)}
            className={`btn btn-sm ${showDigitalOnly ? 'btn-primary' : 'btn-secondary'}`}
          >
            Digital Only
          </button>
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={book.id}
              className="card overflow-hidden group"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-[var(--bg-tertiary)]">
                {book.thumbnail ? (
                  <Image
                    src={book.thumbnail}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                    <BookOpen size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="w-full py-2.5 bg-white text-[var(--brand-primary)] rounded-xl text-xs font-bold shadow-lg hover:bg-[var(--bg-tertiary)] transition-all active:scale-95"
                  >
                    View Details
                  </button>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge badge-green">{book.category}</span>
                  {book.availableCopies > 0 ? (
                    <span className="badge badge-green">{book.availableCopies} left</span>
                  ) : (
                    <span className="badge badge-rose">Unavailable</span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h4 className="font-bold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--brand-primary)] transition-colors">{book.title}</h4>
                <p className="text-xs text-[var(--text-muted)] font-medium mt-1 mb-2">by {book.author}</p>
                {book.publisher && (
                  <p className="text-[10px] text-[var(--text-muted)] mb-4">{book.publisher} &middot; {book.edition || book.publicationYear}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-light)]">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <span className="text-[10px] font-medium">Added {new Date(book.createdAt).getFullYear()}</span>
                  </div>
                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-all"
                      aria-label="Download"
                    >
                      <Download size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="empty-state card p-12">
          <div className="empty-state-icon">
            <BookOpen size={24} />
          </div>
          <div className="empty-state-title">No books found</div>
          <div className="empty-state-desc">We couldn't find any books matching your search or category filter.</div>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setShowDigitalOnly(false); }}
            className="mt-6 text-sm font-bold text-[var(--brand-primary)] hover:text-[var(--brand-mid)] transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedBook && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="modal-content max-w-5xl max-h-[85vh] flex flex-col md:flex-row"
            >
              <div className="w-full md:w-1/3 bg-[var(--bg-tertiary)] p-8 flex flex-col items-center text-center overflow-y-auto">
                {selectedBook.thumbnail ? (
                  <Image
                    src={selectedBook.thumbnail}
                    alt={selectedBook.title}
                    width={192}
                    height={256}
                    className="object-cover rounded-2xl shadow-xl mb-8"
                  />
                ) : (
                  <div className="w-48 h-64 rounded-2xl shadow-xl mb-8 flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-muted)]">
                    <BookOpen size={64} />
                  </div>
                )}
                <h4 className="text-2xl font-bold text-[var(--text-primary)] font-heading leading-tight mb-2">
                  {selectedBook.title}
                </h4>
                <p className="text-[var(--text-muted)] font-medium mb-2">by {selectedBook.author}</p>
                {selectedBook.publisher && (
                  <p className="text-xs text-[var(--text-muted)] mb-4">{selectedBook.publisher} &middot; {selectedBook.edition || selectedBook.publicationYear}</p>
                )}

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="badge badge-green">{selectedBook.category}</span>
                  {selectedBook.availableCopies > 0 ? (
                    <span className="badge badge-green">{selectedBook.availableCopies} of {selectedBook.totalCopies} available</span>
                  ) : (
                    <span className="badge badge-rose">Currently unavailable</span>
                  )}
                  {selectedBook.pdfUrl && (
                    <span className="badge badge-blue">Digital Copy</span>
                  )}
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-auto">
                  {selectedBook.description}
                </p>

                <div className="w-full space-y-3 pt-8">
                  {selectedBook.pdfUrl && (
                    <a
                      href={selectedBook.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full"
                    >
                      <Download size={16} />
                      Open PDF
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="btn btn-secondary w-full"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-[var(--bg-tertiary)] relative group">
                {selectedBook.pdfUrl ? (
                  <iframe
                    src={selectedBook.pdfUrl}
                    className="w-full h-full"
                    title={selectedBook.title}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] p-8">
                    <BookOpen size={80} className="mb-4" />
                    <p className="text-lg font-semibold text-[var(--text-secondary)]">No Digital Copy Available</p>
                    <p className="text-sm mt-2">This book is only available in physical format.</p>
                    <p className="text-xs mt-4 text-[var(--text-muted)]">Shelf: {selectedBook.shelfLocation || 'Unassigned'}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-secondary)] shadow-lg text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all z-10 border border-[var(--border-color)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
