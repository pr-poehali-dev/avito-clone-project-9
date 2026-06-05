import { useState } from "react";
import { MOCK_ADS } from "@/data/cities";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTabs from "@/components/admin/AdminTabs";

export type AdminTab = "dashboard" | "ads" | "users" | "support" | "payments" | "settings";

export interface SupportMessage {
  id: number;
  text: string;
  from: "user" | "admin";
  time: string;
}

export const TICKETS = [
  { id: 1, user: "Александр П.", subject: "Объявление не прошло модерацию", status: "open", date: "05.06.2024", unread: 1 },
  { id: 2, user: "Мария С.", subject: "Вопрос по пополнению баланса", status: "open", date: "05.06.2024", unread: 2 },
  { id: 3, user: "Дмитрий В.", subject: "Не могу войти в аккаунт", status: "pending", date: "04.06.2024", unread: 0 },
  { id: 4, user: "Анна К.", subject: "Хочу вернуть деньги", status: "closed", date: "03.06.2024", unread: 0 },
  { id: 5, user: "Игорь М.", subject: "Мошенник в переписке", status: "open", date: "05.06.2024", unread: 3 },
];

export const USERS = [
  { id: 1, name: "Александр Петров", email: "alex@mail.ru", city: "Москва", ads: 12, balance: 240, status: "active", reg: "12.01.2024" },
  { id: 2, name: "Мария Соколова", email: "maria@gmail.com", city: "СПб", ads: 5, balance: 0, status: "active", reg: "03.03.2024" },
  { id: 3, name: "Дмитрий Волков", email: "dmitry@yandex.ru", city: "Казань", ads: 28, balance: 1200, status: "banned", reg: "15.11.2023" },
  { id: 4, name: "Анна Белова", email: "anna@mail.ru", city: "Уфа", ads: 3, balance: 50, status: "active", reg: "22.04.2024" },
  { id: 5, name: "Игорь Морозов", email: "igor@inbox.ru", city: "Краснодар", ads: 0, balance: 100, status: "active", reg: "01.06.2024" },
];

export const MODERATION_ADS = MOCK_ADS.map((ad, i) => ({
  ...ad,
  moderStatus: i % 3 === 0 ? "pending" : i % 3 === 1 ? "approved" : "rejected",
  author: USERS[i % USERS.length].name,
}));

export const TRANSACTIONS = [
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

  const navItems: { id: AdminTab; label: string; icon: string; badge?: number }[] = [
    { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
    { id: "ads", label: "Объявления", icon: "FileText", badge: 23 },
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "support", label: "Поддержка", icon: "MessageCircle", badge: TICKETS.filter(t => t.unread > 0).reduce((a, b) => a + b.unread, 0) },
    { id: "payments", label: "Платежи", icon: "CreditCard" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ];

  if (!isAuth) {
    return (
      <AdminLogin
        login={login}
        password={password}
        authError={authError}
        onLoginChange={v => { setLogin(v); setAuthError(""); }}
        onPasswordChange={v => { setPassword(v); setAuthError(""); }}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex text-white">
      <AdminSidebar
        tab={tab}
        navItems={navItems}
        onTabChange={setTab}
        onLogout={() => setIsAuth(false)}
      />
      <AdminTabs
        tab={tab}
        selectedTicket={selectedTicket}
        replyText={replyText}
        ticketMessages={ticketMessages}
        moderFilter={moderFilter}
        platega={platega}
        stats={stats}
        onSelectTicket={setSelectedTicket}
        onReplyTextChange={setReplyText}
        onSendReply={sendReply}
        onModerFilterChange={setModerFilter}
        onPlatégaChange={setPlatega}
      />
    </div>
  );
}
