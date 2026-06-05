import Icon from "@/components/ui/icon";
import { AdminTab } from "@/pages/Admin";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: string;
  badge?: number;
}

interface AdminSidebarProps {
  tab: AdminTab;
  navItems: NavItem[];
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ tab, navItems, onTabChange, onLogout }: AdminSidebarProps) {
  return (
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
            onClick={() => onTabChange(item.id)}
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
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </div>
    </aside>
  );
}
