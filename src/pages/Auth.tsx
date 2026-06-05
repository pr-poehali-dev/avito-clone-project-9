import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { RUSSIAN_CITIES } from "@/data/cities";

type Mode = "login" | "register";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("Москва");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [identifierType, setIdentifierType] = useState<"phone" | "email">("phone");

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";
    let result = "+7";
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length >= 4) result += ") " + digits.slice(4, 7);
    if (digits.length >= 7) result += "-" + digits.slice(7, 9);
    if (digits.length >= 9) result += "-" + digits.slice(9, 11);
    return result;
  };

  const handleIdentifierChange = (val: string) => {
    setError("");
    if (identifierType === "phone") {
      setIdentifier(formatPhone(val));
    } else {
      setIdentifier(val);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (mode === "register" && password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      const result = mode === "login"
        ? await login(identifier, password)
        : await register({ name, identifier, password, city });

      if (result.ok) {
        navigate("/cabinet");
      } else {
        setError(result.error || "Ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 gradient-brand relative overflow-hidden items-center justify-center p-12">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 text-white text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6 text-5xl font-black">
            Л
          </div>
          <h1 className="font-heading font-black text-5xl mb-4">Лавка</h1>
          <p className="text-white/80 text-xl leading-relaxed max-w-xs">
            Лучшая доска объявлений России. Продавай и покупай легко.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { icon: "Shield", text: "Безопасные сделки" },
              { icon: "Zap", text: "Быстрая публикация" },
              { icon: "MapPin", text: "500+ городов" },
              { icon: "Star", text: "Премиум размещение" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <Icon name={f.icon as "Home"} size={18} className="text-white shrink-0" />
                <span className="text-sm text-white/90 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <span className="text-white font-black text-lg">Л</span>
            </div>
            <span className="font-heading font-black text-xl gradient-brand-text">Лавка</span>
          </Link>

          <div className="mb-6">
            <h2 className="font-heading font-black text-3xl mb-1">
              {mode === "login" ? "Добро пожаловать!" : "Создать аккаунт"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === "login"
                ? "Войдите, чтобы управлять объявлениями"
                : "Зарегистрируйтесь и получите 100 ₽ на баланс"}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Войти
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "register" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Регистрация
            </button>
          </div>

          <div className="space-y-4">
            {/* Name field (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-semibold mb-1.5">Ваше имя</label>
                <input
                  value={name}
                  onChange={e => { setName(e.target.value); setError(""); }}
                  placeholder="Александр"
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm transition-colors"
                />
              </div>
            )}

            {/* Identifier type switch */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold">
                  {identifierType === "phone" ? "Номер телефона" : "Email"}
                </label>
                <button
                  onClick={() => { setIdentifierType(t => t === "phone" ? "email" : "phone"); setIdentifier(""); }}
                  className="text-xs text-brand-orange font-medium hover:underline flex items-center gap-1"
                >
                  <Icon name="ArrowLeftRight" size={12} />
                  {identifierType === "phone" ? "Войти через email" : "Войти по телефону"}
                </button>
              </div>
              <div className="relative">
                <Icon
                  name={identifierType === "phone" ? "Phone" : "Mail"}
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type={identifierType === "email" ? "email" : "tel"}
                  value={identifier}
                  onChange={e => handleIdentifierChange(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder={identifierType === "phone" ? "+7 (___) ___-__-__" : "example@mail.ru"}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="Минимум 6 символов"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>

            {/* Confirm password (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-semibold mb-1.5">Повторите пароль</label>
                <div className="relative">
                  <Icon name="Lock" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    placeholder="Повторите пароль"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm transition-colors"
                  />
                </div>
              </div>
            )}

            {/* City (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-semibold mb-1.5">Ваш город</label>
                <div className="relative">
                  <Icon name="MapPin" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border outline-none focus:border-brand-orange text-sm bg-white transition-colors appearance-none"
                  >
                    {RUSSIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Forgot password (login only) */}
            {mode === "login" && (
              <div className="text-right">
                <button className="text-xs text-brand-orange hover:underline">Забыли пароль?</button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fade-in">
                <Icon name="AlertCircle" size={15} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full btn-gradient py-3.5 rounded-xl font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Icon name="Loader2" size={18} className="animate-spin" />
              ) : (
                <Icon name={mode === "login" ? "LogIn" : "UserPlus"} size={18} />
              )}
              {mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>

            {/* Register bonus hint */}
            {mode === "register" && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs">
                <Icon name="Gift" size={14} className="shrink-0 text-green-500" />
                При регистрации вы получите <strong>100 ₽</strong> на баланс в подарок!
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Продолжая, вы соглашаетесь с{" "}
            <Link to="/terms" className="text-brand-orange hover:underline">условиями использования</Link>
            {" "}и{" "}
            <Link to="/privacy" className="text-brand-orange hover:underline">политикой конфиденциальности</Link>
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors">
              <Icon name="ArrowLeft" size={14} />
              На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
