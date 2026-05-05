import React, { useState, useMemo } from 'react';
import { Lead } from '@/types/crm';
import { ScoreBadge } from './ScoreBadge';
import { StageBadge } from './StageBadge';
import {
  Search, Mail, Phone, Linkedin, Globe, Facebook, Instagram, Twitter,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { LeadsFolder } from './Sidebar';

interface LeadsViewProps {
  leads: Lead[];
  loading: boolean;
  activeFolder?: LeadsFolder | null;
}

type ColId =
  | 'name' | 'company' | 'industry' | 'website' | 'email' | 'phone'
  | 'linkedin' | 'facebook' | 'instagram' | 'twitter'
  | 'source' | 'stage' | 'score' | 'owner' | 'nextStep' | 'lastTouch'
  | 'businessIntelligence' | 'interactionHistory'
  | 'subjectLine' | 'subjectScore' | 'emailBody' | 'emailScore'
  | 'replyRate' | 'notes';

interface ColDef { id: ColId; label: string; width: number; sortable?: boolean; }

const COLUMNS: ColDef[] = [
  { id: 'name',                 label: 'Name',                 width: 160, sortable: true },
  { id: 'company',              label: 'Company',              width: 150 },
  { id: 'industry',             label: 'Industry / Sector',    width: 170 },
  { id: 'website',              label: 'Website URL',          width: 160 },
  { id: 'email',                label: 'Email',                width: 200 },
  { id: 'phone',                label: 'Phone',                width: 150 },
  { id: 'linkedin',             label: 'LinkedIn URL',         width: 180 },
  { id: 'facebook',             label: 'Facebook URL',         width: 180 },
  { id: 'instagram',            label: 'Instagram Handle',     width: 150 },
  { id: 'twitter',              label: 'Twitter / X Handle',   width: 150 },
  { id: 'source',               label: 'Source',               width: 130 },
  { id: 'stage',                label: 'Stage',                width: 140 },
  { id: 'score',                label: 'Score',                width: 90,  sortable: true },
  { id: 'owner',                label: 'Owner',                width: 130 },
  { id: 'nextStep',             label: 'Next Step',            width: 200 },
  { id: 'lastTouch',            label: 'Last Touch',           width: 130 },
  { id: 'businessIntelligence', label: 'Business Intelligence',width: 260 },
  { id: 'interactionHistory',   label: 'Interaction History',  width: 260 },
  { id: 'subjectLine',          label: 'Subject Line',         width: 220 },
  { id: 'subjectScore',         label: 'Subject Score (1-10)', width: 150, sortable: true },
  { id: 'emailBody',            label: 'Email Body',           width: 260 },
  { id: 'emailScore',           label: 'Email Score (1-10)',   width: 140, sortable: true },
  { id: 'replyRate',            label: 'Reply Rate (%)',        width: 120, sortable: true },
  { id: 'notes',                label: 'Notes',                width: 240 },
];

const TOTAL_MIN_WIDTH = COLUMNS.reduce((s, c) => s + c.width, 0);

function SkeletonRow() {
  return (
    <tr>
      {COLUMNS.map((col, i) => (
        <td key={col.id} className="px-3 py-3" style={{ minWidth: col.width }}>
          <div className="h-4 bg-muted/40 rounded animate-pulse" style={{ width: i === 0 ? 120 : '70%' }} />
        </td>
      ))}
    </tr>
  );
}

function Cell({ col, lead }: { col: ColDef; lead: Lead }) {
  const val = (lead as any)[col.id];
  const empty = val === undefined || val === null || val === '' || val === 0;

  switch (col.id) {
    case 'name':
      return <span className="font-medium text-foreground whitespace-nowrap">{val || '—'}</span>;
    case 'stage':
      return val ? <StageBadge stage={val} /> : <span className="text-muted-foreground">—</span>;
    case 'score':
      return val ? <ScoreBadge score={val} size="sm" /> : <span className="text-muted-foreground">—</span>;
    case 'subjectScore':
    case 'emailScore': {
      const n = Number(val);
      if (!n) return <span className="text-muted-foreground">—</span>;
      const color = n >= 8 ? 'text-emerald-400' : n >= 5 ? 'text-amber-400' : 'text-red-400';
      return <span className={cn('font-semibold tabular-nums', color)}>{n}<span className="text-muted-foreground font-normal">/10</span></span>;
    }
    case 'replyRate': {
      const n = Number(val);
      if (!n) return <span className="text-muted-foreground">—</span>;
      return <span className="tabular-nums text-muted-foreground">{n}%</span>;
    }
    case 'email':
      return val ? (
        <a href={`mailto:${val}`} onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors min-w-0">
          <Mail className="w-3 h-3 shrink-0" /><span className="truncate">{val}</span>
        </a>
      ) : <span className="text-muted-foreground">—</span>;
    case 'phone':
      return val ? (
        <span className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
          <Phone className="w-3 h-3 shrink-0" />{val}
        </span>
      ) : <span className="text-muted-foreground">—</span>;
    case 'website':
      return val ? (
        <a href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
          <Globe className="w-3 h-3 shrink-0" /><span className="truncate max-w-[130px] block">{val}</span>
        </a>
      ) : <span className="text-muted-foreground">—</span>;
    case 'linkedin':
      return val ? (
        <a href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors">
          <Linkedin className="w-3 h-3 shrink-0" /><span className="truncate max-w-[150px] block">{val}</span>
        </a>
      ) : <span className="text-muted-foreground">—</span>;
    case 'facebook':
      return val ? (
        <a href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 text-blue-500 hover:text-blue-400 transition-colors">
          <Facebook className="w-3 h-3 shrink-0" /><span className="truncate max-w-[150px] block">{val}</span>
        </a>
      ) : <span className="text-muted-foreground">—</span>;
    case 'instagram':
      return val ? (
        <span className="flex items-center gap-1.5 text-pink-400 whitespace-nowrap">
          <Instagram className="w-3 h-3 shrink-0" />{val}
        </span>
      ) : <span className="text-muted-foreground">—</span>;
    case 'twitter':
      return val ? (
        <span className="flex items-center gap-1.5 text-sky-300 whitespace-nowrap">
          <Twitter className="w-3 h-3 shrink-0" />{val}
        </span>
      ) : <span className="text-muted-foreground">—</span>;
    case 'businessIntelligence':
    case 'interactionHistory':
    case 'emailBody':
    case 'notes':
      return empty ? <span className="text-muted-foreground">—</span>
        : <span className="text-muted-foreground line-clamp-2 max-w-[240px] block">{val}</span>;
    case 'nextStep':
      return empty ? <span className="text-muted-foreground">—</span>
        : <span className="text-foreground/80 truncate max-w-[180px] block">{val}</span>;
    case 'lastTouch':
      return empty ? <span className="text-muted-foreground">—</span>
        : <span className="text-muted-foreground whitespace-nowrap text-xs">{val}</span>;
    default:
      return empty ? <span className="text-muted-foreground">—</span>
        : <span className="text-muted-foreground truncate max-w-[130px] block">{val}</span>;
  }
}

export function LeadsView({ leads, loading, activeFolder }: LeadsViewProps) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [sortKey, setSortKey] = useState<ColId | ''>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.industry?.toLowerCase().includes(q)
      );
    }
    if (stageFilter) result = result.filter(l => l.stage === stageFilter);
    if (sortKey) {
      result.sort((a, b) => {
        const av = (a as any)[sortKey] ?? 0;
        const bv = (b as any)[sortKey] ?? 0;
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'desc' ? bv - av : av - bv;
        }
        return sortDir === 'desc'
          ? String(bv).localeCompare(String(av))
          : String(av).localeCompare(String(bv));
      });
    }
    return result;
  }, [leads, search, stageFilter, sortKey, sortDir]);

  function toggleSort(key: ColId) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const stages = useMemo(() => Array.from(new Set(leads.map(l => l.stage).filter(Boolean))), [leads]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Active folder banner */}
      {activeFolder && (
        <div className="px-6 py-2 bg-primary/5 border-b border-primary/10 flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-primary/70 font-medium">Viewing folder:</span>
          <span className="text-xs font-semibold text-primary">{activeFolder.name}</span>
          <span className="text-xs text-muted-foreground/50 ml-1">— leads below are filtered by this category</span>
        </div>
      )}
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-border/40 flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value)}
          className="text-sm bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All Stages</option>
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Full-scrolling table — horizontal + vertical */}
      <div className="flex-1 overflow-auto min-h-0">
        <table
          className="text-sm border-separate border-spacing-0"
          style={{ minWidth: TOTAL_MIN_WIDTH }}
        >
          <thead className="sticky top-0 z-20">
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.id}
                  className="text-left px-3 py-3 text-xs font-medium text-muted-foreground bg-card/95 backdrop-blur-sm border-b border-border/40 whitespace-nowrap"
                  style={{ minWidth: col.width }}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.id)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {col.label}
                      {sortKey === col.id
                        ? sortDir === 'desc'
                          ? <ChevronDown className="w-3 h-3" />
                          : <ChevronUp className="w-3 h-3" />
                        : null}
                    </button>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="text-center py-16 text-muted-foreground text-sm">
                  {search || stageFilter ? 'No leads match your filters.' : 'No leads yet.'}
                </td>
              </tr>
            ) : (
              filtered.map((lead, idx) => (
                <tr
                  key={lead.id}
                  className={cn(
                    'hover:bg-accent/20 transition-colors border-b border-border/20',
                    idx % 2 === 1 && 'bg-muted/10',
                  )}
                >
                  {COLUMNS.map(col => (
                    <td
                      key={col.id}
                      className="px-3 py-2.5 align-middle"
                      style={{ minWidth: col.width }}
                    >
                      <Cell col={col} lead={lead} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
