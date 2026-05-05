import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Lead,
  Deal,
  Activity,
  LEAD_STAGE_MAP,
  DEAL_STAGE_MAP,
  ACTIVITY_TYPE_MAP,
  ACTIVITY_STATUS_MAP,
  SOURCE_STAGE_MAP,
  LeadStage,
  DealStage,
  ActivityType,
  ActivityStatus,
} from '../types/crm';

const BASE = '/api/taskade';
const LEADS_PROJECT = 'fCLCLrVLj1goSeBJ';
const DEALS_PROJECT = '7JokDtGU5muchdUi';
const ACTIVITIES_PROJECT = 'QaTB2mhbLTqaqx8t';

function parseNode(n: any): any {
  const fv = n.fieldValues || {};
  return { id: n.id, fv };
}

function mapLead(n: any): Lead {
  const fv = n.fieldValues || {};
  const stageKey = fv['/attributes/@f011'];
  const sourceKey = fv['/attributes/@f010'];
  return {
    id: n.id,
    name: fv['/text'] || '',
    company: fv['/attributes/@f001'] || '',
    industry: fv['/attributes/@f002'] || '',
    website: fv['/attributes/@f003'] || '',
    email: fv['/attributes/@f004'] || '',
    phone: fv['/attributes/@f005'] || '',
    linkedin: fv['/attributes/@f006'] || '',
    facebook: fv['/attributes/@f007'] || '',
    instagram: fv['/attributes/@f008'] || '',
    twitter: fv['/attributes/@f009'] || '',
    source: SOURCE_STAGE_MAP[sourceKey] || sourceKey || '',
    stage: LEAD_STAGE_MAP[stageKey] || 'New Lead',
    score: fv['/attributes/@f012'] || 0,
    owner: fv['/attributes/@f013'] || '',
    nextStep: fv['/attributes/@f014'] || '',
    lastTouch: fv['/attributes/@f015'] || '',
    businessIntelligence: fv['/attributes/@f016'] || '',
    interactionHistory: fv['/attributes/@f017'] || '',
    subjectLine: fv['/attributes/@f018'] || '',
    subjectScore: fv['/attributes/@f019'] || 0,
    emailBody: fv['/attributes/@f020'] || '',
    emailScore: fv['/attributes/@f021'] || 0,
    replyRate: fv['/attributes/@f022'] ? Math.round(fv['/attributes/@f022'] * 100) : 0,
    notes: fv['/attributes/@f023'] || '',
  };
}

function mapDeal(n: any): Deal {
  const fv = n.fieldValues || {};
  const stageKey = fv['/attributes/@ds001'];
  return {
    id: n.id,
    title: fv['/text'] || '',
    contact: fv['/attributes/@dl001'] || '',
    company: fv['/attributes/@dc001'] || '',
    value: fv['/attributes/@dv001'] || 0,
    probability: fv['/attributes/@dp001'] ? Math.round(fv['/attributes/@dp001'] * 100) : 0,
    stage: DEAL_STAGE_MAP[stageKey] || 'New Lead',
    owner: fv['/attributes/@do001'] || '',
    closeDate: fv['/attributes/@dd001'] || '',
    notes: fv['/attributes/@dn001'] || '',
  };
}

function mapActivity(n: any): Activity {
  const fv = n.fieldValues || {};
  const typeKey = fv['/attributes/@at001'];
  const statusKey = fv['/attributes/@as001'];
  return {
    id: n.id,
    title: fv['/text'] || '',
    type: ACTIVITY_TYPE_MAP[typeKey] || 'Note',
    contact: fv['/attributes/@ac001'] || '',
    company: fv['/attributes/@aco01'] || '',
    owner: fv['/attributes/@ao001'] || '',
    date: fv['/attributes/@ad001'] || '',
    status: ACTIVITY_STATUS_MAP[statusKey] || 'Pending',
    summary: fv['/attributes/@an001'] || '',
    nextAction: fv['/attributes/@ank01'] || '',
  };
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/projects/${LEADS_PROJECT}/nodes`);
      const nodes: any[] = res.data?.payload?.nodes || [];
      // Leads are root-level nodes (parentId: null) with a name
      const filtered = nodes.filter((n: any) => n.fieldValues?.['/text']);
      setLeads(filtered.map(mapLead));
      setError(null);
    } catch {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
}

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/projects/${DEALS_PROJECT}/nodes`);
      const nodes: any[] = res.data?.payload?.nodes || [];
      const filtered = nodes.filter((n: any) => n.fieldValues?.['/text']);
      setDeals(filtered.map(mapDeal));
      setError(null);
    } catch {
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  return { deals, loading, error, refetch: fetchDeals };
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE}/projects/${ACTIVITIES_PROJECT}/nodes`);
      const nodes: any[] = res.data?.payload?.nodes || [];
      const filtered = nodes.filter((n: any) => n.fieldValues?.['/text']);
      setActivities(filtered.map(mapActivity));
      setError(null);
    } catch {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
}

export async function createLead(data: Partial<Lead>): Promise<void> {
  await axios.post(`${BASE}/projects/${LEADS_PROJECT}/nodes`, {
    parentId: null,
    '/text': data.name || 'New Lead',
    '/attributes/@f001': data.company,
    '/attributes/@f002': data.industry,
    '/attributes/@f003': data.website,
    '/attributes/@f004': data.email,
    '/attributes/@f005': data.phone,
    '/attributes/@f006': data.linkedin,
    '/attributes/@f007': data.facebook,
    '/attributes/@f008': data.instagram,
    '/attributes/@f009': data.twitter,
    '/attributes/@f013': data.owner,
    '/attributes/@f014': data.nextStep,
    '/attributes/@f023': data.notes,
  });
}

export async function createActivity(data: Partial<Activity>): Promise<void> {
  const typeReverseMap: Record<string, string> = {
    'Email': 'at-email', 'Call': 'at-call', 'Meeting': 'at-meeting',
    'Demo': 'at-demo', 'Note': 'at-note', 'Task': 'at-task', 'LinkedIn': 'at-linkedin',
  };
  await axios.post(`${BASE}/projects/${ACTIVITIES_PROJECT}/nodes`, {
    parentId: null,
    '/text': data.title || 'New Activity',
    '/attributes/@at001': data.type ? typeReverseMap[data.type] : 'at-note',
    '/attributes/@ac001': data.contact,
    '/attributes/@aco01': data.company,
    '/attributes/@ao001': data.owner,
    '/attributes/@an001': data.summary,
    '/attributes/@ank01': data.nextAction,
    '/attributes/@as001': 'as-pend',
  });
}
