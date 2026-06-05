import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                <span className="text-white font-black text-lg">Л</span>
              </div>
              <span className="font-heading font-black text-xl gradient-brand-text">Лавка</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Лучшая платформа для подачи объявлений в России. Миллионы предложений в каждом городе.
            </p>
            <div className="flex items-center gap-3">
              {["Instagram", "Youtube", "Twitter"].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Icon name="Share2" size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 text-white">Разделы</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: "Главная", to: "/" },
                { label: "Каталог", to: "/catalog" },
                { label: "Мой кабинет", to: "/cabinet" },
                { label: "Подать объявление", to: "/post-ad" },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-brand-orange transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-4 text-white">Помощь</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: "Поддержка", to: "/support" },
                { label: "О платформе", to: "/about" },
                { label: "Контакты", to: "/contacts" },
                { label: "Правила", to: "/rules" },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-brand-orange transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-4 text-white">Контакты</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={14} className="text-brand-orange shrink-0" />
                <span>support@lavka.ru</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Phone" size={14} className="text-brand-orange shrink-0" />
                <span>8-800-100-00-00 (бесплатно)</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Clock" size={14} className="text-brand-orange shrink-0" />
                <span>Пн–Пт 9:00–21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© 2024 Лавка. Все права защищены.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Политика конфиденциальности</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}