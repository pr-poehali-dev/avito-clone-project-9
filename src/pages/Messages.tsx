import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Icon from "@/components/ui/icon";
import { MOCK_ADS } from "@/data/cities";

interface Message {
  id: number;
  text: string;
  from: "me" | "other";
  time: string;
  read: boolean;
}

interface Chat {
  id: string;
  adId: number;
  sellerName: string;
  sellerInitial: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

const INITIAL_CHATS: Chat[] = [
  {
    id: "seller_2",
    adId: 2,
    sellerName: "Михаил К.",
    sellerInitial: "М",
    lastMessage: "Да, машина в хорошем состоянии",
    lastTime: "10:42",
    unread: 1,
    messages: [
      { id: 1, text: "Здравствуйте! Скажите, машина ещё в продаже?", from: "me", time: "10:30", read: true },
      { id: 2, text: "Да, ещё продаётся. Пробег 45 000 км, всё родное.", from: "other", time: "10:35", read: true },
      { id: 3, text: "Возможен торг?", from: "me", time: "10:40", read: true },
      { id: 4, text: "Да, машина в хорошем состоянии", from: "other", time: "10:42", read: false },
    ],
  },
  {
    id: "seller_4",
    adId: 4,
    sellerName: "Дарья С.",
    sellerInitial: "Д",
    lastMessage: "Покажу в удобное для вас время",
    lastTime: "Вчера",
    unread: 0,
    messages: [
      { id: 1, text: "Добрый день! Интересует MacBook, всё работает?", from: "me", time: "14:00", read: true },
      { id: 2, text: "Здравствуйте! Да, всё в порядке, аккумулятор 89%.", from: "other", time: "14:10", read: true },
      { id: 3, text: "Можно посмотреть сегодня?", from: "me", time: "14:15", read: true },
      { id: 4, text: "Покажу в удобное для вас время", from: "other", time: "14:20", read: true },
    ],
  },
  {
    id: "seller_1",
    adId: 1,
    sellerName: "Алексей Т.",
    sellerInitial: "А",
    lastMessage: "Отличный выбор, сейчас уточню наличие",
    lastTime: "Пн",
    unread: 0,
    messages: [
      { id: 1, text: "Привет! iPhone ещё актуален?", from: "me", time: "11:00", read: true },
      { id: 2, text: "Да, в наличии. Natural Titanium, как на фото.", from: "other", time: "11:05", read: true },
      { id: 3, text: "Хочу взять, давайте встретимся?", from: "me", time: "11:20", read: true },
      { id: 4, text: "Отличный выбор, сейчас уточню наличие", from: "other", time: "11:25", read: true },
    ],
  },
];

export default function Messages() {
  const [searchParams] = useSearchParams();
  const incomingAdId = Number(searchParams.get("ad"));
  const incomingSeller = searchParams.get("seller") || "";

  const [chats, setChats] = useState<Chat[]>(() => {
    if (incomingAdId && incomingSeller && !INITIAL_CHATS.find(c => c.id === incomingSeller)) {
      const ad = MOCK_ADS.find(a => a.id === incomingAdId);
      if (ad) {
        const newChat: Chat = {
          id: incomingSeller,
          adId: incomingAdId,
          sellerName: "Продавец",
          sellerInitial: "П",
          lastMessage: "",
          lastTime: "Сейчас",
          unread: 0,
          messages: [
            {
              id: 1,
              text: `Здравствуйте! Интересует ваше объявление «${ad.title}». Актуально?`,
              from: "me",
              time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
              read: false,
            },
          ],
        };
        return [newChat, ...INITIAL_CHATS];
      }
    }
    return INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(
    incomingSeller || INITIAL_CHATS[0]?.id || null
  );
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeAd = activeChat ? MOCK_ADS.find(a => a.id === activeChat.adId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, chats]);

  useEffect(() => {
    if (activeChatId) {
      setChats(prev => prev.map(c =>
        c.id === activeChatId
          ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) }
          : c
      ));
    }
  }, [activeChatId]);

  const sendMessage = () => {
    if (!inputText.trim() || !activeChatId) return;
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = { id: Date.now(), text: inputText, from: "me", time: now, read: false };

    setChats(prev => prev.map(c =>
      c.id === activeChatId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: inputText, lastTime: now }
        : c
    ));
    setInputText("");

    // Auto-reply after 1.5s
    setTimeout(() => {
      const replies = [
        "Хорошо, понял вас!",
        "Да, это возможно.",
        "Давайте договоримся о встрече.",
        "Спасибо за интерес! Напишите удобное время.",
        "Цена окончательная, торга нет.",
        "Могу отправить ещё фото.",
      ];
      const reply: Message = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        from: "other",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      setChats(prev => prev.map(c =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text, lastTime: reply.time }
          : c
      ));
    }, 1500);
  };

  const filteredChats = chats.filter(c =>
    c.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (MOCK_ADS.find(a => a.id === c.adId)?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="flex items-center gap-3 mb-5">
          <h1 className="font-heading font-black text-2xl">Сообщения</h1>
          {totalUnread > 0 && (
            <span className="badge-premium text-xs px-2 py-0.5 rounded-full bg-brand-orange text-white font-bold">{totalUnread}</span>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden flex" style={{ height: "calc(100vh - 220px)", minHeight: 480 }}>
          {/* Chat list */}
          <aside className="w-72 shrink-0 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск переписок..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-muted text-sm outline-none focus:ring-1 focus:ring-brand-orange/30"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Переписок не найдено</div>
              ) : (
                filteredChats.map(chat => {
                  const ad = MOCK_ADS.find(a => a.id === chat.adId);
                  return (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0 ${activeChatId === chat.id ? "bg-orange-50 border-l-2 border-l-brand-orange" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center">
                            <span className="text-white font-bold text-base">{chat.sellerInitial}</span>
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-semibold truncate">{chat.sellerName}</span>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">{chat.lastTime}</span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate mb-1">{ad?.title}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground truncate flex-1">{chat.lastMessage}</span>
                            {chat.unread > 0 && (
                              <span className="ml-2 min-w-[18px] h-[18px] rounded-full bg-brand-orange text-white text-xs flex items-center justify-center px-1 shrink-0">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Chat window */}
          {activeChat ? (
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-white">
                <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">{activeChat.sellerInitial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{activeChat.sellerName}</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Онлайн
                  </div>
                </div>
                {activeAd && (
                  <Link
                    to={`/ad/${activeAd.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:border-brand-orange transition-colors shrink-0"
                  >
                    <img
                      src={activeAd.image}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-semibold text-brand-orange">
                        {new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(activeAd.price)}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-[120px]">{activeAd.title}</div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
                {/* Date divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-xs text-muted-foreground px-2">Сегодня</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                {activeChat.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} animate-fade-in`}>
                    {msg.from === "other" && (
                      <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center mr-2 shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{activeChat.sellerInitial}</span>
                      </div>
                    )}
                    <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.from === "me" ? "btn-gradient text-white rounded-br-sm" : "bg-white border border-border rounded-bl-sm text-foreground"}`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1 justify-end mt-1 ${msg.from === "me" ? "text-white/60" : "text-muted-foreground"} text-xs`}>
                        <span>{msg.time}</span>
                        {msg.from === "me" && (
                          <Icon name={msg.read ? "CheckCheck" : "Check"} size={11} className={msg.read ? "text-white/80" : "text-white/50"} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              <div className="px-4 pt-3 flex gap-2 overflow-x-auto bg-white border-t border-border pb-2">
                {["Актуально?", "Торг возможен?", "Можно посмотреть?", "Когда удобно встретиться?"].map(q => (
                  <button
                    key={q}
                    onClick={() => setInputText(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-brand-orange/30 text-brand-orange bg-orange-50 hover:bg-orange-100 transition-colors whitespace-nowrap shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-3 p-4 bg-white">
                <button className="p-2.5 rounded-xl border border-border hover:border-brand-orange transition-colors shrink-0">
                  <Icon name="Paperclip" size={16} className="text-muted-foreground" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Написать сообщение..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border outline-none focus:border-brand-orange text-sm transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className="btn-gradient w-11 h-11 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
                >
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" size={36} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">Ваши сообщения</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Выберите переписку слева или напишите продавцу со страницы объявления
                </p>
                <Link to="/catalog" className="mt-4 inline-flex items-center gap-2 btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold">
                  <Icon name="Search" size={15} />
                  Найти объявления
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
