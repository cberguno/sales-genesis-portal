import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Activity,
  Bot,
  TrendingUp,
  Plus,
  Folder,
  FolderOpen,
  X,
  ChevronRight,
} from 'lucide-react';

export type CrmView = 'dashboard' | 'leads' | 'deals' | 'activities' | 'agents';

export interface LeadsFolder {
  id: string;
  name: string;
}

interface SidebarProps {
  view: CrmView;
  onViewChange: (v: CrmView) => void;
  leaderFolders: LeadsFolder[];
  activeFolderId: string | null;
  onFolderSelect: (id: string | null) => void;
  onFolderCreate: (name: string) => void;
  onFolderDelete: (id: string) => void;
}

const TOP_NAV = [
  { id: 'dashboard' as CrmView, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'deals' as CrmView, label: 'Deals', icon: Briefcase },
  { id: 'activities' as CrmView, label: 'Activities', icon: Activity },
  { id: 'agents' as CrmView, label: 'AI Agents', icon: Bot },
];

export function Sidebar({
  view,
  onViewChange,
  leaderFolders,
  activeFolderId,
  onFolderSelect,
  onFolderCreate,
  onFolderDelete,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [leadsExpanded, setLeadsExpanded] = useState(true);
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const handleLeadsClick = () => {
    onViewChange('leads');
    onFolderSelect(null);
    setLeadsExpanded(true);
  };

  const handleFolderClick = (id: string) => {
    onViewChange('leads');
    onFolderSelect(id);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLeadsExpanded(true);
    setIsCreating(true);
    setNewFolderName('');
  };

  const commitCreate = () => {
    const name = newFolderName.trim();
    if (name) {
      onFolderCreate(name);
    }
    setIsCreating(false);
    setNewFolderName('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitCreate();
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewFolderName('');
    }
  };

  const isLeadsActive = view === 'leads';

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border/50 bg-card/40 backdrop-blur-sm flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm text-foreground">Sales CRM</span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Pipeline Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">

        {/* Dashboard first */}
        <button
          onClick={() => onViewChange('dashboard')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
            view === 'dashboard'
              ? 'bg-primary/10 text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
          )}
        >
          <LayoutDashboard className={cn('w-4 h-4', view === 'dashboard' ? 'text-primary' : '')} />
          Dashboard
        </button>

        {/* Leads section with subfolders */}
        <div className="pt-0.5">
          {/* Leads row */}
          <div className="group flex items-center rounded-lg overflow-hidden">
            <button
              onClick={handleLeadsClick}
              className={cn(
                'flex-1 flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all rounded-lg',
                isLeadsActive && !activeFolderId
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
              )}
            >
              <Users className={cn('w-4 h-4 flex-shrink-0', isLeadsActive && !activeFolderId ? 'text-primary' : '')} />
              <span className="flex-1 text-left">Leads</span>
              {/* Chevron to toggle expand */}
              <ChevronRight
                className={cn(
                  'w-3 h-3 transition-transform flex-shrink-0',
                  leadsExpanded ? 'rotate-90' : '',
                  isLeadsActive && !activeFolderId ? 'text-primary' : 'text-muted-foreground/60',
                )}
                onClick={(e) => { e.stopPropagation(); setLeadsExpanded(!leadsExpanded); }}
              />
            </button>
            {/* Plus button — always visible on hover of this row */}
            <button
              title="New subfolder"
              onClick={handleAddClick}
              className={cn(
                'mr-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all',
                'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Subfolders */}
          {leadsExpanded && (
            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/40 pl-3">
              {leaderFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="group/folder flex items-center gap-1"
                  onMouseEnter={() => setHoveredFolder(folder.id)}
                  onMouseLeave={() => setHoveredFolder(null)}
                >
                  <button
                    onClick={() => handleFolderClick(folder.id)}
                    className={cn(
                      'flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-all',
                      isLeadsActive && activeFolderId === folder.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
                    )}
                  >
                    {isLeadsActive && activeFolderId === folder.id
                      ? <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                      : <Folder className="w-3.5 h-3.5 flex-shrink-0" />
                    }
                    <span className="truncate">{folder.name}</span>
                  </button>
                  {/* Delete folder button */}
                  {hoveredFolder === folder.id && (
                    <button
                      title="Remove folder"
                      onClick={(e) => { e.stopPropagation(); onFolderDelete(folder.id); }}
                      className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {/* Inline new folder input */}
              {isCreating && (
                <div className="flex items-center gap-1.5 px-2 py-1.5">
                  <Folder className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/60" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={commitCreate}
                    placeholder="Folder name…"
                    className={cn(
                      'flex-1 min-w-0 text-xs bg-transparent border-b border-primary/60 outline-none',
                      'text-foreground placeholder:text-muted-foreground/50 pb-0.5',
                    )}
                  />
                </div>
              )}

              {/* Empty state nudge */}
              {leaderFolders.length === 0 && !isCreating && (
                <button
                  onClick={handleAddClick}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors rounded-md w-full"
                >
                  <Plus className="w-3 h-3" />
                  Add subfolder
                </button>
              )}
            </div>
          )}
        </div>

        {/* Remaining nav items */}
        {TOP_NAV.filter(n => n.id !== 'dashboard').map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              view === id
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
            )}
          >
            <Icon className={cn('w-4 h-4', view === id ? 'text-primary' : '')} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom hint */}
      <div className="p-3 mx-3 mb-4 rounded-lg bg-muted/40 border border-border/30">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          4 AI agents ready to assist with lead research, outreach, and website audits.
        </p>
      </div>
    </aside>
  );
}
