import React, { useMemo } from 'react';
import { Deal, DEAL_STAGES, STAGE_COLORS, STAGE_BG } from '@/types/crm';
import { cn } from '@/lib/utils';
import { DollarSign, User } from 'lucide-react';

interface DealsViewProps {
  deals: Deal[];
  loading: boolean;
}

function DealCard({ deal }: { deal: Deal }) {
  const prob = deal.probability;
  const probColor = prob >= 70 ? 'text-emerald-400' : prob >= 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-border/80 transition-all group">
      <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {deal.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-1">{deal.company}</p>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">{deal.value.toLocaleString()}</span>
          </div>
          <span className={cn('text-xs font-medium', probColor)}>{deal.probability}% prob.</span>
        </div>

        {/* Probability bar */}
        <div className="w-full bg-muted/50 rounded-full h-1">
          <div
            className={cn('h-1 rounded-full transition-all', prob >= 70 ? 'bg-emerald-500' : prob >= 40 ? 'bg-amber-500' : 'bg-red-500')}
            style={{ width: `${Math.min(prob, 100)}%` }}
          />
        </div>
      </div>

      {deal.contact && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          {deal.contact}
        </div>
      )}

      {deal.owner && (
        <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Owner</span>
          <span className="text-xs font-medium text-foreground">{deal.owner}</span>
        </div>
      )}
    </div>
  );
}

function StageColumn({ stage, deals, loading }: { stage: string; deals: Deal[]; loading: boolean }) {
  const totalValue = deals.reduce((a, d) => a + d.value, 0);
  const color = STAGE_COLORS[stage] || '#6b7280';
  const badgeClass = STAGE_BG[stage] || 'bg-gray-500/15 text-gray-400';

  return (
    <div className="flex flex-col w-64 flex-shrink-0">
      {/* Column header */}
      <div className="mb-3 px-1">
        <div className="flex items-center justify-between mb-1">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', badgeClass)}>
            {stage}
          </span>
          <span className="text-xs font-bold text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded-full">
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="text-xs text-muted-foreground px-1">${totalValue.toLocaleString()}</p>
        )}
        {/* Stage color bar */}
        <div className="h-0.5 rounded-full mt-2 w-full" style={{ backgroundColor: color, opacity: 0.4 }} />
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 min-h-[60px]">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="h-28 bg-muted/30 rounded-xl animate-pulse" />
          ))
        ) : deals.length === 0 ? (
          <div className="h-16 border-2 border-dashed border-border/30 rounded-xl flex items-center justify-center">
            <p className="text-xs text-muted-foreground/50">No deals</p>
          </div>
        ) : (
          deals.map(deal => <DealCard key={deal.id} deal={deal} />)
        )}
      </div>
    </div>
  );
}

export function DealsView({ deals, loading }: DealsViewProps) {
  const dealsByStage = useMemo(() => {
    const map: Record<string, Deal[]> = {};
    DEAL_STAGES.forEach(s => { map[s] = []; });
    deals.forEach(d => { if (map[d.stage]) map[d.stage].push(d); });
    return map;
  }, [deals]);

  const totalPipeline = useMemo(() => deals.reduce((a, d) => a + d.value, 0), [deals]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/40 flex items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Deals Pipeline</h2>
          <p className="text-xs text-muted-foreground">{deals.length} deals · ${totalPipeline.toLocaleString()} total</p>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-5 p-6 h-full min-h-0" style={{ minWidth: `${DEAL_STAGES.length * 280 + 100}px` }}>
          {DEAL_STAGES.map(stage => (
            <StageColumn
              key={stage}
              stage={stage}
              deals={dealsByStage[stage] || []}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
