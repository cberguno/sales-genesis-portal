export type LeadStage =
  | 'New Lead'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export type DealStage =
  | 'New Lead'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export type ActivityType =
  | 'Email'
  | 'Call'
  | 'Meeting'
  | 'Demo'
  | 'Note'
  | 'Task'
  | 'LinkedIn';

export type ActivityStatus = 'Pending' | 'Completed' | 'Overdue';

export interface Lead {
  id: string;
  name: string;
  company: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  twitter: string;
  source: string;
  stage: LeadStage;
  score: number;
  owner: string;
  nextStep: string;
  lastTouch: string;
  businessIntelligence: string;
  interactionHistory: string;
  subjectLine: string;
  subjectScore: number;
  emailBody: string;
  emailScore: number;
  replyRate: number;
  notes: string;
}

export interface Deal {
  id: string;
  title: string;
  contact: string;
  company: string;
  value: number;
  probability: number;
  stage: DealStage;
  owner: string;
  closeDate: string;
  notes: string;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  contact: string;
  company: string;
  owner: string;
  date: string;
  status: ActivityStatus;
  summary: string;
  nextAction: string;
}

export const STAGE_COLORS: Record<string, string> = {
  'New Lead': '#6b7280',
  'Contacted': '#3b82f6',
  'Qualified': '#f59e0b',
  'Proposal Sent': '#8b5cf6',
  'Negotiation': '#f97316',
  'Won': '#10b981',
  'Lost': '#ef4444',
};

export const STAGE_BG: Record<string, string> = {
  'New Lead': 'bg-gray-500/15 text-gray-400',
  'Contacted': 'bg-blue-500/15 text-blue-400',
  'Qualified': 'bg-amber-500/15 text-amber-400',
  'Proposal Sent': 'bg-purple-500/15 text-purple-400',
  'Negotiation': 'bg-orange-500/15 text-orange-400',
  'Won': 'bg-emerald-500/15 text-emerald-400',
  'Lost': 'bg-red-500/15 text-red-400',
};

export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  'Email': 'bg-blue-500/15 text-blue-400',
  'Call': 'bg-emerald-500/15 text-emerald-400',
  'Meeting': 'bg-purple-500/15 text-purple-400',
  'Demo': 'bg-amber-500/15 text-amber-400',
  'Note': 'bg-gray-500/15 text-gray-400',
  'Task': 'bg-orange-500/15 text-orange-400',
  'LinkedIn': 'bg-sky-500/15 text-sky-400',
};

export const DEAL_STAGES: DealStage[] = [
  'New Lead',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Negotiation',
  'Won',
  'Lost',
];

export const SOURCE_STAGE_MAP: Record<string, string> = {
  'src-ref': 'Referral',
  'src-web': 'Website',
  'src-li': 'LinkedIn',
  'src-cold': 'Cold Outreach',
  'src-event': 'Event',
  'src-ad': 'Paid Ad',
  'src-other': 'Other',
};

export const LEAD_STAGE_MAP: Record<string, LeadStage> = {
  'stg-new': 'New Lead',
  'stg-contact': 'Contacted',
  'stg-qual': 'Qualified',
  'stg-prop': 'Proposal Sent',
  'stg-neg': 'Negotiation',
  'stg-won': 'Won',
  'stg-lost': 'Lost',
};

export const DEAL_STAGE_MAP: Record<string, DealStage> = {
  'ds-new': 'New Lead',
  'ds-contact': 'Contacted',
  'ds-qual': 'Qualified',
  'ds-prop': 'Proposal Sent',
  'ds-neg': 'Negotiation',
  'ds-won': 'Won',
  'ds-lost': 'Lost',
};

export const ACTIVITY_TYPE_MAP: Record<string, ActivityType> = {
  'at-email': 'Email',
  'at-call': 'Call',
  'at-meeting': 'Meeting',
  'at-demo': 'Demo',
  'at-note': 'Note',
  'at-task': 'Task',
  'at-linkedin': 'LinkedIn',
};

export const ACTIVITY_STATUS_MAP: Record<string, ActivityStatus> = {
  'as-pend': 'Pending',
  'as-done': 'Completed',
  'as-over': 'Overdue',
};
