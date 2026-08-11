'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ref,
  push,
  onValue,
  serverTimestamp,
  off,
  set,
  onDisconnect,
  query,
  orderByChild,
  limitToLast,
  update,
} from 'firebase/database';
import { rtdb } from '@/lib/firebase/rtdb';
import { type RtdbMessage } from '@/lib/chat/models';
import { useAuth } from '@/providers/AuthProvider';
import {
  MessageSquare,
  Send,
  Code,
  ShieldCheck,
  CheckCheck,
  Loader2,
  Circle,
  WifiOff,
  Hash,
  User,
} from 'lucide-react';
import { BlurReveal } from '@/components/motion';

export default function ClientChatPage() {
  const { user } = useAuth();

  // ── Derive client identity from real Firebase Auth user ───────────────────
  const clientId     = user?.uid     ?? 'anonymous';
  const clientName   = user?.displayName || user?.email?.split('@')[0] || 'Client';
  const clientAvatar = user?.photoURL    ?? null;     // real photo or null
  const clientEmoji  = '👩‍💼';                         // fallback emoji in bubbles

  const [messages, setMessages]           = useState<RtdbMessage[]>([]);
  const [inputText, setInputText]         = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInputText, setCodeInputText] = useState('');
  const [adminTyping, setAdminTyping]     = useState(false);
  const [isConnected, setIsConnected]     = useState(true);
  const [isSending, setIsSending]         = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [presenceReady, setPresenceReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelPath    = `chat/${clientId}/messages`;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // ── Write real presence when user & RTDB are ready ───────────────────────
  useEffect(() => {
    const db = rtdb;
    if (!db || !user) return;          // wait until Firebase Auth resolves

    const connRef = ref(db, '.info/connected');
    const unsub = onValue(connRef, (snap) => {
      const connected = snap.val() === true;
      setIsConnected(connected);
      if (connected) {
        const presRef = ref(db, `presence/${clientId}`);
        void set(presRef, {
          online:    true,
          name:      clientName,
          email:     user.email ?? '',
          photoURL:  user.photoURL ?? '',
          role:      'client',
          clientId:  clientId,
          updatedAt: Date.now(),
        });
        void onDisconnect(presRef).set({
          online:    false,
          name:      clientName,
          email:     user.email ?? '',
          photoURL:  user.photoURL ?? '',
          role:      'client',
          clientId:  clientId,
          updatedAt: Date.now(),
        });
        setPresenceReady(true);
      }
    });
    return () => off(connRef, 'value', unsub);
  }, [user, clientId, clientName]);

  // ── Live messages ─────────────────────────────────────────────────────────
  useEffect(() => {
    const db = rtdb;
    if (!db || !user) return;
    const msgsRef = query(ref(db, channelPath), orderByChild('createdAt'), limitToLast(80));
    const unsub = onValue(msgsRef, (snap) => {
      const raw: RtdbMessage[] = [];
      snap.forEach((child) => { raw.push({ id: child.key!, ...child.val() }); });
      setMessages(raw);
      raw.forEach((msg) => {
        if (msg.senderRole === 'admin' && !msg.readBy?.[clientId]) {
          void update(ref(db, `${channelPath}/${msg.id}/readBy`), { [clientId]: true });
        }
      });
    });
    return () => off(msgsRef, 'value', unsub);
  }, [user, clientId, channelPath]);

  // ── Admin typing indicator ────────────────────────────────────────────────
  useEffect(() => {
    const db = rtdb;
    if (!db || !user) return;
    const typRef = ref(db, `chat/${clientId}/typing/admin`);
    const unsub = onValue(typRef, (snap) => setAdminTyping(snap.val()?.isTyping === true));
    return () => off(typRef, 'value', unsub);
  }, [user, clientId]);

  // ── Client typing ─────────────────────────────────────────────────────────
  const updateTyping = useCallback((isTyping: boolean) => {
    const db = rtdb;
    if (!db || !user) return;
    void set(ref(db, `chat/${clientId}/typing/${clientId}`), {
      userId: clientId, name: clientName, isTyping, updatedAt: Date.now(),
    });
  }, [user, clientId, clientName]);

  const handleInputChange = (val: string) => {
    setInputText(val);
    updateTyping(true);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => updateTyping(false), 2000));
  };

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const db = rtdb;
    if ((!inputText.trim() && !codeInputText.trim()) || isSending || !db || !user) return;
    setIsSending(true);
    updateTyping(false);
    if (typingTimeout) clearTimeout(typingTimeout);
    try {
      await push(ref(db, channelPath), {
        channelId:    clientId,
        senderId:     clientId,
        senderName:   clientName,
        senderRole:   'client',
        senderAvatar: user.photoURL || clientEmoji,
        text:         inputText.trim() || 'Attached code snippet:',
        codeSnippet:  codeInputText.trim() || null,
        createdAt:    serverTimestamp(),
        readBy:       { [clientId]: true },
      });
      setInputText('');
      setCodeInputText('');
      setShowCodeInput(false);
    } finally {
      setIsSending(false);
    }
  };

  // ── Avatar helper ─────────────────────────────────────────────────────────
  const Avatar = ({ src, name, emoji, size = 8 }: { src?: string | null; name: string; emoji?: string; size?: number }) => {
    const cls = `w-${size} h-${size} rounded-2xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center text-base shrink-0 shadow-sm select-none overflow-hidden`;
    if (src) return <img src={src} alt={name} className={`${cls} object-cover`} />;
    if (emoji) return <div className={cls}>{emoji}</div>;
    return (
      <div className={`${cls} bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] text-white font-display font-black text-xs`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  // ── Loading state while auth resolves ─────────────────────────────────────
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center opacity-50 gap-3">
        <Loader2 size={20} className="animate-spin text-[#06B6D4]" />
        <span className="text-xs font-mono text-[#64748B]">Loading your profile…</span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Page header */}
      <BlurReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4] font-bold uppercase tracking-wider mb-1">
              <MessageSquare size={16} />
              <span>DevZite Engineering</span>
            </div>
            <h1 className="text-2xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
              Project Chat
            </h1>
            <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-0.5">
              Direct line to your assigned engineering team.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Logged-in user badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[rgba(15,23,42,0.04)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              {clientAvatar
                ? <img src={clientAvatar} alt={clientName} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover" />
                : <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center text-white text-[9px] font-bold">{clientName.charAt(0).toUpperCase()}</div>
              }
              <span className="text-xs font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC] max-w-[120px] truncate">{clientName}</span>
            </div>

            {isConnected ? (
              <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[rgba(39,201,63,0.15)] text-[#27C93F] border border-[rgba(39,201,63,0.3)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#27C93F] animate-pulse" />
                Live
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[rgba(239,68,68,0.12)] text-[#EF4444] border border-[rgba(239,68,68,0.3)] flex items-center gap-1.5">
                <WifiOff size={12} /> Offline
              </span>
            )}
          </div>
        </div>
      </BlurReveal>

      {/* Chat box */}
      <div className="flex flex-col flex-1 min-h-0 rounded-3xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] overflow-hidden shadow-xl" style={{ maxHeight: '600px' }}>

        {/* Top bar */}
        <div className="px-5 py-3.5 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0 bg-white dark:bg-[#0C0D14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[rgba(6,182,212,0.12)] border border-[rgba(6,182,212,0.25)] flex items-center justify-center">
              <Hash size={15} className="text-[#06B6D4]" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] leading-tight">general</p>
              <p className="text-[10px] font-mono text-[#64748B]">Project channel</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#27C93F]">
            <ShieldCheck size={13} />
            <span>End-to-End RTDB</span>
          </div>
        </div>

        {/* Messages */}
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="lenis-prevent flex-1 min-h-0 overflow-y-auto chat-scroll-container p-4 sm:p-6 space-y-4 bg-[#F8FAFC]/60 dark:bg-[#06070A]/30"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16 opacity-50">
              <MessageSquare size={36} className="text-[#06B6D4]" />
              <div>
                <p className="text-xs font-mono text-[#64748B]">No messages yet.</p>
                <p className="text-[11px] font-mono text-[#94A3B8] mt-1">Send a message to the engineering team.</p>
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.senderRole === 'client';
            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse ml-auto' : ''} max-w-[82%]`}>
                {/* Avatar */}
                <div className="shrink-0">
                  {isMe ? (
                    clientAvatar
                      ? <img src={clientAvatar} alt={clientName} referrerPolicy="no-referrer" className="w-8 h-8 rounded-2xl object-cover border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] shadow-sm" />
                      : <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center text-white font-display font-black text-xs shadow-sm">
                          {clientName.charAt(0).toUpperCase()}
                        </div>
                  ) : (
                    <div className="w-8 h-8 rounded-2xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-base shadow-sm select-none">
                      {msg.senderAvatar?.startsWith('http') ? <img src={msg.senderAvatar} alt="" className="w-full h-full object-cover rounded-2xl" /> : (msg.senderAvatar || '👨‍💻')}
                    </div>
                  )}
                </div>

                <div className={`space-y-1 min-w-0 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 text-[10px] font-mono text-[#64748B] ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-[#0F172A] dark:text-[#94A3B8] truncate">{msg.senderName}</span>
                    <span className="shrink-0">
                      {msg.createdAt ? new Date(msg.createdAt as number).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </span>
                  </div>

                  <div className={`px-4 py-2.5 rounded-2xl text-xs font-body leading-relaxed shadow-sm max-w-full ${
                    isMe
                      ? 'bg-[#06B6D4] text-white rounded-br-none'
                      : 'bg-white dark:bg-[#111320] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#CBD5E1] rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    {msg.codeSnippet && (
                      <pre className="mt-2.5 p-3 rounded-xl bg-slate-900 text-[#60A5FA] font-mono text-[11px] overflow-x-auto text-left border border-slate-800">
                        <code>{msg.codeSnippet}</code>
                      </pre>
                    )}
                  </div>

                  {isMe && (
                    <div className="flex items-center gap-1">
                      {msg.readBy?.admin
                        ? <CheckCheck size={12} className="text-[#06B6D4]" />
                        : <Circle size={10} className="text-[#94A3B8]" />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Admin typing */}
          {adminTyping && (
            <div className="flex items-end gap-2.5 max-w-[82%]">
              <div className="w-8 h-8 rounded-2xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-base shrink-0">👨‍💻</div>
              <div className="px-4 py-3 bg-white dark:bg-[#111320] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="p-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.06)] bg-white dark:bg-[#0C0D14] space-y-2.5 shrink-0">
          {showCodeInput && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#06B6D4] block font-bold">Code Snippet:</span>
              <textarea
                rows={3}
                value={codeInputText}
                onChange={(e) => setCodeInputText(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-[#60A5FA] outline-none resize-none"
              />
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              title="Attach code block"
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                showCodeInput
                  ? 'bg-[rgba(6,182,212,0.2)] text-[#06B6D4] border-[#06B6D4]'
                  : 'text-[#64748B] hover:text-[#06B6D4] border-[rgba(15,23,42,0.1)] dark:border-[rgba(255,255,255,0.08)] bg-transparent'
              }`}
            >
              <Code size={15} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { void handleSend(e); } }}
              placeholder={isConnected ? 'Message the engineering team...' : 'Connecting…'}
              disabled={!isConnected}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#06B6D4] disabled:opacity-50 transition-colors"
            />

            <button
              type="submit"
              disabled={(!inputText.trim() && !codeInputText.trim()) || isSending || !isConnected}
              className="px-5 py-2.5 rounded-2xl bg-[#06B6D4] hover:bg-[#0891B2] disabled:opacity-40 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              <span className="hidden sm:inline">{isSending ? 'Sending' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
