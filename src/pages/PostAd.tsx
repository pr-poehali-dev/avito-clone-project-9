import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";
import { AD_CATEGORIES, RUSSIAN_CITIES } from "@/data/cities";
import { useAuth } from "@/context/AuthContext";

export default function PostAd() {
  const { user, isAuth, updateBalance } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState(user?.city || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isPremium, setIsPremium] = useState(false);
  const [published, setPublished] = useState(false);

  const balance = user?.balance ?? 0;
  const adCost = isPremium ? 69 : 10;
  const canAfford = balance >= adCost;

  const handlePublish = () => {
    if (!canAfford) return;
    updateBalance(-adCost);
    setPublished(true);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-6">
            <Icon name="FileText" size={36} className="text-white" />
          </div>
          <h1 className="font-heading font-black text-2xl mb-3">Войдите в аккаунт</h1>
          <p className="text-muted-foreground mb-6">Чтобы подавать объявления, нужно авторизоваться</p>
          <Link to="/auth" className="w-full btn-gradient py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-3">
            <Icon name="LogIn" size={16} />
            Войти
          </Link>
          <Link to="/auth" className="w-full py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors flex items-center justify-center">
            Зарегистрироваться
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (published) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={40} className="text-green-500" />
          </div>
          <h1 className="font-heading font-black text-2xl mb-3">Объявление опубликовано!</h1>
          <p className="text-muted-foreground mb-2">С вашего баланса списано <strong>{adCost} ₽</strong></p>
          <p className="text-muted-foreground mb-8 text-sm">Объявление проходит модерацию и появится в каталоге в течение 4 часов</p>
          <div className="flex gap-3 justify-center">
            <Link to="/catalog" className="btn-gradient px-6 py-3 rounded-xl font-bold">
              Смотреть каталог
            </Link>
            <Link to="/cabinet" className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors">
              Мои объявления
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-brand-orange">Главная</Link>
          <Icon name="ChevronRight" size={12} />
          <span className="text-foreground">Подать объявление</span>
        </div>

        <h1 className="font-heading font-black text-3xl mb-2">Подать объявление</h1>
        <p className="text-muted-foreground mb-8">
          Стоимость размещения — <strong>10 рублей</strong>. Ваш баланс:{" "}
          <strong className={balance > 0 ? "text-brand-orange" : "text-red-500"}>{balance} ₽</strong>
        </p>

        {/* Steps */}
        <div className="flex items-center gap-0 mb-8">
          {[
            { n: 1, label: "Категория" },
            { n: 2, label: "Детали" },
            { n: 3, label: "Фото" },
            { n: 4, label: "Публикация" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <button
                onClick={() => step > s.n && setStep(s.n)}
                className={`flex items-center gap-2 shrink-0 ${step > s.n ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${step === s.n ? "gradient-brand text-white shadow-md" : step > s.n ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {step > s.n ? <Icon name="Check" size={14} /> : s.n}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.n ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              </button>
              {i < 3 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.n ? "bg-brand-orange" : "bg-border"}`}></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Category */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-heading font-bold text-xl mb-4">Выберите категорию</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AD_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${category === cat.id ? "border-brand-orange bg-orange-50" : "border-border bg-white hover:border-brand-orange/50"}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${category === cat.id ? "gradient-brand" : "gradient-card"}`}>
                    <Icon name={cat.icon as "Home"} size={18} className={category === cat.id ? "text-white" : "text-brand-orange"} />
                  </div>
                  <span className="text-sm font-semibold">{cat.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => category && setStep(2)}
              disabled={!category}
              className="mt-6 btn-gradient px-8 py-3 rounded-xl font-bold disabled:opacity-40"
            >
              Продолжить
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="animate-fade-in space-y-5">
            <h2 className="font-heading font-bold text-xl mb-4">Детали объявления</h2>
            <div>
              <label className="block text-sm font-semibold mb-2">Заголовок объявления *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Например: iPhone 15 Pro, 256GB, как новый"
                className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">{title.length}/100</div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Описание *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                placeholder="Подробно опишите товар: состояние, характеристики, причина продажи..."
                className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Цена, ₽ *</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Город *</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
                >
                  <option value="">Выберите город</option>
                  {RUSSIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Телефон для связи *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+7 (999) 000-00-00"
                className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                Назад
              </button>
              <button
                onClick={() => title && price && city && setStep(3)}
                disabled={!title || !price || !city}
                className="btn-gradient px-8 py-3 rounded-xl font-bold disabled:opacity-40"
              >
                Продолжить
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-heading font-bold text-xl mb-2">Добавьте фотографии</h2>
            <p className="text-muted-foreground text-sm mb-6">До 10 фото. Первое фото — обложка объявления</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${i === 0 ? "border-brand-orange bg-orange-50" : "border-border hover:border-brand-orange/50 hover:bg-muted/50"}`}
                >
                  {i === 0 ? (
                    <div className="text-center">
                      <Icon name="Camera" size={20} className="text-brand-orange mx-auto mb-1" />
                      <span className="text-xs text-brand-orange font-medium">Главное</span>
                    </div>
                  ) : (
                    <Icon name="Plus" size={18} className="text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                Назад
              </button>
              <button onClick={() => setStep(4)} className="btn-gradient px-8 py-3 rounded-xl font-bold">
                Продолжить
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Publish */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="font-heading font-bold text-xl mb-6">Публикация</h2>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-border p-5 mb-5">
              <h3 className="font-heading font-bold mb-3">Проверьте данные</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Категория:</span><span className="font-medium">{AD_CATEGORIES.find(c => c.id === category)?.label}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Заголовок:</span><span className="font-medium line-clamp-1">{title || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Цена:</span><span className="font-bold text-brand-orange">{price ? `${Number(price).toLocaleString()} ₽` : "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Город:</span><span className="font-medium">{city || "—"}</span></div>
              </div>
            </div>

            {/* Premium upsell */}
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border border-brand-orange/30 p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                  <Icon name="Star" size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold">Премиум размещение</h3>
                    <button
                      onClick={() => setIsPremium(!isPremium)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${isPremium ? "gradient-brand" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isPremium ? "translate-x-6" : "translate-x-0.5"}`}></span>
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Ваше объявление будет выше в поиске и отмечено значком ⭐</p>
                  <div className="text-sm font-bold text-brand-orange mt-1">+59 ₽/день</div>
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className="bg-white rounded-2xl border border-border p-5 mb-5">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-muted-foreground">Размещение объявления</span>
                <span>10 ₽</span>
              </div>
              {isPremium && (
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-muted-foreground">Премиум размещение (1 день)</span>
                  <span>59 ₽</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-heading font-bold">
                <span>Итого</span>
                <span className="gradient-brand-text">{adCost} ₽</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Ваш баланс после оплаты</span>
                <span className={balance - adCost < 0 ? "text-red-500" : "text-green-600"}>{balance - adCost} ₽</span>
              </div>
            </div>

            {!canAfford && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700">
                <Icon name="AlertTriangle" size={16} />
                Недостаточно средств.{" "}
                <Link to="/cabinet" className="font-bold underline">Пополнить баланс</Link>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors">
                Назад
              </button>
              <button
                onClick={handlePublish}
                disabled={!canAfford}
                className="btn-gradient flex-1 py-3 rounded-xl font-bold disabled:opacity-40"
              >
                Опубликовать за {adCost} ₽
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
