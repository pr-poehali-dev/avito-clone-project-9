import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

interface Message {
  id: number;
  text: string;
  from: "user" | "support";
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Здравствуйте! Я Анна, специалист поддержки ОбъявиRU. Чем могу помочь?", from: "support", time: "10:00" },
];

const FAQ = [
  { q: "Сколько стоит разместить объявление?", a: "Размещение одного объявления стоит 10 рублей. Деньги списываются с вашего баланса в личном кабинете." },
  { q: "Как пополнить баланс?", a: "Пополнить баланс можно в личном кабинете → «Баланс и оплата». Доступна оплата картой (Visa, MasterCard, МИР) и через СБП." },
  { q: "Сколько времени проходит модерация?", a: "Объявления проверяются в течение 2-4 часов в рабочее время. Ночью — до утра следующего дня." },
  { q: "Как удалить объявление?", a: "Зайдите в «Мои объявления» в личном кабинете и нажмите кнопку удаления рядом с нужным объявлением." },
  { q: "Что такое Премиум размещение?", a: "Премиум даёт приоритет в поиске, яркую пометку и повышенный охват. От 59₽/день." },
  { q: "Как вернуть деньги за объявление?", a: "Если объявление не прошло модерацию, средства автоматически возвращаются на баланс в течение 24 часов." },
];

export default function Support() {
  const [activeTicket, setActiveTicket] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketText, setTicketText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: inputText,
      from: "user",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Спасибо за обращение! Я изучу ваш вопрос и отвечу в течение нескольких минут.",
        from: "support",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 1200);
  };

  const tickets = [
    { id: 1, subject: "Объявление не прошло модерацию", status: "open", date: "Сегодня", unread: 1 },
    { id: 2, subject: "Вопрос по пополнению баланса", status: "closed", date: "Вчера", unread: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="Поддержка" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="gradient-brand rounded-3xl p-8 text-center mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Icon name="Headphones" size={28} className="text-white" />
            </div>
            <h1 className="font-heading font-black text-3xl text-white mb-2">Служба поддержки</h1>
            <p className="text-white/80">Ответим на любой вопрос. Среднее время ответа — 5 минут</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: tickets + FAQ */}
          <div className="lg:col-span-1 space-y-5">
            {/* Quick contacts */}
            <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
              <h3 className="font-heading font-bold text-base">Контакты</h3>
              {[
                { icon: "Phone", label: "8-800-100-00-00", sub: "Бесплатно, Пн–Пт 9–21" },
                { icon: "Mail", label: "support@obvyaru.ru", sub: "Ответ в течение 24ч" },
                { icon: "MessageCircle", label: "Чат на сайте", sub: "Онлайн прямо сейчас" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                    <Icon name={c.icon as "Home"} size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{c.label}</div>
                    <div className="text-xs text-muted-foreground">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* My tickets */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-base">Мои обращения</h3>
                <button
                  onClick={() => setShowNewTicket(true)}
                  className="text-brand-orange text-sm font-semibold flex items-center gap-1"
                >
                  <Icon name="Plus" size={14} />
                  Новое
                </button>
              </div>
              <div className="space-y-2">
                {tickets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicket(t.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${activeTicket === t.id ? "border-brand-orange bg-orange-50" : "border-border hover:border-brand-orange/50"}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium line-clamp-1">{t.subject}</span>
                      {t.unread > 0 && (
                        <span className="text-xs bg-brand-orange text-white rounded-full px-1.5 py-0.5 shrink-0 ml-2">{t.unread}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full ${t.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {t.status === "open" ? "Открыт" : "Закрыт"}
                      </span>
                      <span>{t.date}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: chat + FAQ */}
          <div className="lg:col-span-2 space-y-5">
            {/* Chat */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center gap-3 p-4 border-b border-border gradient-brand">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold">А</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Анна — Служба поддержки</div>
                  <div className="flex items-center gap-1 text-white/80 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Онлайн
                  </div>
                </div>
                <div className="text-white/70 text-xs">Тикет #{activeTicket || "Новый"}</div>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.from === "support" && (
                      <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center mr-2 shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">А</span>
                      </div>
                    )}
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${msg.from === "user" ? "btn-gradient rounded-br-sm text-white" : "bg-white border border-border rounded-bl-sm"}`}>
                      <p>{msg.text}</p>
                      <div className={`text-xs mt-1 ${msg.from === "user" ? "text-white/70" : "text-muted-foreground"}`}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="btn-gradient w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                >
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-heading font-bold text-lg mb-4">Часто задаваемые вопросы</h3>
              <div className="space-y-2">
                {FAQ.map((item, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm font-semibold pr-4">{item.q}</span>
                      <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground shrink-0" />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground animate-fade-in border-t border-border pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New ticket modal */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowNewTicket(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-black text-xl">Новое обращение</h3>
              <button onClick={() => setShowNewTicket(false)} className="p-2 rounded-xl hover:bg-muted">
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Тема обращения</label>
                <input
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  placeholder="Опишите проблему кратко"
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Описание</label>
                <textarea
                  value={ticketText}
                  onChange={e => setTicketText(e.target.value)}
                  rows={4}
                  placeholder="Подробно опишите вашу проблему..."
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm resize-none"
                />
              </div>
              <button
                onClick={() => { setShowNewTicket(false); setActiveTicket(3); }}
                className="w-full btn-gradient py-3 rounded-xl font-bold"
              >
                Отправить обращение
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
