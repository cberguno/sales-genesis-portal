import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { createConversation, createAgentChat } from '@/lib/agent-chat/v2';
import {
  Conversation, ConversationContent, ConversationScrollButton
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  Tool, ToolHeader, ToolContent, ToolInput, ToolOutput
} from '@/components/ai-elements/tool';
import {
  Confirmation, ConfirmationTitle, ConfirmationRequest,
  ConfirmationAccepted, ConfirmationRejected, ConfirmationActions, ConfirmationAction
} from '@/components/ai-elements/confirmation';
import {
  PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit
} from '@/components/ai-elements/prompt-input';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { isToolUIPart } from 'ai';
import type { UIMessage } from 'ai';
import { ulid } from 'ulidx';
import { Search, Globe, RefreshCw, Mail, ArrowLeft } from 'lucide-react';

const AGENTS = [
  {
    id: '01KQSB11DE6S1M688NN75HX7Y3',
    publicId: '01KQSB1291DY80ECQSC1ZHFYDM',
    name: 'Lead Scout',
    description: 'Research and score new leads with deep business intelligence.',
    icon: Search,
    color: 'text-blue-400 bg-blue-500/10',
    suggestions: [
      'Research a company and score them as a lead',
      'Who are the key decision-makers at [company]?',
      'Build a full lead profile for [company name]',
    ],
  },
  {
    id: '01KQSB1Y0MCFKS662C0VSDAGT9',
    publicId: '01KQSB1Y0TK4HCJCAQTWNEJ3RB',
    name: 'Website Auditor',
    description: 'Analyze prospect websites for sales intelligence and pain points.',
    icon: Globe,
    color: 'text-emerald-400 bg-emerald-500/10',
    suggestions: [
      'Audit this website and give me a sales intelligence report',
      'Find pain points from this website: [URL]',
      'What tech stack does this company use?',
    ],
  },
  {
    id: '01KQSB2Y3J1PBZP6PEQRDGGZTT',
    publicId: '01KQSB2Y43N9B1YYKXA6AW1BZJ',
    name: 'Website Refresher',
    description: 'Find website improvement opportunities to use as outreach hooks.',
    icon: RefreshCw,
    color: 'text-purple-400 bg-purple-500/10',
    suggestions: [
      'Review this website and suggest improvements I can use as outreach hooks',
      'Find 3 quick wins for this website: [URL]',
      'Critique the messaging on this website: [URL]',
    ],
  },
  {
    id: '01KQSB3R6HSMR3D8MF3H5RV17J',
    publicId: '01KQSB3R6XHDWM9M40EEMT85Z9',
    name: 'Outreach Specialist',
    description: 'Craft personalized emails with subject line scores and reply rate predictions.',
    icon: Mail,
    color: 'text-amber-400 bg-amber-500/10',
    suggestions: [
      'Write a cold outreach email for: [name, company, context]',
      'Score and improve this email draft: [paste email]',
      'Write a Day 3 follow-up for: [name] at [company]',
    ],
  },
];

function MessageParts({
  message,
  onApprove,
}: {
  message: UIMessage;
  onApprove: ReturnType<typeof useChat>['addToolApprovalResponse'];
}) {
  return (
    <>
      {message.parts.map((part, i) => {
        const key = `${message.id}-${i}`;
        if (part.type === 'text') {
          return message.role === 'user' ? (
            <p key={key} className="text-sm">{part.text}</p>
          ) : (
            <MessageResponse key={key}>{part.text}</MessageResponse>
          );
        }
        if (isToolUIPart(part)) {
          return (
            <Tool key={key}>
              <ToolHeader type={part.type} state={part.state} />
              <ToolContent>
                <ToolInput input={part.input} />
                <Confirmation approval={part.approval} state={part.state}>
                  <ConfirmationRequest>
                    <ConfirmationTitle>Allow this action?</ConfirmationTitle>
                  </ConfirmationRequest>
                  <ConfirmationAccepted>Approved</ConfirmationAccepted>
                  <ConfirmationRejected>Rejected</ConfirmationRejected>
                  <ConfirmationActions>
                    <ConfirmationAction
                      variant="outline"
                      onClick={() => part.approval != null && onApprove({ id: part.approval.id, approved: false })}
                    >
                      Deny
                    </ConfirmationAction>
                    <ConfirmationAction
                      onClick={() => part.approval != null && onApprove({ id: part.approval.id, approved: true })}
                    >
                      Approve
                    </ConfirmationAction>
                  </ConfirmationActions>
                </Confirmation>
                <ToolOutput output={part.output} errorText={part.errorText} />
              </ToolContent>
            </Tool>
          );
        }
        return null;
      })}
    </>
  );
}

function ActiveChat({ chat, agent, onBack }: {
  chat: ReturnType<typeof createAgentChat>;
  agent: typeof AGENTS[0];
  onBack: () => void;
}) {
  const { messages, status, addToolApprovalResponse } = useChat({ chat, id: chat.id });
  const hasMessages = messages.length > 0;
  const Icon = agent.icon;

  const handleSend = async (text: string) => {
    await chat.sendMessage({ id: ulid(), role: 'user', parts: [{ type: 'text', text }] });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border/40 flex-shrink-0">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', agent.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{agent.name}</p>
          <p className="text-xs text-muted-foreground">{agent.description}</p>
        </div>
      </div>

      {/* Conversation */}
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map(msg => (
            <Message key={msg.id} from={msg.role}>
              <MessageContent>
                <MessageParts message={msg} onApprove={addToolApprovalResponse} />
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {!hasMessages && (
        <Suggestions>
          {agent.suggestions.map(s => (
            <Suggestion key={s} suggestion={s} onClick={handleSend} />
          ))}
        </Suggestions>
      )}

      <PromptInput onSubmit={({ text }) => handleSend(text)}>
        <PromptInputTextarea placeholder={`Ask ${agent.name}…`} />
        <PromptInputFooter>
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

function AgentChatLoader({ agent, onBack }: { agent: typeof AGENTS[0]; onBack: () => void }) {
  const [chat, setChat] = useState<ReturnType<typeof createAgentChat> | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    createConversation(agent.publicId)
      .then(({ conversationId }) => setChat(createAgentChat(agent.publicId, conversationId)))
      .catch(() => setError('Failed to start conversation. Please try again.'));
  }, [agent.publicId]);

  if (error) return (
    <div className="flex flex-col h-full items-center justify-center gap-3">
      <p className="text-sm text-red-400">{error}</p>
      <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="w-3 h-3" /> Back to agents
      </button>
    </div>
  );

  if (!chat) return (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-xs text-muted-foreground">Connecting to {agent.name}…</p>
    </div>
  );

  return <ActiveChat chat={chat} agent={agent} onBack={onBack} />;
}

export function AgentsView() {
  const [activeAgent, setActiveAgent] = useState<typeof AGENTS[0] | null>(null);

  if (activeAgent) {
    return <AgentChatLoader key={activeAgent.id} agent={activeAgent} onBack={() => setActiveAgent(null)} />;
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">AI Agents</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Four specialized intelligence agents, each trained for a different step in your sales process.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENTS.map(agent => {
          const Icon = agent.icon;
          return (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent)}
              className="text-left bg-card border border-border/50 rounded-xl p-5 hover:border-border hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform', agent.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{agent.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {agent.suggestions.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-muted/50 rounded-full text-muted-foreground line-clamp-1 max-w-[200px]">
                        {s.length > 35 ? s.slice(0, 35) + '…' : s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
