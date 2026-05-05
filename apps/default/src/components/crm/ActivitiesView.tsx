import React, { useState, useMemo } from 'react';
import { Activity, ACTIVITY_TYPE_COLORS } from '@/types/crm';
import { cn } from '@/lib/utils';
import { Search, Mail, Phone, Video, FileText, MessageCircle, CheckSquare, Linkedin } from 'lucide-react';

interface ActivitiesViewProps {
  activities: Activity[];
  loading: boolean;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  'Email': Mail,
  'Call': Phone,
  'Meeting': Video,
  'Demo': Video,
  'Note': FileText,
  'Task': CheckSquare,
  'LinkedIn': Linkedin,
};

function ActivityRow({ activity }: { activity: Activity }) {
  const Icon = TYPE_ICONS[activity.type] || FileText;
  const typeColor = ACTIVITY_TYPE_COLORS[activity.type] || 'bg-gray-500/15 text-gray-400';
  const statusColor =
    activity.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
    activity.status === 'Overdue' ? 'bg-red-500/10 text-red-400' :
    'bg-amber-500/10 text-amber-400';

  return (
    <tr className="hover:bg-accent/20 transition-colors">
      <td className="px-4 py-3">
        <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', typeColor)}>
          <Icon className="w-3 h-3" />
          {activity.type}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-foreground">{activity.title}</p>
        {activity.summary && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{activity.summary}</p>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-foreground">{activity.contact || '—'}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{activity.company || '—'}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{activity.owner || '—'}</td>
      <td className="px-4 py-3">
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColor)}>
          {activity.status}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px]">
        {activity.nextAction ? (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            <span className="truncate">{activity.nextAction}</span>
          </span>
        ) : '—'}
      </td>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[80, 200, 100, 100, 80, 80, 150].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted/40 rounded animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export function ActivitiesView({ activities, loading }: ActivitiesViewProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => {
    let result = [...activities];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.contact.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q)
      );
    }
    if (typeFilter) result = result.filter(a => a.type === typeFilter);
    if (statusFilter) result = result.filter(a => a.status === statusFilter);
    return result;
  }, [activities, search, typeFilter, statusFilter]);

  const types = useMemo(() => Array.from(new Set(activities.map(a => a.type))), [activities]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-border/40 flex items-center gap-3 flex-shrink-0 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search activities…"
            className="pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground w-56"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-sm bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} activit{filtered.length !== 1 ? 'ies' : 'y'}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="sticky top-0 bg-card/90 backdrop-blur-sm border-b border-border/40 z-10">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Activity</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Company</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Owner</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
                  {search || typeFilter || statusFilter ? 'No activities match your filters.' : 'No activities logged yet.'}
                </td>
              </tr>
            ) : (
              filtered.map(a => <ActivityRow key={a.id} activity={a} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
