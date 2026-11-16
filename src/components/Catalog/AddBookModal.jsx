import React, { useState } from 'react';
import { X, Plus, BookOpen, Layers } from 'lucide-react';
import { THEMES } from '../../data/initialBooks';

export default function AddBookModal({ isOpen, onClose, onAddBook }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    theme: 'science-tech',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    shelfLocation: 'Stack-A1 / Shelf-1',
    totalCopies: 3,
    description: '',
    rating: 4.8
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) return;

    // Pick gradient based on theme
    const gradients = {
      'science-tech': 'from-blue-600 to-indigo-900',
      'classics': 'from-amber-600 to-yellow-900',
      'fiction': 'from-emerald-600 to-teal-900',
      'history-bio': 'from-rose-600 to-red-950',
      'philosophy-psych': 'from-indigo-600 to-violet-950',
      'mystery-thriller': 'from-purple-700 to-slate-900',
      'fantasy-scifi': 'from-teal-600 to-amber-900',
      'business-econ': 'from-orange-600 to-amber-900'
    };

    const newBook = {
      id: `b-${Date.now()}`,
      title: formData.title.trim(),
      author: formData.author.trim(),
      theme: formData.theme,
      isbn: formData.isbn.trim() || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      publishedYear: Number(formData.publishedYear) || new Date().getFullYear(),
      shelfLocation: formData.shelfLocation.trim(),
      totalCopies: Number(formData.totalCopies) || 1,
      availableCopies: Number(formData.totalCopies) || 1,
      rating: Number(formData.rating) || 4.5,
      description: formData.description.trim() || 'No description provided.',
      coverGradient: gradients[formData.theme] || 'from-indigo-600 to-slate-800'
    };

    onAddBook(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add Book to Catalog</h2>
              <p className="text-xs text-slate-500">Categorize and register a new volume</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Book Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. The Lord of the Rings"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Author Name *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. J.R.R. Tolkien"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Theme / Genre *</label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                {THEMES.filter(t => t.id !== 'all').map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-0123456789"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Published Year</label>
              <input
                type="number"
                value={formData.publishedYear}
                onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Copies</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Shelf Location</label>
            <input
              type="text"
              value={formData.shelfLocation}
              onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
              placeholder="e.g. Stack-C1 / Shelf-4"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Synopsis / Summary</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of the book content..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

