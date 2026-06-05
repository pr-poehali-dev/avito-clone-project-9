import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { RUSSIAN_CITIES } from "@/data/cities";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [citySearch, setCitySearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuth();

  const filteredCities = RUSSIAN_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 14);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg leading-none">Л</span>
            </div>
            <span className="font-heading font-black text-xl gradient-brand-text hidden sm:block">
              Лавка
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
                    value={citySearch}
                    onChange={e => setCitySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-muted outline-none"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {filteredCities.map(city => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setCityOpen(false); setCitySearch(""); }}
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
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по объявлениям..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-sm outline-none focus:border-brand-orange focus:bg-white transition-all"
                onKeyDown={e => e.key === "Enter" && navigate(`/catalog?q=${searchQuery}`)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              to="/post-ad"
              className="btn-gradient hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md"
            >
              <Icon name="Plus" size={16} />
              <span>Подать</span>
            </Link>

            {isAuth ? (
              <>
                {/* Avatar / cabinet */}
                <Link
                  to="/cabinet"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {user!.avatar}
                  </div>
                  <span className="hidden md:block text-sm font-medium max-w-[80px] truncate">{user!.name.split(" ")[0]}</span>
                </Link>

                <Link to="/messages" className="p-2.5 rounded-xl hover:bg-muted transition-colors relative">
                  <Icon name="MessageCircle" size={20} className="text-foreground" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl hover:bg-muted transition-colors hidden sm:block"
                  title="Выйти"
                >
                  <Icon name="LogOut" size={18} className="text-muted-foreground" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  <Icon name="LogIn" size={15} />
                  Войти
                </Link>
                <Link to="/auth" className="sm:hidden p-2.5 rounded-xl hover:bg-muted transition-colors">
                  <Icon name="User" size={20} className="text-foreground" />
                </Link>
              </>
            )}

            <Link to="/support" className="p-2.5 rounded-xl hover:bg-muted transition-colors hidden sm:block">
              <Icon name="Headphones" size={19} className="text-foreground" />
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
          <div className="sm:hidden py-3 border-t border-border animate-fade-in space-y-0.5">
            {[
              { label: "Главная", to: "/" },
              { label: "Каталог", to: "/catalog" },
              { label: "Подать объявление", to: "/post-ad" },
              { label: "Сообщения", to: "/messages" },
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
            {isAuth ? (
              <>
                <Link to="/cabinet" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm font-medium hover:text-brand-orange transition-colors">
                  Мой кабинет
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors w-full text-left">
                  Выйти
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm font-semibold text-brand-orange">
                Войти / Зарегистрироваться
              </Link>
            )}
          </div>
        )}
      </div>

      {cityOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setCityOpen(false)} />
      )}
    </header>
  );
}
