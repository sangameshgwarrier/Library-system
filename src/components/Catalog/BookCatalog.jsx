import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, Download, Grid, List, BookOpen, 
  Cpu, Feather, Compass, Brain, ShieldAlert, Sparkles, TrendingUp,
  CheckCircle2, AlertCircle, MapPin, ArrowUpDown, Layers
} from 'lucide-react';
import { THEMES } from '../../data/initialBooks';
import BookCard from './BookCard';
import BookDetailModal from './BookDetailModal';
import AddBookModal from './AddBookModal';
import { exportCatalogCSV } from '../../utils/exportUtils';

export default function BookCatalog({ books, activeLoans, onIssueBook, onAddBook }) {
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, out
  const [sortBy, setSortBy] = useState('title-asc'); // title-asc, title-desc, rating, year, available
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  // Icon mapping
  const iconMap = {
    Library: Layers,
    Cpu: Cpu,
    BookOpen: BookOpen,
    Feather: Feather,
    Compass: Compass,
    Brain: Brain,
    ShieldAlert: ShieldAlert,
    Sparkles: Sparkles,
    TrendingUp: TrendingUp
  };

  // Compute theme counts
  const themeCounts = useMemo(() => {
    const counts = { all: books.length };
    THEMES.forEach(t => {
      if (t.id !== 'all') {
        counts[t.id] = books.filter(b => b.theme === t.id).length;
      }
    });
    return counts;
  }, [books]);

  // Filter & Sort
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        // Theme filter
        if (selectedTheme !== 'all' && book.theme !== selectedTheme) return false;
        
        // Availability filter
        if (availabilityFilter === 'available' && book.availableCopies <= 0) return false;
        if (availabilityFilter === 'out' && book.availableCopies > 0) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchIsbn = book.isbn.toLowerCase().includes(q);
          const matchShelf = book.shelfLocation.toLowerCase().includes(q);
          const matchDesc = book.description.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchIsbn && !matchShelf && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'author') return a.author.localeCompare(b.author);
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'year') return b.publishedYear - a.publishedYear;
        if (sortBy === 'available') return b.availableCopies - a.availableCopies;
        return 0;
      });
  }, [books, selectedTheme, availabilityFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5" /> Curated Thematic Catalog
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Explore Our Collection Across Themes
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Browse through {books.length} volumes spanning Science, Classic Literature, Philosophy, Thrillers, and more. Filter by theme, check live shelf inventory, and issue instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => exportCatalogCSV(books)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/15 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsAddBookOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* Theme Selection Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span>Filter By Theme</span>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
              {THEMES.length - 1} Themes
            </span>
          </h2>
          <span className="text-xs text-slate-500">
            Showing {filteredBooks.length} of {books.length} titles
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {THEMES.map((theme) => {
            const Icon = iconMap[theme.icon] || BookOpen;
            const isSelected = selectedTheme === theme.id;
            const count = themeCounts[theme.id] || 0;

            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{theme.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Filter, Sort and View Mode Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, ISBN, shelf location, keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Availability */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Copies</option>
            <option value="available">Available in Library</option>
            <option value="out">All Copies Checked Out</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none pr-1"
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="author">Author (A-Z)</option>
              <option value="rating">Highest Rating</option>
              <option value="year">Publication Year</option>
              <option value="available">Most Copies In</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Book List / Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No books found matching your criteria</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search keywords, clearing theme filters, or registering a new volume into the catalog.
          </p>
          <button
            onClick={() => { setSelectedTheme('all'); setSearchQuery(''); setAvailabilityFilter('all'); }}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelectBook={setSelectedBookForDetails}
              onQuickIssue={onIssueBook}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Title & Author</th>
                  <th className="py-3.5 px-4">Theme</th>
                  <th className="py-3.5 px-4">ISBN</th>
                  <th className="py-3.5 px-4">Shelf Location</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((book) => {
                  const themeObj = THEMES.find(t => t.id === book.theme) || { name: book.theme };
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div 
                          onClick={() => setSelectedBookForDetails(book)}
                          className="font-serif font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                        >
                          {book.title}
                        </div>
                        <div className="text-xs text-slate-500">{book.author} ({book.publishedYear})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {themeObj.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{book.isbn}</td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="font-mono">{book.shelfLocation}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {book.availableCopies} / {book.totalCopies}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                            <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedBookForDetails(book)}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onIssueBook(book)}
                          disabled={!isAvailable}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            isAvailable
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Issue
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBookForDetails && (
        <BookDetailModal
          book={selectedBookForDetails}
          activeLoans={activeLoans}
          onClose={() => setSelectedBookForDetails(null)}
          onIssueBook={onIssueBook}
        />
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAddBook={onAddBook}
      />
    </div>
  );
}

