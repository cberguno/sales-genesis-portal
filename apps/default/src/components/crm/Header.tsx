import React from 'react';
import { Sun, Moon, RefreshCw, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { CrmView } from './Sidebar';

interface HeaderProps {
  view: CrmView;
  onRefresh: () => void;
  refreshing: boolean;
  activeFolder?: string;
}

const VIEW_LABELS: Record<CrmView, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  deals: 'Deals Pipeline',
  activities: 'Activities',
  agents: 'AI Agents',
};

export function Header({ view, onRefresh, refreshing, activeFolder }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="h-12 border-b border-border/40 flex items-center px-5 gap-4 flex-shrink-0 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <h1 className="text-sm font-semibold text-foreground">{VIEW_LABELS[view]}</h1>
        {view === 'leads' && activeFolder && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-sm font-medium text-primary">{activeFolder}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/60 disabled:opacity-50"
          title="Refresh data"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
        </button>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/60"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
}
