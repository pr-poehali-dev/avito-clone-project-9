import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";
import { MOCK_ADS } from "@/data/cities";

export default function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const ad = MOCK_ADS.find(a => a.id === Number(id)) || MOCK_ADS[0];

  const photos = [ad.image, ad.image, ad.image];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const handleWriteSeller = () => {
    navigate(`/messages?ad=${ad.id}&seller=seller_${ad.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <Link to="/" className="hover:text-brand-orange">Главная</Link>
          <Icon name="ChevronRight" size={12} />
          <Link to="/catalog" className="hover:text-brand-orange">Каталог</Link>
          <Icon name="ChevronRight" size={12} />
          <span className="text-foreground line-clamp-1">{ad.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: photos + description */}
          <div className="lg:col-span-2 space-y-5">
            {/* Photo gallery */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted">
                {ad.premium && (
                  <div className="absolute top-4 left-4 z-10 badge-premium">⭐ Премиум</div>
                )}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-all"
                >
                  <Icon name="Heart" size={18} className={isFavorite ? "text-brand-pink fill-brand-pink" : "text-muted-foreground"} />
                </button>
                <img
                  src={photos[activePhoto]}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
              </div>
              <div className="flex gap-2 p-3">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activePhoto === i ? "border-brand-orange" : "border-transparent"}`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-heading font-bold text-lg mb-3">Описание</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Продаю в отличном состоянии, использовалось аккуратно. Все функции работают исправно. Комплект полный: коробка, документы, все аксессуары. Торг уместен при осмотре. Возможна доставка по городу. Звоните или пишите — отвечу на все вопросы.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {[
                  { label: "Состояние", value: "Хорошее" },
                  { label: "Тип сделки", value: "Продажа" },
                  { label: "Город", value: ad.city },
                  { label: "Размещено", value: ad.date },
                ].map((f, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety */}
            <div className="bg-orange-50 rounded-2xl border border-brand-orange/20 p-4 flex gap-3">
              <Icon name="ShieldCheck" size={20} className="text-brand-orange shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold text-brand-orange mb-0.5">Советы по безопасности</div>
                <div className="text-muted-foreground">Встречайтесь в людных местах, не переводите деньги заранее, проверяйте товар при получении.</div>
              </div>
            </div>
          </div>

          {/* Right: price + seller + actions */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
              <div className="font-heading font-black text-3xl gradient-brand-text mb-1">
                {formatPrice(ad.price)}
              </div>
              <h1 className="font-heading font-bold text-lg text-foreground mb-1 leading-snug">{ad.title}</h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-5">
                <Icon name="MapPin" size={13} className="text-brand-orange" />
                <span>{ad.city}</span>
                <span>·</span>
                <span>{ad.date}</span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleWriteSeller}
                  className="w-full btn-gradient py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Icon name="MessageCircle" size={18} />
                  Написать продавцу
                </button>
                {showContact ? (
                  <div className="w-full py-3.5 rounded-xl border-2 border-brand-orange bg-orange-50 text-center">
                    <div className="text-xs text-muted-foreground mb-0.5">Телефон продавца</div>
                    <div className="font-heading font-bold text-brand-orange">+7 (999) 123-45-67</div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowContact(true)}
                    className="w-full py-3.5 rounded-xl border border-border font-semibold text-sm hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Phone" size={16} />
                    Показать телефон
                  </button>
                )}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full py-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${isFavorite ? "border-brand-pink bg-pink-50 text-brand-pink" : "border-border hover:border-brand-pink hover:text-brand-pink"}`}
                >
                  <Icon name="Heart" size={15} className={isFavorite ? "fill-brand-pink" : ""} />
                  {isFavorite ? "В избранном" : "В избранное"}
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="Eye" size={12} />
                  <span>{ad.views} просмотров</span>
                </div>
                <button className="flex items-center gap-1 hover:text-brand-orange transition-colors">
                  <Icon name="Share2" size={12} />
                  Поделиться
                </button>
                <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                  <Icon name="Flag" size={12} />
                  Пожаловаться
                </button>
              </div>
            </div>

            {/* Seller card */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-heading font-bold text-sm mb-3">Продавец</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-lg">А</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Александр П.</div>
                  <div className="text-xs text-muted-foreground">На сайте с 2023 года</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} className="text-yellow-400 text-xs">{s}</span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">4.8</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>Объявлений: <b className="text-foreground">12</b></span>
                <span className="flex items-center gap-1 text-green-600">
                  <Icon name="CheckCircle" size={11} />
                  Верифицирован
                </span>
              </div>
              <button
                onClick={handleWriteSeller}
                className="w-full py-2.5 rounded-xl border border-brand-orange/40 text-brand-orange text-sm font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="MessageCircle" size={14} />
                Написать продавцу
              </button>
            </div>
          </div>
        </div>

        {/* Similar ads */}
        <div className="mt-10">
          <h2 className="font-heading font-black text-2xl mb-5">Похожие объявления</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOCK_ADS.filter(a => a.id !== ad.id && a.category === ad.category).slice(0, 4).concat(
              MOCK_ADS.filter(a => a.id !== ad.id).slice(0, 4)
            ).slice(0, 4).map(similar => (
              <Link key={similar.id} to={`/ad/${similar.id}`} className="bg-white rounded-2xl border border-border overflow-hidden card-hover">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={similar.image} alt={similar.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                </div>
                <div className="p-3">
                  <div className="font-heading font-bold text-brand-orange text-sm">{formatPrice(similar.price)}</div>
                  <div className="text-xs text-foreground line-clamp-2 mt-0.5">{similar.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
