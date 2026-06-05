import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { MOCK_ADS } from "@/data/cities";

type AdminTab = "dashboard" | "ads" | "users" | "support" | "payments" | "settings";

interface SupportMessage {
  id: number;
  text: string;
  from: "user" | "admin";
  time: string;
}

const TICKETS = [
  { id: 1, user: "Александр П.", subject: "Объявление не прошло модерацию", status: "open", date: "05.06.2024", unread: 1 },
  { id: 2, user: "Мария С.", subject: "Вопрос по пополнению баланса", status: "open", date: "05.06.2024", unread: 2 },
  { id: 3, user: "Дмитрий В.", subject: "Не могу войти в аккаунт", status: "pending", date: "04.06.2024", unread: 0 },
  { id: 4, user: "Анна К.", subject: "Хочу вернуть деньги", status: "closed", date: "03.06.2024", unread: 0 },
  { id: 5, user: "Игорь М.", subject: "Мошенник в переписке", status: "open", date: "05.06.2024", unread: 3 },
];

const USERS = [
  { id: 1, name: "Александр Петров", email: "alex@mail.ru", city: "Москва", ads: 12, balance: 240, status: "active", reg: "12.01.2024" },
  { id: 2, name: "Мария Соколова", email: "maria@gmail.com", city: "СПб", ads: 5, balance: 0, status: "active", reg: "03.03.2024" },
  { id: 3, name: "Дмитрий Волков", email: "dmitry@yandex.ru", city: "Казань", ads: 28, balance: 1200, status: "banned", reg: "15.11.2023" },
  { id: 4, name: "Анна Белова", email: "anna@mail.ru", city: "Уфа", ads: 3, balance: 50, status: "active", reg: "22.04.2024" },
  { id: 5, name: "Игорь Морозов", email: "igor@inbox.ru", city: "Краснодар", ads: 0, balance: 100, status: "active", reg: "01.06.2024" },
];

const MODERATION_ADS = MOCK_ADS.map((ad, i) => ({
  ...ad,
  moderStatus: i % 3 === 0 ? "pending" : i % 3 === 1 ? "approved" : "rejected",
  author: USERS[i % USERS.length].name,
}));

const TRANSACTIONS = [
  { id: 1, user: "Александр П.", type: "topup", amount: 500, date: "05.06.2024 10:30", method: "Карта •4782" },
  { id: 2, user: "Мария С.", type: "spend", amount: -10, date: "05.06.2024 09:15", method: "Объявление #234" },
  { id: 3, user: "Анна К.", type: "topup", amount: 300, date: "04.06.2024 18:00", method: "СБП" },
  { id: 4, user: "Дмитрий В.", type: "spend", amount: -59, date: "04.06.2024 15:22", method: "Премиум #521" },
  { id: 5, user: "Игорь М.", type: "topup", amount: 1000, date: "04.06.2024 12:00", method: "Карта •1234" },
  { id: 6, user: "Александр П.", type: "spend", amount: -10, date: "03.06.2024 20:10", method: "Объявление #230" },
];

const TICKET_MESSAGES: Record<number, SupportMessage[]> = {
  1: [
    { id: 1, text: "Здравствуйте! Моё объявление не прошло модерацию, но я не понимаю почему.", from: "user", time: "10:00" },
    { id: 2, text: "Добрый день! Уточните ID объявления.", from: "admin", time: "10:05" },
    { id: 3, text: "ID: #124. Продаю iPhone, всё честно.", from: "user", time: "10:07" },
  ],
  2: [
    { id: 1, text: "Пополнила баланс, деньги списались, но на счёту не появились!", from: "user", time: "09:30" },
    { id: 2, text: "Здравствуйте! Уже проверяем платёж, займёт до 30 минут.", from: "admin", time: "09:35" },
  ],
  5: [
    { id: 1, text: "Мне написал человек, предлагает сделку вне сайта — это мошенник!", from: "user", time: "08:00" },
  ],
};

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [ticketMessages, setTicketMessages] = useState(TICKET_MESSAGES);
  const [moderFilter, setModerFilter] = useState("pending");
  const [platega, setPlatega] = useState({ key: "", connected: false, testMode: true });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket, ticketMessages]);

  const handleLogin = () => {
    if (login === "admin" && password === "admin123") {
      setIsAuth(true);
    } else {
      setAuthError("Неверный логин или пароль");
    }
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const msg: SupportMessage = {
      id: Date.now(),
      text: replyText,
      from: "admin",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    setTicketMessages(prev => ({
      ...prev,
      [selectedTicket]: [...(prev[selectedTicket] || []), msg],
    }));
    setReplyText("");
  };

  const stats = [
    { label: "Объявлений сегодня", value: "128", delta: "+12%", icon: "FileText", color: "text-brand-orange" },
    { label: "Новых пользователей", value: "34", delta: "+8%", icon: "UserPlus", color: "text-blue-500" },
    { label: "Доход сегодня", value: "12 840 ₽", delta: "+23%", icon: "TrendingUp", color: "text-green-600" },
    { label: "Открытых тикетов", value: "7", delta: "-2", icon: "MessageCircle", color: "text-purple-500" },
    { label: "На модерации", value: "23", delta: "", icon: "Clock", color: "text-yellow-500" },
    { label: "Заблокировано", value: "3", delta: "", icon: "Ban", color: "text-red-500" },
  ];

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
              <Icon name="ShieldCheck" size={30} className="text-white" />
            </div>
            <h1 className="font-heading font-black text-2xl text-white">Панель администратора</h1>
            <p className="text-gray-400 text-sm mt-1">ОбъявиRU · Admin Panel</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Логин</label>
              <input
                value={login}
                onChange={e => { setLogin(e.target.value); setAuthError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white outline-none focus:border-brand-orange text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setAuthError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white outline-none focus:border-brand-orange text-sm"
              />
            </div>
            {authError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <Icon name="AlertCircle" size={14} />
                {authError}
              </div>
            )}
            <button onClick={handleLogin} className="w-full btn-gradient py-3 rounded-xl font-bold">
              Войти
            </button>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4">Демо: admin / admin123</p>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
    { id: "ads", label: "Объявления", icon: "FileText", badge: 23 },
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "support", label: "Поддержка", icon: "MessageCircle", badge: TICKETS.filter(t => t.unread > 0).reduce((a, b) => a + b.unread, 0) },
    { id: "payments", label: "Платежи", icon: "CreditCard" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex text-white">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-gray-900 border-r border-white/10 flex flex-col sticky top-0 h-screen overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <span className="text-white font-black">О</span>
            </div>
            <div>
              <div className="font-heading font-black text-sm gradient-brand-text">ОбъявиRU</div>
              <div className="text-gray-400 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? "gradient-brand text-white shadow-md" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon name={item.icon as "Home"} size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setIsAuth(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Dashboard */}
          {tab === "dashboard" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-heading font-black text-2xl">Дашборд</h1>
                  <p className="text-gray-400 text-sm">5 июня 2024 · Добро пожаловать, Администратор</p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-green-400 text-sm font-medium">Сайт работает</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {stats.map((s, i) => (
                  <div key={i} className="bg-gray-900 rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-400 text-sm">{s.label}</span>
                      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                        <Icon name={s.icon as "Home"} size={16} className={s.color} />
                      </div>
                    </div>
                    <div className="font-heading font-black text-2xl mb-1">{s.value}</div>
                    {s.delta && <div className={`text-xs ${s.delta.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{s.delta} за сутки</div>}
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-gray-900 rounded-2xl border border-white/10 p-5">
                  <h3 className="font-heading font-bold text-base mb-4">Последние объявления</h3>
                  <div className="space-y-3">
                    {MOCK_ADS.slice(0, 5).map(ad => (
                      <div key={ad.id} className="flex items-center gap-3">
                        <img src={ad.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-1">{ad.title}</div>
                          <div className="text-xs text-gray-400">{ad.city} · {ad.date}</div>
                        </div>
                        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Активно</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 rounded-2xl border border-white/10 p-5">
                  <h3 className="font-heading font-bold text-base mb-4">Открытые тикеты</h3>
                  <div className="space-y-3">
                    {TICKETS.filter(t => t.status === "open").map(t => (
                      <div key={t.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-orange/20 flex items-center justify-center shrink-0">
                          <span className="text-brand-orange text-xs font-bold">{t.user[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-1">{t.subject}</div>
                          <div className="text-xs text-gray-400">{t.user} · {t.date}</div>
                        </div>
                        {t.unread > 0 && (
                          <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">{t.unread}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ads moderation */}
          {tab === "ads" && (
            <div className="animate-fade-in">
              <h1 className="font-heading font-black text-2xl mb-6">Объявления и модерация</h1>

              <div className="flex gap-2 mb-5">
                {["pending", "approved", "rejected"].map(s => (
                  <button
                    key={s}
                    onClick={() => setModerFilter(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${moderFilter === s ? "gradient-brand border-transparent" : "border-white/10 text-gray-400 hover:bg-white/5"}`}
                  >
                    {s === "pending" ? "На модерации" : s === "approved" ? "Одобрено" : "Отклонено"}
                    {s === "pending" && <span className="ml-2 text-xs bg-yellow-500 text-black rounded-full px-1.5">23</span>}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {MODERATION_ADS.filter(a => a.moderStatus === moderFilter).map(ad => (
                  <div key={ad.id} className="bg-gray-900 rounded-2xl border border-white/10 p-4 flex gap-4">
                    <img src={ad.image} alt={ad.title} className="w-20 h-20 rounded-xl object-cover shrink-0" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-medium text-sm flex-1">{ad.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${ad.moderStatus === "pending" ? "bg-yellow-500/20 text-yellow-400" : ad.moderStatus === "approved" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                          {ad.moderStatus === "pending" ? "Ожидает" : ad.moderStatus === "approved" ? "Одобрено" : "Отклонено"}
                        </span>
                      </div>
                      <div className="text-brand-orange font-bold text-sm">{ad.price.toLocaleString()} ₽</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{ad.city}</span>
                        <span>Автор: {ad.author}</span>
                        <span>{ad.date}</span>
                      </div>
                    </div>
                    {ad.moderStatus === "pending" && (
                      <div className="flex flex-col gap-2 shrink-0">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium hover:bg-green-500/20 transition-colors">
                          <Icon name="Check" size={14} />
                          Одобрить
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-colors">
                          <Icon name="X" size={14} />
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div className="animate-fade-in">
              <h1 className="font-heading font-black text-2xl mb-6">Пользователи</h1>
              <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["#", "Пользователь", "Email", "Город", "Объявл.", "Баланс", "Дата рег.", "Статус", "Действия"].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium text-xs whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {USERS.map(user => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 text-gray-400">{user.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {user.name[0]}
                              </div>
                              <span className="font-medium whitespace-nowrap">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{user.email}</td>
                          <td className="px-4 py-3 text-gray-400">{user.city}</td>
                          <td className="px-4 py-3">{user.ads}</td>
                          <td className="px-4 py-3 text-brand-orange font-medium">{user.balance} ₽</td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{user.reg}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${user.status === "active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                              {user.status === "active" ? "Активен" : "Заблокирован"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Редактировать">
                                <Icon name="Pencil" size={12} />
                              </button>
                              <button className={`p-1.5 rounded-lg transition-colors ${user.status === "active" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`} title={user.status === "active" ? "Заблокировать" : "Разблокировать"}>
                                <Icon name={user.status === "active" ? "Ban" : "CheckCircle"} size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Support */}
          {tab === "support" && (
            <div className="animate-fade-in">
              <h1 className="font-heading font-black text-2xl mb-6">Тех. поддержка</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Tickets list */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <h3 className="font-heading font-bold text-sm">Обращения ({TICKETS.length})</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                      {TICKETS.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTicket(t.id)}
                          className={`w-full text-left p-4 hover:bg-white/3 transition-colors ${selectedTicket === t.id ? "bg-brand-orange/10 border-l-2 border-l-brand-orange" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-sm font-medium line-clamp-1">{t.subject}</span>
                            {t.unread > 0 && (
                              <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 shrink-0">{t.unread}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{t.user}</span>
                            <span>·</span>
                            <span className={`${t.status === "open" ? "text-green-400" : t.status === "pending" ? "text-yellow-400" : "text-gray-500"}`}>
                              {t.status === "open" ? "Открыт" : t.status === "pending" ? "Ожидает" : "Закрыт"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chat */}
                <div className="lg:col-span-2">
                  {selectedTicket ? (
                    <div className="bg-gray-900 rounded-2xl border border-white/10 flex flex-col h-[500px]">
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm">{TICKETS.find(t => t.id === selectedTicket)?.subject}</div>
                          <div className="text-xs text-gray-400">{TICKETS.find(t => t.id === selectedTicket)?.user} · Тикет #{selectedTicket}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 hover:bg-green-500/20 transition-colors">
                            Закрыть тикет
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {(ticketMessages[selectedTicket] || []).map(msg => (
                          <div key={msg.id} className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${msg.from === "admin" ? "btn-gradient text-white rounded-br-sm" : "bg-white/10 rounded-bl-sm"}`}>
                              <p>{msg.text}</p>
                              <div className={`text-xs mt-1 ${msg.from === "admin" ? "text-white/60" : "text-gray-400"}`}>{msg.time}</div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="p-4 border-t border-white/10 flex gap-3">
                        <input
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && sendReply()}
                          placeholder="Ответить пользователю..."
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-brand-orange"
                        />
                        <button onClick={sendReply} className="btn-gradient w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                          <Icon name="Send" size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-900 rounded-2xl border border-white/10 flex items-center justify-center h-64 text-gray-400">
                      <div className="text-center">
                        <Icon name="MessageCircle" size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Выберите обращение</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payments */}
          {tab === "payments" && (
            <div className="animate-fade-in">
              <h1 className="font-heading font-black text-2xl mb-6">Управление платежами</h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Доход за месяц", value: "248 400 ₽", icon: "TrendingUp", color: "text-green-400" },
                  { label: "Транзакций сегодня", value: "342", icon: "ArrowLeftRight", color: "text-blue-400" },
                  { label: "Средний чек", value: "726 ₽", icon: "Wallet", color: "text-brand-orange" },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-900 rounded-2xl border border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Icon name={s.icon as "Home"} size={18} className={s.color} />
                      </div>
                      <span className="text-gray-400 text-sm">{s.label}</span>
                    </div>
                    <div className="font-heading font-black text-2xl">{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden mb-6">
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-heading font-bold">История транзакций</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["#", "Пользователь", "Тип", "Сумма", "Дата", "Способ"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TRANSACTIONS.map(tx => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 text-gray-500">{tx.id}</td>
                        <td className="px-4 py-3 font-medium">{tx.user}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tx.type === "topup" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {tx.type === "topup" ? "Пополнение" : "Списание"}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-bold ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                          {tx.amount > 0 ? "+" : ""}{tx.amount} ₽
                        </td>
                        <td className="px-4 py-3 text-gray-400">{tx.date}</td>
                        <td className="px-4 py-3 text-gray-400">{tx.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div className="animate-fade-in space-y-6">
              <h1 className="font-heading font-black text-2xl">Настройки платформы</h1>

              {/* Platega integration */}
              <div className="bg-gray-900 rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Icon name="Zap" size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold">Platega.io — Платёжный шлюз</h3>
                    <p className="text-gray-400 text-xs">Подключите Platega для приёма платежей от пользователей</p>
                  </div>
                  <div className={`ml-auto flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${platega.connected ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-gray-700 text-gray-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${platega.connected ? "bg-green-400" : "bg-gray-500"}`}></span>
                    {platega.connected ? "Подключено" : "Не подключено"}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">API-ключ Platega</label>
                    <div className="flex gap-2">
                      <input
                        value={platega.key}
                        onChange={e => setPlatega(prev => ({ ...prev, key: e.target.value }))}
                        type="password"
                        placeholder="platega_live_xxxxxxxxxxxx"
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white outline-none focus:border-brand-orange text-sm font-mono"
                      />
                      <button
                        onClick={() => setPlatega(prev => ({ ...prev, connected: !!prev.key }))}
                        className="px-5 py-3 rounded-xl btn-gradient font-medium text-sm"
                      >
                        {platega.connected ? "Переподключить" : "Подключить"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800">
                    <div className="flex-1">
                      <div className="font-medium text-sm">Тестовый режим</div>
                      <div className="text-xs text-gray-400">Платежи не списываются, только тестирование</div>
                    </div>
                    <button
                      onClick={() => setPlatega(prev => ({ ...prev, testMode: !prev.testMode }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${platega.testMode ? "gradient-brand" : "bg-gray-600"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${platega.testMode ? "translate-x-6" : "translate-x-0.5"}`}></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Platform settings */}
              <div className="bg-gray-900 rounded-2xl border border-white/10 p-6">
                <h3 className="font-heading font-bold mb-5">Параметры платформы</h3>
                <div className="space-y-4">
                  {[
                    { label: "Стоимость объявления (₽)", value: "10", type: "number" },
                    { label: "Срок действия объявления (дней)", value: "30", type: "number" },
                    { label: "Email для уведомлений", value: "admin@obvyaru.ru", type: "email" },
                    { label: "Название сайта", value: "ОбъявиRU", type: "text" },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block text-gray-400 text-sm mb-1.5">{f.label}</label>
                      <input
                        type={f.type}
                        defaultValue={f.value}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white outline-none focus:border-brand-orange text-sm"
                      />
                    </div>
                  ))}
                  <button className="btn-gradient px-6 py-3 rounded-xl font-bold text-sm">
                    Сохранить настройки
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
