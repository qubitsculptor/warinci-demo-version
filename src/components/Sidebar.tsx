import React from 'react';
import { 
  Home, 
  Zap, 
  Sprout, 
  Settings,
  User,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  agricultureBadgeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab,
  agricultureBadgeCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'solar', icon: Zap, label: 'Solar' },
    { id: 'agriculture', icon: Sprout, label: 'Agriculture', badge: agricultureBadgeCount, isAlert: true },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside 
      id="dashboard-sidebar"
      className="relative w-[88px] sm:w-[96px] flex flex-col items-center justify-between py-4 px-2 shrink-0 select-none bg-[#e8e6e1] z-30 overflow-visible"
    >
      <button
        id="farm-brand-logo-btn"
        onClick={() => onSelectTab('dashboard')}
        aria-label="Warinci home"
        className="w-full px-1 py-1.5 text-center text-[15px] sm:text-base font-semibold text-[#1c1917] hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer leading-tight tracking-tight"
        style={{ fontWeight: 600 }}
      >
        Warinci
      </button>

      <div className="relative w-full max-w-[72px] bg-[#dcdad4]/80 backdrop-blur-xs rounded-[28px] py-3 px-1.5 flex flex-col items-center gap-2 border border-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.04)] overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              aria-label={item.label}
              className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c1917] text-white shadow-md'
                  : 'text-[#797166] hover:text-[#1c1917] hover:bg-black/5'
              }`}
            >
              <Icon className="w-5 h-5" fill="currentColor" strokeWidth={1.25} />
              {Boolean(item.badge && item.badge > 0 && !isActive) && (
                <span className={`absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full type-caption flex items-center justify-center pill-on-dark z-10 ${
                  item.isAlert ? 'bg-[#f04438]' : 'bg-[#1c1917]'
                }`}>
                  {item.badge}
                </span>
              )}
              <span
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-[#1c1917] type-caption pill-on-dark whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shadow-lg z-50"
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="group relative w-10 h-10 rounded-full flex items-center justify-center text-[#797166] hover:text-[#1c1917] transition-colors cursor-pointer">
        <User className="w-5 h-5" fill="currentColor" strokeWidth={1.25} />
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-[#1c1917] type-caption pill-on-dark whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shadow-lg z-50">
          Profile
        </span>
      </div>
    </aside>
  );
};
