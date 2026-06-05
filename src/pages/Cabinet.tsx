import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";
import { MOCK_ADS } from "@/data/cities";
import { useAuth } from "@/context/AuthContext";

type CabinetTab = "ads" | "favorites" | "balance" | "settings";

export default function Cabinet() {
  const { user, isAuth, logout, updateBalance } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<CabinetTab>("ads");
  const [topupAmount, setTopupAmount] = useState("500");
  const [showTopup, setShowTopup] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [topupSuccess, setTopupSuccess] = useState(false);
  const [adFilter, setAdFilter] = useState("Все");
  const [savedName, setSavedName] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");

  const myAds = MOCK_ADS.slice(0, 4);
  const favoriteAds = MOCK_ADS.slice(2, 6);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

  const handleTopup = () => {
    const amount = Number(topupAmount);
    if (amount > 0) {
      updateBalance(amount);
      setTopupSuccess(true);
      setTimeout(() => { setTopupSuccess(false); setShowTopup(false); }, 2000);
    }
  };

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-6">
            <Icon name="User" size={36} className="text-white" />
          </div>
          <h1 className="font-heading font-black text-2xl mb-3">Войдите в аккаунт</h1>
          <p className="text-muted-foreground mb-6">Чтобы управлять объявлениями и балансом</p>
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

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="Личный кабинет" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shrink-0">
            <span className="text-white font-black text-2xl">{user!.avatar}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading font-black text-xl">{user!.name}</h1>
              {user!.verified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Верифицирован</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {user!.email || user!.phone} · {user!.city} · На сайте с {user!.createdAt}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-muted-foreground">{user!.adsCount} объявлений</span>
              <span className="text-muted-foreground">⭐ {user!.rating} рейтинг</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">Баланс</div>
              <div className="font-heading font-black text-2xl gradient-brand-text">{user!.balance} ₽</div>
            </div>
            <button
              onClick={() => setShowTopup(true)}
              className="btn-gradient px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <Icon name="Plus" size={14} />
              Пополнить
            </button>
          </div>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <nav className="bg-white rounded-2xl border border-border overflow-hidden">
              {([
                { id: "ads", label: "Мои объявления", icon: "FileText", count: myAds.length },
                { id: "favorites", label: "Избранное", icon: "Heart", count: favoriteAds.length },
                { id: "balance", label: "Баланс и оплата", icon: "Wallet" },
                { id: "settings", label: "Настройки", icon: "Settings" },
              ] as { id: CabinetTab; label: string; icon: string; count?: number }[]).map(item => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-border last:border-0 ${tab === item.id ? "bg-orange-50 text-brand-orange border-l-2 border-l-brand-orange" : "hover:bg-muted text-foreground"}`}
                >
                  <Icon name={item.icon as "Home"} size={16} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-xs bg-muted rounded-full px-2 py-0.5">{item.count}</span>
                  )}
                </button>
              ))}
            </nav>
            <Link to="/post-ad" className="mt-3 btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm">
              <Icon name="Plus" size={16} />
              Подать объявление
            </Link>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-500 border border-border hover:border-red-300 transition-colors"
            >
              <Icon name="LogOut" size={15} />
              Выйти
            </button>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* My Ads */}
            {tab === "ads" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h2 className="font-heading font-bold text-xl">Мои объявления</h2>
                  <div className="flex gap-2 flex-wrap">
                    {["Все", "Активные", "На модерации", "Завершённые"].map(s => (
                      <button
                        key={s}
                        onClick={() => setAdFilter(s)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${adFilter === s ? "btn-gradient border-transparent" : "bg-white border-border hover:border-brand-orange"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {myAds.map(ad => (
                    <div key={ad.id} className="bg-white rounded-2xl border border-border p-4 flex gap-4 card-hover">
                      <Link to={`/ad/${ad.id}`}>
                        <img src={ad.image} alt={ad.title} className="w-20 h-20 rounded-xl object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/ad/${ad.id}`}>
                            <h3 className="font-medium text-sm line-clamp-1 hover:text-brand-orange transition-colors">{ad.title}</h3>
                          </Link>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${ad.premium ? "bg-orange-100 text-brand-orange" : "bg-green-100 text-green-700"}`}>
                            {ad.premium ? "⭐ Премиум" : "✓ Активно"}
                          </span>
                        </div>
                        <div className="font-heading font-bold text-brand-orange mt-1">{formatPrice(ad.price)}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Icon name="Eye" size={11} />{ad.views} просмотров</span>
                          <span className="flex items-center gap-1"><Icon name="MapPin" size={11} />{ad.city}</span>
                          <span>{ad.date}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Link to={`/ad/${ad.id}`} className="p-2 rounded-lg border border-border hover:border-brand-orange transition-colors" title="Редактировать">
                          <Icon name="Pencil" size={14} />
                        </Link>
                        <button className="p-2 rounded-lg border border-border hover:border-red-400 hover:text-red-400 transition-colors" title="Удалить">
                          <Icon name="Trash2" size={14} />
                        </button>
                        <button
                          onClick={() => setTab("balance")}
                          className="p-2 rounded-lg border border-brand-orange/30 bg-orange-50 text-brand-orange hover:bg-orange-100 transition-colors"
                          title="Поднять в топ"
                        >
                          <Icon name="TrendingUp" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites */}
            {tab === "favorites" && (
              <div className="animate-fade-in">
                <h2 className="font-heading font-bold text-xl mb-4">Избранное</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteAds.map(ad => (
                    <Link key={ad.id} to={`/ad/${ad.id}`} className="bg-white rounded-2xl border border-border overflow-hidden card-hover flex gap-3 p-3">
                      <img src={ad.image} alt={ad.title} className="w-20 h-20 rounded-xl object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-2 mb-1">{ad.title}</h3>
                        <div className="font-heading font-bold text-brand-orange text-sm">{formatPrice(ad.price)}</div>
                        <div className="text-xs text-muted-foreground mt-1">{ad.city}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Balance */}
            {tab === "balance" && (
              <div className="animate-fade-in space-y-6">
                <h2 className="font-heading font-bold text-xl">Баланс и оплата</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Текущий баланс", value: `${user!.balance} ₽`, icon: "Wallet", color: "text-brand-orange" },
                    { label: "Потрачено всего", value: "1 240 ₽", icon: "TrendingDown", color: "text-red-500" },
                    { label: "Объявлений оплачено", value: "124", icon: "FileText", color: "text-green-600" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-border p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl gradient-card flex items-center justify-center">
                          <Icon name={s.icon as "Home"} size={18} className="text-brand-orange" />
                        </div>
                        <span className="text-sm text-muted-foreground">{s.label}</span>
                      </div>
                      <div className={`font-heading font-black text-2xl ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Quick topup */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading font-bold text-lg mb-4">Пополнить баланс</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {["100", "300", "500", "1000"].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setTopupAmount(amt)}
                        className={`py-3 rounded-xl text-sm font-bold border transition-colors ${topupAmount === amt ? "btn-gradient border-transparent" : "border-border hover:border-brand-orange"}`}
                      >
                        {amt} ₽
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="number"
                      value={topupAmount}
                      onChange={e => setTopupAmount(e.target.value)}
                      placeholder="Своя сумма"
                      className="flex-1 px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
                    />
                    <button onClick={() => setShowTopup(true)} className="btn-gradient px-6 py-3 rounded-xl font-bold text-sm">
                      Пополнить
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowTopup(true)}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 border-brand-orange bg-orange-50 font-medium text-sm"
                    >
                      <Icon name="CreditCard" size={20} className="text-brand-orange" />
                      <div className="text-left">
                        <div className="font-semibold text-brand-orange">Банковская карта</div>
                        <div className="text-xs text-muted-foreground">Visa, MasterCard, МИР</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setShowTopup(true)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand-orange transition-colors font-medium text-sm"
                    >
                      <Icon name="Smartphone" size={20} className="text-muted-foreground" />
                      <div className="text-left">
                        <div className="font-semibold">СБП</div>
                        <div className="text-xs text-muted-foreground">Система быстрых платежей</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Saved card */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-lg">Привязанные карты</h3>
                    <button
                      onClick={() => setShowTopup(true)}
                      className="text-brand-orange text-sm font-semibold flex items-center gap-1"
                    >
                      <Icon name="Plus" size={14} />
                      Добавить карту
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-5 text-white max-w-xs">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-10 h-8 rounded-md bg-yellow-400/80"></div>
                      <span className="text-xs opacity-60">VISA</span>
                    </div>
                    <div className="font-mono text-lg tracking-widest mb-3">•••• •••• •••• 4782</div>
                    <div className="flex justify-between text-xs opacity-70">
                      <span>{user!.name}</span>
                      <span>09/26</span>
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading font-bold text-lg mb-4">История транзакций</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Пополнение баланса", amount: "+500 ₽", date: "05.06.2024", type: "in" },
                      { label: "Размещение объявления", amount: "-10 ₽", date: "04.06.2024", type: "out" },
                      { label: "Премиум размещение", amount: "-59 ₽", date: "03.06.2024", type: "out" },
                      { label: "Пополнение баланса", amount: "+300 ₽", date: "01.06.2024", type: "in" },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === "in" ? "bg-green-100" : "bg-red-50"}`}>
                            <Icon name={tx.type === "in" ? "ArrowDownLeft" : "ArrowUpRight"} size={16} className={tx.type === "in" ? "text-green-600" : "text-red-500"} />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{tx.label}</div>
                            <div className="text-xs text-muted-foreground">{tx.date}</div>
                          </div>
                        </div>
                        <span className={`font-heading font-bold ${tx.type === "in" ? "text-green-600" : "text-red-500"}`}>{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {tab === "settings" && (
              <div className="animate-fade-in space-y-6">
                <h2 className="font-heading font-bold text-xl">Настройки профиля</h2>
                <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Имя</label>
                      <input
                        value={editName}
                        onChange={e => { setEditName(e.target.value); setSavedName(false); }}
                        className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-brand-orange text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        {user!.email ? "Email" : "Телефон"}
                      </label>
                      <input
                        defaultValue={user!.email || user!.phone}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>
                  {savedName && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Icon name="CheckCircle" size={15} />
                      Изменения сохранены
                    </div>
                  )}
                  <button
                    onClick={() => setSavedName(true)}
                    className="btn-gradient px-6 py-3 rounded-xl font-semibold text-sm"
                  >
                    Сохранить изменения
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading font-bold text-base mb-4">Безопасность</h3>
                  <div className="space-y-3">
                    {[
                      { icon: "Lock", label: "Сменить пароль" },
                      { icon: "Smartphone", label: "Двухфакторная аутентификация" },
                    ].map((item, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:border-brand-orange transition-colors text-sm">
                        <div className="flex items-center gap-3">
                          <Icon name={item.icon as "Home"} size={16} className="text-brand-orange" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading font-bold text-base mb-4 text-red-500">Опасная зона</h3>
                  <button
                    onClick={() => { logout(); navigate("/"); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    <Icon name="LogOut" size={16} />
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topup modal */}
      {showTopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowTopup(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-black text-xl">Пополнение баланса</h3>
              <button onClick={() => setShowTopup(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>

            {topupSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-green-500" />
                </div>
                <h4 className="font-heading font-bold text-xl mb-1">Готово!</h4>
                <p className="text-muted-foreground">Баланс пополнен на {topupAmount} ₽</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Номер карты</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCard(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Срок действия</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.slice(0, 3))}
                      placeholder="•••"
                      className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Сумма пополнения</label>
                  <input
                    type="number"
                    value={topupAmount}
                    onChange={e => setTopupAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
                  />
                </div>
                <button onClick={handleTopup} className="w-full btn-gradient py-4 rounded-xl font-bold text-base">
                  Пополнить {topupAmount} ₽
                </button>
                <p className="text-xs text-muted-foreground text-center mt-3">Платёж защищён протоколом SSL</p>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
