import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="О платформе" />

      {/* Hero */}
      <section className="gradient-brand py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-white text-sm mb-6 border border-white/20">
            <Icon name="Award" size={14} />
            Основана в 2021 году
          </div>
          <h1 className="font-heading font-black text-5xl text-white mb-6">О платформе ОбъявиRU</h1>
          <p className="text-white/85 text-xl leading-relaxed">
            Мы создали самую удобную и безопасную доску объявлений России. Помогаем миллионам людей продавать, покупать и находить нужное — быстро и без лишних хлопот.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "2.4 млн", label: "Активных объявлений" },
              { value: "850K", label: "Зарегистрированных пользователей" },
              { value: "500+", label: "Городов России" },
              { value: "12K+", label: "Успешных сделок в день" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-heading font-black text-3xl gradient-brand-text mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading font-black text-3xl mb-4">Наша миссия</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ОбъявиRU — это не просто доска объявлений. Это экосистема для безопасной торговли между людьми по всей России. Мы верим, что каждая вещь должна найти своего покупателя.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Наша платформа создана для людей: простой интерфейс, честные цены, надёжная поддержка. Публикация объявления стоит всего 10 рублей — это делает нас доступными для каждого.
            </p>
            <Link to="/post-ad" className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
              <Icon name="Plus" size={16} />
              Начать продавать
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "Shield", title: "Безопасность", desc: "Верификация пользователей и модерация объявлений" },
              { icon: "Zap", title: "Скорость", desc: "Объявление выходит в эфир в течение 4 часов" },
              { icon: "HeartHandshake", title: "Честность", desc: "Прозрачные условия без скрытых комиссий" },
              { icon: "Users", title: "Сообщество", desc: "Миллионы продавцов и покупателей по всей стране" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5 card-hover">
                <div className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center mb-3">
                  <Icon name={item.icon as "Home"} size={20} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-heading font-black text-3xl text-center mb-3">Честные тарифы</h2>
          <p className="text-muted-foreground text-center mb-10">Платите только за то, что нужно</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Стандарт",
                price: "10 ₽",
                period: "за объявление",
                features: ["Размещение объявления", "До 10 фото", "Действует 30 дней", "Базовая статистика"],
                popular: false,
              },
              {
                name: "Премиум",
                price: "59 ₽",
                period: "в день",
                features: ["Приоритет в поиске", "Пометка PREMIUM", "Расширенная статистика", "Поднятие каждые 24ч"],
                popular: true,
              },
              {
                name: "Золотое",
                price: "149 ₽",
                period: "в день",
                features: ["Топ выдачи", "Рассылка подписчикам", "Персональный менеджер", "Безлимит фото"],
                popular: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl border p-6 relative card-hover ${plan.popular ? "border-brand-orange shadow-lg shadow-orange-50" : "border-border"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-premium">Популярный</div>
                )}
                <h3 className="font-heading font-bold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-heading font-black text-3xl gradient-brand-text">{plan.price}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-5">{plan.period}</div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={14} className="text-brand-orange shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/cabinet" className={`block text-center py-3 rounded-xl font-bold text-sm transition-colors ${plan.popular ? "btn-gradient" : "border border-border hover:border-brand-orange hover:text-brand-orange"}`}>
                  Выбрать
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-heading font-black text-3xl text-center mb-10">Команда</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { name: "Алексей Иванов", role: "CEO & Founder", emoji: "👨‍💼" },
            { name: "Мария Соколова", role: "CTO", emoji: "👩‍💻" },
            { name: "Дмитрий Волков", role: "Head of Design", emoji: "🎨" },
            { name: "Анна Белова", role: "Head of Support", emoji: "💬" },
          ].map((member, i) => (
            <div key={i} className="text-center">
              <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-3 text-4xl">
                {member.emoji}
              </div>
              <h3 className="font-heading font-bold text-sm">{member.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
