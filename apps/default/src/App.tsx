import * as React from 'react';
import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Sidebar, CrmView, LeadsFolder } from './components/crm/Sidebar';
import { Header } from './components/crm/Header';
import { DashboardView } from './components/crm/DashboardView';
import { LeadsView } from './components/crm/LeadsView';
import { DealsView } from './components/crm/DealsView';
import { ActivitiesView } from './components/crm/ActivitiesView';
import { AgentsView } from './components/crm/AgentsView';
import { useLeads, useDeals, useActivities } from './hooks/useCrmData';
import { ParigiPage } from './components/parigi/ParigiPage';

const FOLDERS_KEY = 'crm_leads_folders';

function loadFolders(): LeadsFolder[] {
  try {
    const raw = localStorage.getItem(FOLDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFolders(folders: LeadsFolder[]) {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

function CRMApp() {
  const [view, setView] = useState<CrmView>('dashboard');
  const [leadsfolders, setLeadsFolders] = useState<LeadsFolder[]>(loadFolders);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const { leads, loading: leadsLoading, refetch: refetchLeads } = useLeads();
  const { deals, loading: dealsLoading, refetch: refetchDeals } = useDeals();
  const { activities, loading: activitiesLoading, refetch: refetchActivities } = useActivities();

  const isLoading = leadsLoading || dealsLoading || activitiesLoading;

  const handleRefresh = useCallback(() => {
    refetchLeads();
    refetchDeals();
    refetchActivities();
  }, [refetchLeads, refetchDeals, refetchActivities]);

  const handleFolderCreate = useCallback((name: string) => {
    const newFolder: LeadsFolder = { id: `folder-${Date.now()}`, name };
    setLeadsFolders(prev => {
      const updated = [...prev, newFolder];
      saveFolders(updated);
      return updated;
    });
    setActiveFolderId(newFolder.id);
    setView('leads');
  }, []);

  const handleFolderDelete = useCallback((id: string) => {
    setLeadsFolders(prev => {
      const updated = prev.filter(f => f.id !== id);
      saveFolders(updated);
      return updated;
    });
    setActiveFolderId(prev => (prev === id ? null : prev));
  }, []);

  const handleFolderSelect = useCallback((id: string | null) => {
    setActiveFolderId(id);
  }, []);

  // Derive active folder name for the header
  const activeFolder = leadsfolders.find(f => f.id === activeFolderId) ?? null;

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar
        view={view}
        onViewChange={setView}
        leaderFolders={leadsfolders}
        activeFolderId={activeFolderId}
        onFolderSelect={handleFolderSelect}
        onFolderCreate={handleFolderCreate}
        onFolderDelete={handleFolderDelete}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header view={view} onRefresh={handleRefresh} refreshing={isLoading} activeFolder={activeFolder?.name} />
        <main className="flex-1 min-h-0 overflow-hidden">
          {view === 'dashboard' && (
            <DashboardView leads={leads} deals={deals} activities={activities} loading={isLoading} />
          )}
          {view === 'leads' && (
            <LeadsView leads={leads} loading={leadsLoading} activeFolder={activeFolder} />
          )}
          {view === 'deals' && (
            <DealsView deals={deals} loading={dealsLoading} />
          )}
          {view === 'activities' && (
            <ActivitiesView activities={activities} loading={activitiesLoading} />
          )}
          {view === 'agents' && (
            <AgentsView />
          )}
        </main>
      </div>
    </div>
  );
}

const App: React.FC = function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cbr-consulting" element={<ParigiPage />} />
        <Route path="/*" element={
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <CRMApp />
          </ThemeProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
