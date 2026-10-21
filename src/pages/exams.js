import { useState, useEffect } from 'react';
import Head from 'next/head';

const EXAMS = [
  { code: 'MGT-3003', course: 'Introduction to Management', date: '2026-10-16' },
  { code: 'MATH-3001', course: 'Pre-Calculus I', date: '2026-10-19' },
  { code: 'MATH-3004', course: 'Calculus-I', date: '2026-10-22' },
  { code: 'MATH-3005', course: 'Discrete Mathematics', date: '2026-10-26' },
  { code: 'ENGL-3001', course: 'Functional English', date: '2026-10-27' },
  { code: 'CS-3002', course: 'Computer Programming', date: '2026-10-30' },
  { code: 'CS-3003', course: 'App of Info & Comm Technologies', date: '2026-10-31' },
].map((e) => ({
  ...e,
  // Local time, 14:00 - 17:00
  start: new Date(`${e.date}T14:00:00`).getTime(),
  end: new Date(`${e.date}T17:00:00`).getTime(),
}));

function getStatus(exam, now) {
  if (now >= exam.end) return 'done';
  if (now >= exam.start) return 'live';
  return 'upcoming';
}

function splitTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
}

const STATUS_STYLES = {
  done:     { bg: '#f3f4f6', text: '#6b7280', label: 'Done' },
  live:     { bg: '#fee2e2', text: '#b91c1c', label: 'In progress' },
  upcoming: { bg: '#dbeafe', text: '#1e40af', label: 'Upcoming' },
};

const TimeBox = ({ value, label }) => (
  <div style={{
    flex: '1 1 0', minWidth: '64px', padding: '14px 8px', borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.15)', textAlign: 'center',
  }}>
    <div style={{ fontSize: '34px', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
      {String(value).padStart(2, '0')}
    </div>
    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85 }}>
      {label}
    </div>
  </div>
);

export default function Exams() {
  // Start as null so server and client render the same markup
  const [now, setNow] = useState(null);
  // null = follow the nearest exam automatically
  const [selectedCode, setSelectedCode] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const next = now === null ? null : EXAMS.find((e) => now < e.end);
  const shown = selectedCode ? EXAMS.find((e) => e.code === selectedCode) : next;
  const shownStatus = shown && now !== null ? getStatus(shown, now) : null;
  const t = shown && now !== null ? splitTime((shownStatus === 'live' ? shown.end : shown.start) - now) : null;
  const doneCount = now === null ? 0 : EXAMS.filter((e) => now >= e.end).length;

  return (
    <>
      <Head>
        <title>Exam Countdown</title>
      </Head>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 16px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '700', color: '#1f2937' }}>Exam Countdown</h1>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280' }}>
            {doneCount} of {EXAMS.length} exams completed
          </p>

          <div style={{
            borderRadius: '14px', padding: '24px', marginBottom: '28px', color: '#fff',
            background: shownStatus === 'live'
              ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
              : shownStatus === 'done'
                ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                : 'linear-gradient(135deg, #2563eb, #4f46e5)',
            boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
          }}>
            {now === null ? (
              <div style={{ fontSize: '16px' }}>Loading…</div>
            ) : !shown ? (
              <div style={{ fontSize: '20px', fontWeight: '600' }}>🎉 All exams are over!</div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85 }}>
                    {shownStatus === 'live'
                      ? 'Exam in progress — ends in'
                      : shownStatus === 'done'
                        ? 'Exam completed'
                        : selectedCode ? 'Selected exam starts in' : 'Next exam starts in'}
                  </div>
                  {selectedCode && (
                    <button onClick={() => setSelectedCode(null)} style={{
                      padding: '5px 12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.5)',
                      background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '12px',
                    }}>
                      ← Next exam
                    </button>
                  )}
                </div>
                <div style={{ margin: '6px 0 2px', fontSize: '22px', fontWeight: '700' }}>{shown.course}</div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: shownStatus === 'done' ? 0 : '18px' }}>
                  {shown.code} · {formatDate(shown.start)} · 14:00 – 17:00
                </div>
                {shownStatus !== 'done' && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <TimeBox value={t.days} label="Days" />
                    <TimeBox value={t.hours} label="Hours" />
                    <TimeBox value={t.minutes} label="Minutes" />
                    <TimeBox value={t.seconds} label="Seconds" />
                  </div>
                )}
              </>
            )}
          </div>

          <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Date Sheet</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {EXAMS.map((exam) => {
              const status = now === null ? 'upcoming' : getStatus(exam, now);
              const s = STATUS_STYLES[status];
              const isShown = shown && exam.code === shown.code;
              // Calendar days between today and the exam date
              const daysLeft = now === null ? null : Math.round(
                (new Date(exam.start).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 86400000
              );
              return (
                <div
                  key={exam.code}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedCode(next && exam.code === next.code ? null : exam.code);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.currentTarget.click();
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                    flexWrap: 'wrap', padding: '14px 16px', borderRadius: '10px', backgroundColor: '#fff',
                    border: isShown ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    opacity: status === 'done' && !isShown ? 0.65 : 1,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{exam.course}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      {exam.code} · {formatDate(exam.start)} · 14:00 – 17:00
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {status === 'upcoming' && daysLeft !== null && (
                      <span style={{ fontSize: '13px', color: '#374151' }}>
                        {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days left`}
                      </span>
                    )}
                    <span style={{
                      padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: s.bg, color: s.text,
                    }}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
