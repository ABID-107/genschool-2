"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { getNoticesByAudience, NOTICE_CATEGORIES, NOTICE_PRIORITIES, type Notice } from "@/lib/noticeStore";
import { Paperclip } from "lucide-react";

export function NoticesView() {
  const { lang, t } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const studentClass = 5;
    setNotices(getNoticesByAudience('students', studentClass));
  }, []);

  const categoryColor = (cat: string) => {
    const map: Record<string, string> = {
      exam: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
      holiday: 'bg-[var(--color-error-bg)] text-[var(--color-error)]',
      academic: 'bg-[var(--green-100)] text-[var(--brand-deep)]',
      emergency: 'bg-[var(--color-error-bg)] text-[var(--color-error)]',
      general: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
      finance: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
      event: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
      sports: 'bg-[var(--color-info-bg)] text-[var(--color-info)]',
    };
    return map[cat] || 'bg-[var(--green-100)] text-[var(--brand-deep)]';
  };

  const priorityIcon = (p: string) => {
    const map: Record<string, string> = {
      urgent: '🔴',
      high: '🟠',
      medium: '🔵',
      low: '⚪',
    };
    return map[p] || '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[var(--text-primary)] font-bangla">
            {lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}
          </h3>
          {notices.length > 0 && (
            <span className="text-xs text-[var(--text-muted)]">{notices.length} notice{notices.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        {notices.length === 0 ? (
          <div className="text-center py-8 text-sm text-[var(--text-muted)]">
            {lang === 'bn' ? 'কোনো নোটিশ নেই।' : 'No notices available.'}
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map(notice => (
              <div key={notice.id} className={`p-5 rounded-2xl border transition-all hover:shadow-md cursor-pointer group ${notice.priority === 'urgent' ? 'bg-[var(--color-error-bg)] border-[var(--color-error)]/20' : notice.priority === 'high' ? 'bg-[var(--color-warning-bg)]/30 border-[var(--color-warning)]/20' : 'bg-[var(--bg-secondary)] border-[var(--border-light)]'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${categoryColor(notice.category)}`}>
                      {NOTICE_CATEGORIES.find(c => c.value === notice.category)?.label || notice.category}
                    </span>
                    {notice.priority === 'urgent' && (
                      <span className="text-[10px] font-bold text-[var(--color-error)]">URGENT</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] font-bangla">
                    {new Date(notice.publishDate).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-[var(--text-primary)] font-bangla group-hover:text-[var(--brand-primary)] transition-colors mb-1">
                  {notice.title}
                </h4>
                {notice.description && (
                  <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{notice.description}</p>
                )}
                {notice.attachments.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-[var(--color-info)]">
                    <Paperclip size={14} />
                    {notice.attachments.length} attachment{notice.attachments.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

