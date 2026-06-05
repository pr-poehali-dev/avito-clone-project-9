import Icon from "@/components/ui/icon";

interface AdminLoginProps {
  login: string;
  password: string;
  authError: string;
  onLoginChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
}

export default function AdminLogin({
  login,
  password,
  authError,
  onLoginChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md border border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
            <Icon name="ShieldCheck" size={30} className="text-white" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white">Панель администратора</h1>
          <p className="text-gray-400 text-sm mt-1">Лавка · Admin Panel</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Логин</label>
            <input
              value={login}
              onChange={e => onLoginChange(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSubmit()}
              placeholder="admin"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white outline-none focus:border-brand-orange text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => onPasswordChange(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSubmit()}
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
          <button onClick={onSubmit} className="w-full btn-gradient py-3 rounded-xl font-bold">
            Войти
          </button>
        </div>
        <p className="text-gray-500 text-xs text-center mt-4">Демо: admin / admin123</p>
      </div>
    </div>
  );
}