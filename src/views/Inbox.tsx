import React, { useState } from 'react';
import { Plus, Send, X } from 'lucide-react';
import { useResearch } from '../contexts/ResearchContext';

const Inbox: React.FC = () => {
  const { inbox, projects, markThreadRead, replyToThread, addInboxThread } = useResearch();
  const [selectedId, setSelectedId] = useState(inbox[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [studyName, setStudyName] = useState(projects[0]?.name || 'Mobile Onboarding Flow');
  const [body, setBody] = useState('');

  const activeThread = inbox.find((t) => t.id === selectedId) || inbox[0];

  const handleSelectThread = (id: string) => {
    setSelectedId(id);
    markThreadRead(id);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;
    replyToThread(activeThread.id, replyText);
    setReplyText('');
  };

  const handleCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !body.trim()) return;
    addInboxThread(recipient.trim(), subject.trim(), studyName, body.trim());
    setRecipient('');
    setSubject('');
    setBody('');
    setIsComposeOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">Inbox</h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Participant confirmations, study coordination, and stakeholder review notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Message</span>
        </button>
      </div>

      {/* Split-Pane Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden min-h-[540px]">
        {/* Thread List */}
        <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[var(--sys-outline-variant)] divide-y divide-[var(--sys-outline-variant)]">
          {inbox.map((thread) => {
            const active = activeThread?.id === thread.id;
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => handleSelectThread(thread.id)}
                className={`w-full text-left p-4 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--sys-primary-container)]/55'
                    : 'hover:bg-[var(--sys-surface-low)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span
                    className={`text-sm truncate ${
                      thread.unread
                        ? 'font-bold text-[var(--sys-on-surface)]'
                        : 'font-semibold text-[var(--sys-on-surface-secondary)]'
                    }`}
                  >
                    {thread.senderName}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--sys-on-surface-tertiary)] shrink-0 tabular-nums">
                    {thread.timestamp}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--sys-on-surface)] truncate">
                  {thread.subject}
                </p>
                <p className="text-xs text-[var(--sys-on-surface-tertiary)] line-clamp-2 mt-1">
                  {thread.preview}
                </p>
              </button>
            );
          })}
        </aside>

        {/* Active Conversation */}
        {activeThread ? (
          <section className="lg:col-span-8 flex flex-col justify-between">
            <div className="p-5 border-b border-[var(--sys-outline-variant)] flex items-center gap-3.5">
              <img
                src={activeThread.senderAvatar}
                alt={activeThread.senderName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-[var(--sys-radius-sm)] object-cover border border-[var(--sys-outline-variant)] shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-[var(--sys-on-surface)] truncate">
                  {activeThread.subject}
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-tertiary)] truncate">
                  {activeThread.senderName} · {activeThread.senderRole}
                </p>
              </div>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xl p-4 rounded-[var(--sys-radius-md)] border ${
                    msg.isSelf
                      ? 'ml-auto bg-[var(--sys-primary-container)] border-[var(--sys-primary)]/30 text-[var(--sys-on-primary-container)]'
                      : 'bg-[var(--sys-surface-low)] border-[var(--sys-outline-variant)] text-[var(--sys-on-surface)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[11px] opacity-75 mb-1.5 tabular-nums">
                    <span className="font-semibold">{msg.author}</span>
                    <span className="font-mono">{msg.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.body}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendReply}
              className="p-4 border-t border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)] flex items-center gap-2.5"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${activeThread.senderName}...`}
                aria-label="Write a reply"
                className="flex-1 h-10 px-3.5 text-sm sys-input"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </section>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-8 text-sm text-[var(--sys-on-surface-secondary)]">
            Select a thread to view messages.
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="compose-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsComposeOpen(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleCompose}
            className="relative z-10 w-full max-w-md rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="compose-modal-title" className="text-lg font-bold text-[var(--sys-on-surface)]">
                New Message
              </h2>
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-[var(--sys-radius-sm)] flex items-center justify-center text-[var(--sys-on-surface-secondary)] hover:bg-[var(--sys-surface-container)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient name"
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full h-10 px-3.5 text-sm sys-input"
              />
              <select
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                aria-label="Study"
                className="w-full h-10 px-3 text-sm sys-input"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <textarea
                required
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message..."
                className="w-full p-3.5 text-sm sys-input resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-xs sys-btn-primary cursor-pointer">
                Send Message
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Inbox;
