import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Check,
  Clock,
  Heart,
  House,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  Pencil,
  Plus,
  Phone,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Star,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { CATEGORIES, MENU_ITEMS, RESTAURANT } from './data/menuData'
import type { Category, MenuItem } from './data/menuData'

/* ────────────────────────────────────────────────────────── */

type View = 'home' | 'favorites' | 'feedback' | 'owner'

const FAVORITES_STORAGE_KEY = 'taem-kitchen-favorites'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!']

const NAV_ITEMS: { id: View; label: string; Icon: typeof House }[] = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'favorites', label: 'Favorites', Icon: Heart },
  { id: 'feedback', label: 'Feedback', Icon: MessageCircle },
]

/* ────────────────────────────────────────────────────────── */

interface DishCardProps {
  item: MenuItem
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

function DishCard({ item, isFavorite, onToggleFavorite }: DishCardProps) {
  const [hasImageError, setHasImageError] = useState(false)

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10">
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 sm:h-48">
        {hasImageError ? (
          <div className="flex h-full w-full items-center justify-center">
            <UtensilsCrossed className="h-10 w-10 text-amber-500/60" strokeWidth={1.5} />
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setHasImageError(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}

        {item.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700 shadow-sm backdrop-blur-sm">
            {item.tag}
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite ? `Remove ${item.name} from favorites` : `Save ${item.name} to favorites`
          }
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition duration-200 hover:scale-110 active:scale-90"
        >
          <Star
            className={`h-[18px] w-[18px] ${
              isFavorite ? 'fill-amber-400 text-amber-500' : 'fill-transparent text-stone-400'
            }`}
          />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-snug text-stone-900">{item.name}</h3>
          <span className="shrink-0 rounded-xl bg-amber-50 px-2.5 py-1 text-sm font-extrabold text-amber-700">
            {item.price.toLocaleString('en-US')}{' '}
            <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
              ETB
            </span>
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.description}</p>
      </div>
    </article>
  )
}

/* ────────────────────────────────────────────────────────── */

export default function App() {
  const [view, setView] = useState<View>('home')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
      const parsed: unknown = stored ? JSON.parse(stored) : []
      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === 'string')
        : []
    } catch {
      return []
    }
  })

  // Feedback state
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [customerName, setCustomerName] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Owner Dashboard state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminAuthError, setAdminAuthError] = useState('')
  const [dishes, setDishes] = useState<MenuItem[]>(MENU_ITEMS)
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null)

  /* Listen to URL hash for hidden owner route (#owner) */
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('owner')) {
        setView('owner')
      }
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  /* Persist favorites between visits */
  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      /* storage unavailable */
    }
  }, [favorites])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return dishes.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      const matchesSearch =
        query === '' ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory, dishes])

  const favoriteItems = useMemo(
    () => dishes.filter((item) => favorites.includes(item.id)),
    [favorites, dishes],
  )

  const displayedRating = hoveredRating || rating

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    )
  }

  const navigateTo = (nextView: View) => {
    if (nextView === 'owner') {
      window.location.hash = 'owner'
    } else {
      if (window.location.hash) {
        window.history.pushState('', document.title, window.location.pathname + window.location.search)
      }
    }
    setView(nextView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetFilters = () => {
    setSearch('')
    setActiveCategory('All')
  }

  const handleFeedbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (rating === 0) return

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          customerName: customerName.trim() || undefined,
          comment: comment.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to submit feedback')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('[feedback] submission error:', error)
      alert(error instanceof Error ? error.message : 'Could not submit feedback to the server.')
    }
  }

  const resetFeedback = () => {
    setIsSubmitted(false)
    setRating(0)
    setHoveredRating(0)
    setCustomerName('')
    setComment('')
  }

  /* Owner Authentication */
  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault()
    setAdminAuthError('')

    try {
      const response = await fetch('http://localhost:5000/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      })

      if (!response.ok) {
        throw new Error('Incorrect password.')
      }

      setIsAdminAuthenticated(true)
      setAdminPassword('')
    } catch {
      setAdminAuthError('Invalid password. Please try again.')
    }
  }

  /* Owner CRUD Actions */
  const handleDeleteDish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return

    try {
      const res = await fetch(`http://localhost:5000/api/menu/items/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete item')

      setDishes((prev) => prev.filter((item) => item.id !== id))
    } catch {
      // Fallback local deletion if item was static mock data
      setDishes((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleSaveDish = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingItem || !editingItem.name || editingItem.price === undefined) return

    try {
      const payload = {
        id: editingItem.id || undefined,
        name: editingItem.name,
        description: editingItem.description || '',
        price: Number(editingItem.price),
        image: editingItem.image || HERO_IMAGE,
        tag: editingItem.tag || undefined,
        categoryName: editingItem.category || 'Breakfast',
      }

      const res = await fetch('http://localhost:5000/api/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to save dish')
      }

      const savedItem = await res.json()

      if (editingItem.id) {
        setDishes((prev) => prev.map((d) => (d.id === savedItem.id ? { ...d, ...savedItem } : d)))
      } else {
        setDishes((prev) => [savedItem, ...prev])
      }

      setIsEditing(false)
      setEditingItem(null)
    } catch (err) {
      console.error('[dish] save error:', err)
      alert(err instanceof Error ? err.message : 'Error saving dish.')
    }
  }
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans">
      {/* ── Hero header (home) ─────────────────────────────── */}
      {view === 'home' && (
        <header className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-stone-900/85 via-stone-900/60 to-stone-900/90"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-12 pt-12 text-center sm:px-6 sm:pt-14">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30 ring-1 ring-white/20 sm:h-20 sm:w-20">
              <UtensilsCrossed className="h-8 w-8 text-white sm:h-10 sm:w-10" strokeWidth={2.2} />
            </div>

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.35em] text-amber-300 sm:text-xs">
              Est. {RESTAURANT.established} · Addis Ababa
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              {RESTAURANT.name}
            </h1>
            <p className="mt-3 font-display text-xl italic text-amber-200 sm:text-2xl">
              “{RESTAURANT.tagline}”
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 sm:text-sm">
              {RESTAURANT.subTagline}
            </p>

            {/* Live search */}
            <div className="relative mt-8 w-full max-w-xl">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Services..."
                aria-label="Search the menu"
                className="w-full rounded-2xl bg-white py-4 pl-12 pr-12 text-sm font-medium text-stone-900 shadow-2xl shadow-black/30 outline-none ring-1 ring-white/40 placeholder:font-normal placeholder:text-stone-400 focus:ring-2 focus:ring-amber-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full bg-stone-100 p-1.5 text-stone-500 transition hover:bg-stone-200 hover:text-stone-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-white/70 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-300" /> Open daily from 6:30 AM
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" /> 4.9 · 1,200+ happy
                guests
              </span>
            </div>
          </div>
        </header>
      )}

      {/* ── Compact header (other views) ───────────────────── */}
      {view !== 'home' && (
        <header className="border-b border-stone-200/70 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-base font-extrabold tracking-tight text-stone-900">
                  {RESTAURANT.name}
                </p>
                <p className="text-xs font-medium text-stone-500">{RESTAURANT.tagline}</p>
              </div>
            </div>

            {view === 'owner' && isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setIsAdminAuthenticated(false)
                  navigateTo('home')
                }}
                className="flex items-center gap-1.5 rounded-full bg-stone-100 px-4 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-200"
              >
                <LogOut className="h-3.5 w-3.5" /> Exit Owner Panel
              </button>
            )}
          </div>
        </header>
      )}

      {/* ── Main views ─────────────────────────────────────── */}
      <main className="flex-1 pb-28">
        {view === 'home' && (
          <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
            {/* Category pills */}
            <div className="scrollbar-hide -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20'
                      : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-amber-50 hover:text-amber-700 hover:ring-amber-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Section heading */}
            <div className="mt-6 flex items-end justify-between gap-4">
              <h2 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">
                {activeCategory === 'All' ? "Today's Menu" : activeCategory}
              </h2>
              <p className="shrink-0 text-sm font-medium text-stone-500">
                {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
              </p>
            </div>

            {/* Dish grid / empty state */}
            {filteredItems.length > 0 ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-50">
                  <Search className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900">No dishes found</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">
                  {search.trim()
                    ? `We couldn't find anything matching “${search.trim()}”.`
                    : 'This category has no dishes right now.'}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  Show full menu
                </button>
              </div>
            )}
          </section>
        )}

        {view === 'favorites' && (
          <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">
                  Your Favorites
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Dishes you starred — saved on this device.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                {favoriteItems.length} saved
              </span>
            </div>

            {favoriteItems.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteItems.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    isFavorite
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-50">
                  <Heart className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900">No favorites yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">
                  Tap the star on any dish to keep it here for later.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="mt-5 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  Browse the menu
                </button>
              </div>
            )}
          </section>
        )}

        {view === 'feedback' && (
          <section className="mx-auto w-full max-w-2xl px-4 pt-8 sm:px-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-stone-900/5 ring-1 ring-stone-900/5 sm:p-8">
              {!isSubmitted ? (
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50">
                      <Quote className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">
                        Share Your Experience
                      </h2>
                      <p className="mt-1 text-sm text-stone-500">
                        Your review helps our kitchen grow — it only takes a moment.
                      </p>
                    </div>
                  </div>

                  {/* Star rating picker */}
                  <div className="mt-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-400">
                      Tap to rate
                    </p>
                    <div
                      className="mt-3 flex justify-center gap-1.5"
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onFocus={() => setHoveredRating(star)}
                          onBlur={() => setHoveredRating(0)}
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          className="rounded-lg p-1 transition-transform duration-150 hover:scale-110"
                        >
                          <Star
                            className={`h-9 w-9 sm:h-10 sm:w-10 ${
                              star <= displayedRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-transparent text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p
                      className={`mt-3 text-sm font-bold ${
                        rating > 0 ? 'text-amber-600' : 'text-stone-400'
                      }`}
                    >
                      {rating > 0
                        ? `${rating}/5 — ${RATING_LABELS[rating]}`
                        : 'Select a rating to submit'}
                    </p>
                  </div>

                  {/* Optional name + comment */}
                  <div className="mt-7 space-y-4">
                    <div>
                      <label
                        htmlFor="feedback-name"
                        className="mb-1.5 block text-sm font-semibold text-stone-700"
                      >
                        Your name{' '}
                        <span className="font-normal text-stone-400">(optional)</span>
                      </label>
                      <input
                        id="feedback-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Sara"
                        maxLength={40}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="feedback-comment"
                        className="mb-1.5 block text-sm font-semibold text-stone-700"
                      >
                        Comment <span className="font-normal text-stone-400">(optional)</span>
                      </label>
                      <textarea
                        id="feedback-comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you loved — or how we can do better..."
                        className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={rating === 0}
                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold transition ${
                      rating === 0
                        ? 'cursor-not-allowed bg-stone-200 text-stone-400'
                        : 'bg-stone-900 text-white hover:bg-stone-700 active:scale-[0.99]'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                    Submit Review
                  </button>
                </form>
              ) : (
                /* Success confirmation */
                <div className="py-6 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
                    <Check className="h-8 w-8 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-stone-900">
                    Thank you{customerName.trim() ? `, ${customerName.trim()}` : ''}!
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">
                    Your {rating}-star review has been sent to our team.{' '}
                    {comment.trim() ? 'We loved reading your note.' : 'It means a lot to our kitchen.'}
                  </p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-transparent text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={resetFeedback}
                      className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                    >
                      Send another review
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('home')}
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-700 ring-1 ring-stone-200 transition hover:bg-stone-50"
                    >
                      Back to the menu
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-xs text-stone-400">
              Reviews are shared with our team privately — thank you for helping us improve.
            </p>
          </section>
        )}

        {view === 'owner' && (
          <section className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6">
            {!isAdminAuthenticated ? (
              /* Password Lock Screen */
              <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-stone-900/10 ring-1 ring-stone-900/5">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-stone-900">
                  Owner Portal
                </h2>
                <p className="mt-1 text-center text-sm text-stone-500">
                  Enter your secure password to manage dishes.
                </p>

                <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
                  <div>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password..."
                      autoFocus
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3.5 text-sm text-stone-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    />
                  </div>

                  {adminAuthError && (
                    <p className="text-xs font-semibold text-rose-600 text-center">{adminAuthError}</p>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-stone-700"
                  >
                    <ShieldCheck className="h-4 w-4" /> Unlock Dashboard
                  </button>
                </form>
              </div>
            ) : (
              /* Owner CRUD Dashboard */
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">
                      Menu Management
                    </h2>
                    <p className="text-sm text-stone-500">
                      Add, edit, or remove dishes for {RESTAURANT.name}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem({ name: '', description: '', price: 0, image: '', category: 'Breakfast' })
                      setIsEditing(true)
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 shadow-lg shadow-amber-500/20"
                  >
                    <Plus className="h-4 w-4" /> Add New Dish
                  </button>
                </div>

                {/* Edit / Add Modal */}
                {isEditing && (
                  <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-stone-900">
                          {editingItem?.id ? 'Edit Dish' : 'Add New Dish'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false)
                            setEditingItem(null)
                          }}
                          className="rounded-full bg-stone-100 p-2 text-stone-500 hover:bg-stone-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveDish} className="mt-6 space-y-4">
                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-600">
                            Dish Name
                          </label>
                          <input
                            type="text"
                            required
                            value={editingItem?.name || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                            placeholder="e.g. Doro Wat"
                            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-600">
                              Price (ETB)
                            </label>
                            <input
                              type="number"
                              required
                              min={0}
                              value={editingItem?.price || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                              placeholder="e.g. 450"
                              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-600">
                              Category
                            </label>
                            <select
                              value={editingItem?.category || 'Breakfast'}
                              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as Category })}
                              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            >
                              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-600">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={editingItem?.description || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            placeholder="Briefly describe ingredients or preparation..."
                            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-600">
                            Image URL
                          </label>
                          <input
                            type="url"
                            value={editingItem?.image || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>

                        <div className="mt-6 flex gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false)
                              setEditingItem(null)
                            }}
                            className="w-full rounded-2xl bg-stone-100 py-3.5 text-sm font-bold text-stone-700 hover:bg-stone-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="w-full rounded-2xl bg-stone-900 py-3.5 text-sm font-bold text-white hover:bg-stone-700"
                          >
                            Save Dish
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Dishes Management Grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-900/5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                            {dish.category}
                          </span>
                          <span className="font-extrabold text-stone-900">
                            {dish.price.toLocaleString('en-US')} ETB
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-bold text-stone-900">{dish.name}</h3>
                        <p className="mt-1 text-xs text-stone-500 line-clamp-2">{dish.description}</p>
                      </div>

                      <div className="mt-6 flex items-center gap-2 border-t border-stone-100 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(dish)
                            setIsEditing(true)
                          }}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-stone-100 py-2.5 text-xs font-bold text-stone-700 transition hover:bg-stone-200"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDish(dish.id)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-stone-900 text-stone-300">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-base font-extrabold text-white">{RESTAURANT.name}</p>
                <p className="font-display text-sm italic text-amber-300">
                  {RESTAURANT.tagline}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-400">
              {RESTAURANT.subTagline} — slow-cooked Ethiopian classics, fresh-pressed juices and
              ceremonial coffee, made fresh every day in Addis Ababa.
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
              <Clock className="h-4 w-4 text-amber-400" /> Opening Hours
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {RESTAURANT.hours.map((slot) => (
                <li
                  key={slot.days}
                  className="flex justify-between gap-4 border-b border-white/5 pb-2"
                >
                  <span className="font-medium text-stone-300">{slot.days}</span>
                  <span className="text-stone-400">{slot.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
              <MapPin className="h-4 w-4 text-amber-400" /> Find Us
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-stone-400">{RESTAURANT.address}</p>
            <a
              href={`tel:${RESTAURANT.phone.replace(/\s/g, '')}`}
              className="mt-3 flex items-center gap-2 text-sm text-stone-300 transition hover:text-amber-300"
            >
              <Phone className="h-4 w-4 text-amber-400" /> {RESTAURANT.phone}
            </a>
            <p className="mt-3 text-xs text-stone-500">Cash · Mobile Money · Cards accepted</p>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 pb-24 pt-6 text-center text-xs text-stone-500 sm:px-6 sm:pb-6">
          {RESTAURANT.copyright} · Prices in Ethiopian Birr (ETB), inclusive of tax.
        </div>
      </footer>

      {/* ── Floating glassmorphism bottom nav ──────────────── */}
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:pb-6"
      >
        <div className="flex items-center gap-1 rounded-full border border-white/50 bg-white/70 p-1.5 shadow-2xl shadow-stone-900/25 backdrop-blur-xl">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = view === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigateTo(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[13px] font-bold transition-all duration-200 sm:px-5 sm:text-sm ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-md shadow-stone-900/30'
                    : 'text-stone-500 hover:bg-white hover:text-stone-900'
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${
                    isActive
                      ? id === 'favorites'
                        ? 'fill-amber-300 text-amber-300'
                        : 'text-amber-300'
                      : id === 'favorites' && favorites.length > 0
                        ? 'fill-rose-500 text-rose-500'
                        : ''
                  }`}
                />
                <span>
                  {id === 'feedback' ? (
                    <>
                      <span className="hidden sm:inline">Send </span>Feedback
                    </>
                  ) : (
                    label
                  )}
                </span>
                {id === 'favorites' && favorites.length > 0 && (
                  <span
                    className={`grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[10px] font-extrabold ${
                      isActive ? 'bg-amber-400 text-stone-900' : 'bg-stone-900 text-white'
                    }`}
                  >
                    {favorites.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}