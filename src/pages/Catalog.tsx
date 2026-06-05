import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdCard from "@/components/AdCard";
import Icon from "@/components/ui/icon";
import { AD_CATEGORIES, MOCK_ADS, RUSSIAN_CITIES } from "@/data/cities";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("cat") || "");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredAds = MOCK_ADS.filter(ad => {
    if (selectedCategory && ad.category !== selectedCategory) return false;
    if (selectedCity && ad.city !== selectedCity) return false;
    if (priceFrom && ad.price < Number(priceFrom)) return false;
    if (priceTo && ad.price > Number(priceTo)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="Каталог" />

      {/* Page header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-brand-orange">Главная</Link>
            <Icon name="ChevronRight" size={12} />
            <span className="text-foreground">Каталог</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl">
                {selectedCategory ? AD_CATEGORIES.find(c => c.id === selectedCategory)?.label || "Каталог" : "Все объявления"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Найдено {filteredAds.length} объявлений</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "border-brand-orange text-brand-orange bg-orange-50" : "border-border hover:border-brand-orange"}`}
              >
                <Icon name="SlidersHorizontal" size={16} />
                Фильтры
              </button>
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-brand-orange text-white" : "hover:bg-muted"}`}>
                  <Icon name="LayoutGrid" size={16} />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-brand-orange text-white" : "hover:bg-muted"}`}>
                  <Icon name="List" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Categories strip */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${!selectedCategory ? "btn-gradient" : "bg-white border border-border hover:border-brand-orange"}`}
          >
            Все категории
          </button>
          {AD_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${selectedCategory === cat.id ? "btn-gradient" : "bg-white border border-border hover:border-brand-orange"}`}
            >
              <Icon name={cat.icon as "Home"} size={14} />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          {showFilters && (
            <aside className="w-64 shrink-0 animate-fade-in">
              <div className="bg-white rounded-2xl border border-border p-5 space-y-6 sticky top-24">
                <div>
                  <h3 className="font-heading font-bold text-sm mb-3">Город</h3>
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-brand-orange"
                  >
                    <option value="">Все города</option>
                    {RUSSIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm mb-3">Цена, ₽</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={priceFrom}
                      onChange={e => setPriceFrom(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-brand-orange"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={priceTo}
                      onChange={e => setPriceTo(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm mb-3">Сортировка</h3>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-brand-orange"
                  >
                    <option value="date">По дате (новые)</option>
                    <option value="price_asc">Цена: по возрастанию</option>
                    <option value="price_desc">Цена: по убыванию</option>
                    <option value="views">По популярности</option>
                  </select>
                </div>

                <button
                  onClick={() => { setSelectedCategory(""); setSelectedCity(""); setPriceFrom(""); setPriceTo(""); }}
                  className="w-full py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            </aside>
          )}

          {/* Ads grid */}
          <div className="flex-1">
            {filteredAds.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">Ничего не найдено</h3>
                <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
                <button
                  onClick={() => { setSelectedCategory(""); setSelectedCity(""); setPriceFrom(""); setPriceTo(""); }}
                  className="mt-4 px-6 py-3 btn-gradient rounded-xl font-semibold"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {filteredAds.map(ad => (
                  <AdCard key={ad.id} ad={ad} onFavorite={toggleFavorite} isFavorite={favorites.includes(ad.id)} />
                ))}
              </div>
            )}

            {filteredAds.length > 0 && (
              <div className="flex justify-center mt-8 gap-2">
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${p === 1 ? "btn-gradient" : "bg-white border border-border hover:border-brand-orange"}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
