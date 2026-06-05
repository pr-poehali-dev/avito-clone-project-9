import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { RUSSIAN_CITIES } from "@/data/cities";

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const filteredCities = RUSSIAN_CITIES.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 12);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg leading-none">О</span>
            </div>
            <span className="font-heading font-black text-xl gradient-brand-text hidden sm:block">
              ОбъявиRU
            </span>
          </Link>

          {/* City selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setCityOpen(!cityOpen)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="MapPin" size={14} className="text-brand-orange" />
              <span className="max-w-[80px] truncate">{selectedCity}</span>
              <Icon name="ChevronDown" size={12} />
            </button>
            {cityOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden animate-scale-in">
                <div className="p-2 border-b border-border">
                  <input
                    type="text"
                    placeholder="Поиск города..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-muted outline-none"
                    autoFocus
                  />
                </div>
                <div className="max-h-52 overflow-y-auto py-1">
                  {filteredCities.map(city => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setCityOpen(false); setSearchQuery(""); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 transition-colors ${selectedCity === city ? "text-brand-orange font-semibold" : ""}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по объявлениям..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-sm outline-none focus:border-brand-orange focus:bg-white transition-all"
                onKeyDown={e => e.key === "Enter" && navigate("/catalog")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/post-ad"
              className="btn-gradient hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md"
            >
              <Icon name="Plus" size={16} />
              <span>Подать</span>
            </Link>

            <Link to="/cabinet" className="p-2.5 rounded-xl hover:bg-muted transition-colors relative">
              <Icon name="User" size={20} className="text-foreground" />
            </Link>

            <Link to="/messages" className="p-2.5 rounded-xl hover:bg-muted transition-colors relative">
              <Icon name="MessageCircle" size={20} className="text-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
            </Link>

            <Link to="/support" className="p-2.5 rounded-xl hover:bg-muted transition-colors relative">
              <Icon name="Headphones" size={20} className="text-foreground" />
            </Link>

            <button
              className="sm:hidden p-2.5 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name="Menu" size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6 h-10 text-sm border-t border-border/50">
          {[
            { label: "Главная", to: "/" },
            { label: "Каталог", to: "/catalog" },
            { label: "Недвижимость", to: "/catalog?cat=estate" },
            { label: "Авто", to: "/catalog?cat=auto" },
            { label: "Электроника", to: "/catalog?cat=electronics" },
            { label: "О платформе", to: "/about" },
            { label: "Контакты", to: "/contacts" },
          ].map(item => (
            <Link
              key={item.label}
              to={item.to}
              className={`hover:text-brand-orange transition-colors font-medium ${currentPage === item.label ? "text-brand-orange" : "text-muted-foreground"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden py-3 border-t border-border animate-fade-in">
            {[
              { label: "Главная", to: "/" },
              { label: "Каталог", to: "/catalog" },
              { label: "Мой кабинет", to: "/cabinet" },
              { label: "Подать объявление", to: "/post-ad" },
              { label: "Поддержка", to: "/support" },
              { label: "О платформе", to: "/about" },
            ].map(item => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm font-medium hover:text-brand-orange transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {cityOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setCityOpen(false)} />
      )}
    </header>
  );
}