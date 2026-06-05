import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdCard from "@/components/AdCard";
import Icon from "@/components/ui/icon";
import { AD_CATEGORIES, MOCK_ADS } from "@/data/cities";

export default function Home() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const premiumAds = MOCK_ADS.filter(a => a.premium);
  const regularAds = MOCK_ADS.filter(a => !a.premium);

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="Главная" />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-brand noise-bg py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-6 animate-fade-in border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Более 2 млн активных объявлений
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white mb-6 animate-slide-up leading-tight stagger-1">
            Продай и купи<br />всё что угодно
          </h1>
          <p className="text-white/80 text-lg sm:text-xl mb-8 animate-slide-up stagger-2">
            Лучшая доска объявлений России. Бесплатная регистрация, удобный поиск, безопасные сделки.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 max-w-2xl mx-auto animate-slide-up stagger-3">
            <div className="relative flex-1">
              <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Что ищете?"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && navigate(`/catalog?q=${searchQuery}`)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-base bg-white shadow-xl border-0 outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              onClick={() => navigate(`/catalog?q=${searchQuery}`)}
              className="px-6 py-4 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors shadow-xl"
            >
              Найти
            </button>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 animate-slide-up stagger-4">
            {["iPhone", "Авто", "Квартира", "Ноутбук", "Щенки", "Работа"].map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`/catalog?q=${tag}`)}
                className="px-3 py-1.5 rounded-full bg-white/15 text-white text-sm hover:bg-white/25 transition-colors border border-white/20 backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: "Объявлений", value: "2 400 000+", icon: "FileText" },
              { label: "Пользователей", value: "850 000+", icon: "Users" },
              { label: "Городов России", value: "500+", icon: "MapPin" },
              { label: "Сделок в день", value: "12 000+", icon: "TrendingUp" },
            ].map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-2">
                  <Icon name={stat.icon as any} size={22} className="text-white" />
                </div>
                <div className="font-heading font-black text-xl text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-black text-2xl sm:text-3xl">Категории</h2>
          <Link to="/catalog" className="text-brand-orange font-semibold text-sm hover:underline flex items-center gap-1">
            Все категории <Icon name="ChevronRight" size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {AD_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/catalog?cat=${cat.id}`}
              className="group bg-white border border-border rounded-2xl p-4 text-center card-hover animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-card flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Icon name={cat.icon as any} size={22} className="text-brand-orange" />
              </div>
              <div className="text-xs font-semibold text-foreground leading-tight mb-1">{cat.label}</div>
              <div className="text-xs text-muted-foreground">{cat.count.toLocaleString()}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium ads */}
      <section className="max-w-7xl mx-auto px-4 py-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-heading font-black text-2xl sm:text-3xl">Премиум объявления</h2>
            <span className="badge-premium">⭐ VIP</span>
          </div>
          <Link to="/catalog?premium=true" className="text-brand-orange font-semibold text-sm hover:underline flex items-center gap-1">
            Смотреть все <Icon name="ChevronRight" size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {premiumAds.map(ad => (
            <AdCard key={ad.id} ad={ad} onFavorite={toggleFavorite} isFavorite={favorites.includes(ad.id)} />
          ))}
        </div>
      </section>

      {/* Regular ads */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-black text-2xl sm:text-3xl">Свежие объявления</h2>
          <Link to="/catalog" className="text-brand-orange font-semibold text-sm hover:underline flex items-center gap-1">
            Смотреть все <Icon name="ChevronRight" size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regularAds.map(ad => (
            <AdCard key={ad.id} ad={ad} onFavorite={toggleFavorite} isFavorite={favorites.includes(ad.id)} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="gradient-brand rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-2xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white mb-2">
                Разместите объявление
              </h2>
              <p className="text-white/80 text-base">
                Всего <strong>10 рублей</strong> — и ваше объявление увидят миллионы. Пополните баланс и начните продавать!
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/cabinet"
                className="px-6 py-3 rounded-xl bg-white text-brand-orange font-bold hover:bg-white/90 transition-colors shadow-lg"
              >
                Пополнить баланс
              </Link>
              <Link
                to="/post-ad"
                className="px-6 py-3 rounded-xl bg-white/15 text-white font-bold border border-white/30 hover:bg-white/25 transition-colors"
              >
                Подать объявление
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-center mb-10">Премиум возможности</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "Zap", title: "Поднятие в топ", desc: "Ваше объявление будет первым в поиске. Максимальный охват аудитории.", price: "59 ₽/день" },
              { icon: "Star", title: "Золотое размещение", desc: "Яркая пометка Premium, выделение цветом, приоритет в каталоге.", price: "99 ₽/день" },
              { icon: "Bell", title: "Рассылка подписчикам", desc: "Ваше объявление отправится пользователям подписанным на категорию.", price: "149 ₽/раз" },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border card-hover text-center">
                <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
                  <Icon name={f.icon as any} size={26} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{f.desc}</p>
                <div className="font-heading font-black text-xl gradient-brand-text">{f.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
