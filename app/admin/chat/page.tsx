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
import {
  MessageSquare,
  Send,
  Code,
  CheckCheck,
  Loader2,
  Circle,
  WifiOff,
  Users,
  Search,
} from 'lucide-react';

// ─── Admin identity ───────────────────────────────────────────────────────────
const ADMIN_ID     = 'admin';
const ADMIN_NAME   = 'DevZite Support';
const ADMIN_AVATAR = '👨‍💻';

interface ClientEntry {
  clientId: string;
  name: string;
  online: boolean;
  updatedAt: number;
  lastMessage?: string;
  unread: number;
}

export default function AdminChatPage() {
  const [clients, setClients]             = useState<ClientEntry[]>([]);
  const [activeClient, setActiveClient]   = useState<ClientEntry | null>(null);
  const [messages, setMessages]           = useState<RtdbMessage[]>([]);
  const [inputText, setInputText]         = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInputText, setCodeInputText] = useState('');
  const [clientTyping, setClientTyping]   = useState(false);
  const [isConnected, setIsConnected]     = useState(true);
  const [isSending, setIsSending]         = useState(false);
  const [search, setSearch]               = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // ── Admin presence + connection ────────────────────────────────────────────
  useEffect(() => {
    const db = rtdb;
    if (!db) { setIsConnected(false); return; }
    const connRef = ref(db, '.info/connected');
    const unsub = onValue(connRef, (snap) => {
      const connected = snap.val() === true;
      setIsConnected(connected);
      if (connected) {
        const presRef = ref(db, `presence/${ADMIN_ID}`);
        void set(presRef, { online: true, name: ADMIN_NAME, role: 'admin', updatedAt: Date.now() });
        void onDisconnect(presRef).set({ online: false, name: ADMIN_NAME, role: 'admin', updatedAt: Date.now() });
      }
    });
    return () => off(connRef, 'value', unsub);
  }, []);

  // ── Watch all client presences to build the sidebar list ──────────────────
  useEffect(() => {
    const db = rtdb;
    if (!db) return;
    const presRef = ref(db, 'presence');
    const unsub = onValue(presRef, (snap) => {
      const entries: ClientEntry[] = [];
      snap.forEach((child) => {
        const data = child.val();
        // Only show client accounts in sidebar
        if (data.role === 'client') {
          entries.push({
            clientId:  child.key!,
            name:      data.name || child.key!,
            online:    data.online === true,
            updatedAt: data.updatedAt || 0,
            unread:    0,
          });
        }
      });
      setClients((prev) => {
        // Preserve unread counts from previous state
        return entries.map((e) => {
          const existing = prev.find((p) => p.clientId === e.clientId);
          return { ...e, unread: existing?.unread ?? 0, lastMessage: existing?.lastMessage };
        });
      });
    });
    return () => off(presRef, 'value', unsub);
  }, []);

  // ── Watch last messages + unread for each client in sidebar ───────────────
  useEffect(() => {
    const db = rtdb;
    if (!db || clients.length === 0) return;
    const unsubs: (() => void)[] = [];

    clients.forEach(({ clientId }) => {
      const msgsRef = query(
        ref(db, `chat/${clientId}/messages`),
        orderByChild('createdAt'),
        limitToLast(20),
      );
      const unsub = onValue(msgsRef, (snap) => {
        let unread = 0;
        let lastMessage = '';
        snap.forEach((child) => {
          const msg = child.val() as RtdbMessage;
          lastMessage = msg.text;
          if (msg.senderRole === 'client' && !msg.readBy?.[ADMIN_ID]) unread++;
        });
        setClients((prev) =>
          prev.map((c) => c.clientId === clientId ? { ...c, unread, lastMessage } : c),
        );
      });
      unsubs.push(() => off(msgsRef, 'value', unsub));
    });

    return () => unsubs.forEach((fn) => fn());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients.length]);

  // ── Load messages for active client ──────────────────────────────────────
  useEffect(() => {
    const db = rtdb;
    if (!db || !activeClient) return;
    const msgsRef = query(
      ref(db, `chat/${activeClient.clientId}/messages`),
      orderByChild('createdAt'),
      limitToLast(80),
    );
    const unsub = onValue(msgsRef, (snap) => {
      const raw: RtdbMessage[] = [];
      snap.forEach((child) => { raw.push({ id: child.key!, ...child.val() }); });
      setMessages(raw);
      // Mark client msgs as read by admin
      raw.forEach((msg) => {
        if (msg.senderRole === 'client' && !msg.readBy?.[ADMIN_ID]) {
          void update(ref(db, `chat/${activeClient.clientId}/messages/${msg.id}/readBy`), {
            [ADMIN_ID]: true,
          });
        }
      });
    });
    return () => off(msgsRef, 'value', unsub);
  }, [activeClient]);

  // ── Client typing indicator ───────────────────────────────────────────────
  useEffect(() => {
    const db = rtdb;
    if (!db || !activeClient) return;
    const typRef = ref(db, `chat/${activeClient.clientId}/typing/${activeClient.clientId}`);
    const unsub = onValue(typRef, (snap) => setClientTyping(snap.val()?.isTyping === true));
    return () => off(typRef, 'value', unsub);
  }, [activeClient]);

  // ── Admin typing ──────────────────────────────────────────────────────────
  const updateAdminTyping = useCallback((isTyping: boolean) => {
    const db = rtdb;
    if (!db || !activeClient) return;
    void set(ref(db, `chat/${activeClient.clientId}/typing/${ADMIN_ID}`), {
      userId: ADMIN_ID, name: ADMIN_NAME, isTyping, updatedAt: Date.now(),
    });
  }, [activeClient]);

  const handleInputChange = (val: string) => {
    setInputText(val);
    updateAdminTyping(true);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => updateAdminTyping(false), 2000));
  };

  // ── Select a client ───────────────────────────────────────────────────────
  const selectClient = (client: ClientEntry) => {
    setActiveClient(client);
    setMessages([]);
    setInputText('');
    setShowCodeInput(false);
  };

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const db = rtdb;
    if ((!inputText.trim() && !codeInputText.trim()) || isSending || !db || !activeClient) return;
    setIsSending(true);
    updateAdminTyping(false);
    if (typingTimeout) clearTimeout(typingTimeout);
    try {
      await push(ref(db, `chat/${activeClient.clientId}/messages`), {
        channelId:    activeClient.clientId,
        senderId:     ADMIN_ID,
        senderName:   ADMIN_NAME,
        senderRole:   'admin',
        senderAvatar: ADMIN_AVATAR,
        text:         inputText.trim() || 'Attached code snippet:',
        codeSnippet:  codeInputText.trim() || null,
        createdAt:    serverTimestamp(),
        readBy:       { [ADMIN_ID]: true },
      });
      setInputText('');
      setCodeInputText('');
      setShowCodeInput(false);
    } finally {
      setIsSending(false);
    }
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4] font-bold uppercase tracking-wider mb-1">
            <MessageSquare size={14} />
            <span>Admin — Client Messenger</span>
          </div>
          <h2 className="text-xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Client Chat Inbox
          </h2>
        </div>
        {isConnected ? (
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[rgba(6,182,212,0.12)] text-[#06B6D4] border border-[rgba(6,182,212,0.3)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
            RTDB Live
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[rgba(239,68,68,0.12)] text-[#EF4444] border border-[rgba(239,68,68,0.3)] flex items-center gap-1.5">
            <WifiOff size={12} /> Disconnected
          </span>
        )}
      </div>

      {/* Main layout */}
      <div
        className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] overflow-hidden shadow-xl"
        style={{ maxHeight: '620px' }}
      >
        {/* ── Client List Sidebar ── */}
        <div className="lg:col-span-4 border-r border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.06)] flex flex-col bg-slate-50/60 dark:bg-[#0C0D14]">
          {/* Search */}
          <div className="p-3 border-b border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              <Search size={13} className="text-[#94A3B8] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="flex-1 text-xs font-mono bg-transparent text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none"
              />
            </div>
          </div>

          {/* List header */}
          <div className="px-4 py-2 flex items-center gap-2">
            <Users size={12} className="text-[#64748B]" />
            <span className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Clients ({filteredClients.length})
            </span>
          </div>

          {/* Client rows */}
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            onWheel={(e) => e.stopPropagation()}
            className="lenis-prevent flex-1 min-h-0 overflow-y-auto"
          >
            {filteredClients.length === 0 && (
              <div className="px-4 py-8 text-center opacity-50">
                <Users size={28} className="text-[#64748B] mx-auto mb-2" />
                <p className="text-xs font-mono text-[#64748B]">No clients yet</p>
              </div>
            )}

            {filteredClients.map((client) => (
              <button
                key={client.clientId}
                onClick={() => selectClient(client)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-[rgba(15,23,42,0.05)] dark:border-[rgba(255,255,255,0.04)] cursor-pointer ${
                  activeClient?.clientId === client.clientId
                    ? 'bg-[rgba(6,182,212,0.1)] dark:bg-[rgba(6,182,212,0.08)]'
                    : 'hover:bg-[rgba(6,182,212,0.05)] dark:hover:bg-[rgba(6,182,212,0.04)]'
                }`}
              >
                {/* Avatar / initial */}
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center text-white font-display font-black text-base shrink-0 shadow-sm select-none">
                  {client.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display font-bold text-xs text-[#0F172A] dark:text-[#F8FAFC] truncate">
                      {client.name}
                    </span>
                    {client.unread > 0 && activeClient?.clientId !== client.clientId && (
                      <span className="w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {client.unread > 9 ? '9+' : client.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${client.online ? 'bg-[#27C93F]' : 'bg-[#64748B]'}`} />
                    <span className="text-[10px] font-mono text-[#64748B] truncate">
                      {client.lastMessage || (client.online ? 'Online' : 'Offline')}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat Panel ── */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0C0D14]">

          {/* No client selected */}
          {!activeClient && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
              <MessageSquare size={48} className="text-[#06B6D4]" />
              <div className="text-center">
                <p className="font-display font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">
                  Select a client to start chatting
                </p>
                <p className="text-xs font-mono text-[#64748B] mt-1">
                  Client conversations appear on the left
                </p>
              </div>
            </div>
          )}

          {activeClient && (
            <>
              {/* Chat header */}
              <div className="px-5 py-3.5 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#8B5CF6] flex items-center justify-center text-white font-display font-black text-sm shadow-sm select-none">
                    {activeClient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] leading-tight">
                      {activeClient.name}
                    </p>
                    <p className={`text-[10px] font-mono ${clientTyping ? 'text-[#06B6D4]' : activeClient.online ? 'text-[#27C93F]' : 'text-[#64748B]'}`}>
                      {clientTyping ? '✏️ typing...' : activeClient.online ? '● Online' : '○ Offline'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#64748B]">
                  #{activeClient.clientId}
                </span>
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
                  <div className="h-full flex flex-col items-center justify-center gap-3 py-12 opacity-50">
                    <MessageSquare size={32} className="text-[#06B6D4]" />
                    <p className="text-xs font-mono text-[#64748B]">No messages yet with {activeClient.name}</p>
                  </div>
                )}

                {messages.map((msg) => {
                  const isAdminMsg = msg.senderRole === 'admin';
                  return (
                    <div key={msg.id} className={`flex items-end gap-2.5 ${isAdminMsg ? 'flex-row-reverse ml-auto' : ''} max-w-[82%]`}>
                      <div className="w-8 h-8 rounded-2xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-base shrink-0 shadow-sm select-none">
                        {msg.senderAvatar}
                      </div>

                      <div className={`space-y-1 min-w-0 flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-2 text-[10px] font-mono text-[#64748B] ${isAdminMsg ? 'flex-row-reverse' : ''}`}>
                          <span className="font-bold text-[#0F172A] dark:text-[#94A3B8] truncate">{msg.senderName}</span>
                          <span className="shrink-0">
                            {msg.createdAt
                              ? new Date(msg.createdAt as number).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : '—'}
                          </span>
                        </div>

                        <div className={`px-4 py-2.5 rounded-2xl text-xs font-body leading-relaxed shadow-sm max-w-full ${
                          isAdminMsg
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

                        {isAdminMsg && (
                          <div className="flex items-center gap-1">
                            {msg.readBy?.[activeClient.clientId]
                              ? <CheckCheck size={12} className="text-[#06B6D4]" />
                              : <Circle size={10} className="text-[#94A3B8]" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Client typing */}
                {clientTyping && (
                  <div className="flex items-end gap-2.5 max-w-[82%]">
                    <div className="w-8 h-8 rounded-2xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-base shrink-0">
                      {activeClient.name.charAt(0)}
                    </div>
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
                      placeholder="Paste code here..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-[#60A5FA] outline-none resize-none"
                    />
                  </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(!showCodeInput)}
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
                    placeholder={`Reply to ${activeClient.name}...`}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
