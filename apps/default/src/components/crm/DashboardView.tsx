import React, { useMemo } from 'react';
import { Lead, Deal, Activity, DEAL_STAGES, STAGE_COLORS } from '@/types/crm';
import { ScoreBadge } from './ScoreBadge';
import { StageBadge } from './StageBadge';
import { DollarSign, Users, Briefcase, TrendingUp, Activity as ActivityIcon, Target } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

interface DashboardViewProps {
  leads: Lead[];
  deals: Deal[];
  activities: Activity[];
  loading: boolean;
}

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 flex items-start gap-4">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function DashboardView({ leads, deals, activities, loading }: DashboardViewProps) {
  const totalPipeline = useMemo(() => deals.reduce((a, d) => a + d.value, 0), [deals]);
  const avgScore = useMemo(() => leads.length ? Math.round(leads.reduce((a, l) => a + l.score, 0) / leads.length) : 0, [leads]);
  const wonDeals = useMemo(() => deals.filter(d => d.stage === 'Won'), [deals]);
  const wonValue = useMemo(() => wonDeals.reduce((a, d) => a + d.value, 0), [wonDeals]);

  const pipelineByStage = useMemo(() => {
    return DEAL_STAGES.map(stage => ({
      stage: stage === 'Proposal Sent' ? 'Proposal' : stage,
      value: deals.filter(d => d.stage === stage).reduce((a, d) => a + d.value, 0),
      count: deals.filter(d => d.stage === stage).length,
      color: STAGE_COLORS[stage],
    })).filter(s => s.value > 0);
  }, [deals]);

  const topLeads = useMemo(() => [...leads].sort((a, b) => b.score - a.score).slice(0, 5), [leads]);
  const recentActivities = useMemo(() => [...activities].slice(0, 5), [activities]);

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-muted/40 rounded-xl" />
        ))}
      </div>
    );
  }

  const hasActiveLeadCount = leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost').length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Pipeline Overview</h1>
        <p className="text-sm text-muted-foreground">Your sales performance at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Total Pipeline"
          value={`$${(totalPipeline / 1000).toFixed(0)}K`}
          sub={`${deals.length} open deals`}
          icon={DollarSign}
          color="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          label="Active Leads"
          value={String(hasActiveLeadCount)}
          sub={`${leads.length} total leads`}
          icon={Users}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="Avg. Lead Score"
          value={String(avgScore)}
          sub="out of 100"
          icon={Target}
          color="bg-amber-500/10 text-amber-400"
        />
        <StatCard
          label="Deals Won"
          value={String(wonDeals.length)}
          sub={wonValue > 0 ? `$${(wonValue / 1000).toFixed(0)}K closed` : 'No won deals yet'}
          icon={TrendingUp}
          color="bg-purple-500/10 text-purple-400"
        />
        <StatCard
          label="Activities"
          value={String(activities.length)}
          sub="all interactions"
          icon={ActivityIcon}
          color="bg-orange-500/10 text-orange-400"
        />
        <StatCard
          label="Open Deals"
          value={String(deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length)}
          sub="active pipeline"
          icon={Briefcase}
          color="bg-sky-500/10 text-sky-400"
        />
      </div>

      {/* Charts + lists row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pipeline chart */}
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Pipeline by Stage</h2>
          {pipelineByStage.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pipelineByStage} barSize={28}>
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Value']}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--accent)/0.4)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pipelineByStage.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No pipeline data</div>
          )}
        </div>

        {/* Top Leads */}
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Top Leads by Score</h2>
          <div className="space-y-3">
            {topLeads.length > 0 ? topLeads.map((lead, i) => (
              <div key={lead.id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                </div>
                <StageBadge stage={lead.stage} />
                <ScoreBadge score={lead.score} size="sm" />
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No leads yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card border border-border/50 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Recent Activities</h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-2">
            {recentActivities.map(a => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">{a.title}</p>
                  {a.summary && <p className="text-xs text-muted-foreground truncate">{a.summary}</p>}
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full flex-shrink-0',
                  a.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  a.status === 'Overdue' ? 'bg-red-500/10 text-red-400' :
                  'bg-amber-500/10 text-amber-400'
                )}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No activities logged yet</p>
        )}
      </div>
    </div>
  );
}
