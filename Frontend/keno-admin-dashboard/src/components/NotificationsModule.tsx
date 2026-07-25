import React, { useState } from 'react';
import { useAdminStore } from '../store/useStore';
import { Bell, Send, Clock, HelpCircle, Users, Radio, AlertOctagon, Info } from 'lucide-react';
import { NotificationAnnouncement } from '../types';

interface NotificationsModuleProps {
  notifications: NotificationAnnouncement[];
  onSubmitNotification: (notif: { title: string; content: string; target: string; channel: string; status: string; scheduledAt?: string }) => Promise<void>;
  isLoading: boolean;
}

export const NotificationsModule: React.FC<NotificationsModuleProps> = ({
  notifications, onSubmitNotification, isLoading
}) => {
  const { addToast } = useAdminStore();

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('all');
  const [channel, setChannel] = useState('telegram');
  const [status, setStatus] = useState('sent');
  const [scheduledDate, setScheduledDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      addToast('Validation', 'Please supply both a title and message content.', 'error');
      return;
    }

    try {
      await onSubmitNotification({
        title,
        content,
        target,
        channel,
        status,
        scheduledAt: status === 'scheduled' ? scheduledDate : undefined
      });

      // Clear forms
      setTitle('');
      setContent('');
      addToast('Broadcast Dispatched', `Published announcement to channel: ${channel.toUpperCase()}`, 'success');
    } catch (err) {
      addToast('Error', 'Failed to publish announcement.', 'error');
    }
  };

  return (
    <div id="notifications-module" className="space-y-6 select-none animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">Announcement Centre</h2>
        <p className="text-xs text-slate-400">Broadcast maintenance alarms, jackpot releases, and promotional messages directly to user interfaces or Telegram channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Composer Form (Left/Center) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl space-y-4">
          <div className="border-b border-slate-900 pb-3 flex items-center space-x-1.5">
            <Send className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">Broadcast Composer</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Message Subject / Title</label>
              <input
                type="text"
                placeholder="e.g. 🎁 Active Bounty Weekend! Claim 5 TON..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Message Content (Markdown Supported)</label>
              <textarea
                rows={4}
                placeholder="Compose announcement body here. Broadcasts to @KenoGoldBot or direct push notifications..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Target Segment</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 cursor-pointer focus:outline-none"
                >
                  <option value="all">All Registered Players</option>
                  <option value="active_today">Active Today Only</option>
                  <option value="high_rollers">VIP High Rollers</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Dispatch Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 cursor-pointer focus:outline-none"
                >
                  <option value="telegram">Telegram @KenoGoldBot Channel</option>
                  <option value="push">Direct Mobile Push Alert</option>
                  <option value="in_app">In-App Banner Notifications</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Dispatch Method</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 cursor-pointer focus:outline-none"
                >
                  <option value="sent">Immediate Broadcast (Send Now)</option>
                  <option value="scheduled">Scheduled Timer Dispatch</option>
                </select>
              </div>
            </div>

            {status === 'scheduled' && (
              <div className="animate-in slide-in-from-top-1.5 duration-100">
                <label className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Schedule Timestamp (UTC)</label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all duration-150"
            >
              <Send className="w-3.5 h-3.5 fill-slate-100" />
              <span>{isLoading ? 'Dispatching Broadcast...' : status === 'scheduled' ? 'Schedule Broadcast' : 'Dispatch Broadcast Now'}</span>
            </button>
          </form>
        </div>

        {/* Live Outgoing campaigns list */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-xl space-y-4">
          <div className="border-b border-slate-900 pb-2">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Outgoing Campaigns</h3>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[360px] scrollbar-thin">
            {notifications.map((n) => (
              <div key={n.id} className="p-3.5 bg-slate-900/30 border border-slate-900 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${
                    n.channel === 'telegram' ? 'bg-blue-950/20 text-blue-400 border border-blue-900/30' :
                    n.channel === 'push' ? 'bg-purple-950/20 text-purple-400 border border-purple-900/30' :
                    'bg-amber-950/20 text-amber-400 border border-amber-900/30'
                  }`}>
                    {n.channel}
                  </span>
                  
                  <span className="text-[9px] text-slate-500">{n.sentAt ? 'Sent' : 'Scheduled'}</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-200 text-[11px] font-sans leading-snug">{n.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal truncate">{n.content}</p>
                </div>

                <div className="flex justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-900/40">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Target: {n.target}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 
                    {n.sentAt ? new Date(n.sentAt).toLocaleTimeString() : new Date(n.scheduledAt || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
