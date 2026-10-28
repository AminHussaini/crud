import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';


const EXAMS = [
  { code: 'MGT-3003', course: 'Introduction to Management', date: '2026-10-16' },
  { code: 'MATH-3001', course: 'Pre-Calculus I', date: '2026-10-19' },
  { code: 'MATH-3004', course: 'Calculus-I', date: '2026-10-22' },
  { code: 'MATH-3005', course: 'Discrete Mathematics', date: '2026-10-26' },
  { code: 'ENGL-3001', course: 'Functional English', date: '2026-10-27' },
  { code: 'CS-3002', course: 'Computer Programming', date: '2026-10-30' },
  { code: 'CS-3003', course: 'App of Info & Comm Technologies', date: '2026-10-31' },
  // { code: 'CS-3002', course: 'Computer Programming', date: '2026-10-27' },
  // { code: 'CS-3003', course: 'App of Info & Comm Technologies', date: '2026-10-28' },
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
    // Total hours (no days), e.g. 1 day 21 h -> 45 h
    hours: Math.floor(total / 3600),
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

const PARTY_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const random = (min, max) => min + Math.random() * (max - min);

// How long each celebration stays on screen
const CELEBRATION_MS = { single: 7000, final: 11000 };

// Fireworks bursting + balloons rising + confetti falling over the whole screen.
// `final` = all papers over: double the party and a bigger message.
const Celebration = ({ course, final }) => {
  // Random layout is generated once per mount (parent re-mounts it via key)
  const [pieces] = useState(() => ({
    balloons: Array.from({ length: final ? 32 : 16 }, (_, i) => ({
      left: random(0, 94),
      delay: random(0, final ? 4 : 1.5),
      duration: random(4.5, 6.5),
      size: random(40, final ? 75 : 60),
      color: PARTY_COLORS[i % PARTY_COLORS.length],
    })),
    confetti: Array.from({ length: final ? 200 : 90 }, (_, i) => ({
      left: random(0, 100),
      delay: random(0, final ? 5 : 2),
      duration: random(2.5, 4.5),
      width: random(6, 10),
      height: random(10, 16),
      color: PARTY_COLORS[i % PARTY_COLORS.length],
    })),
    fireworks: Array.from({ length: final ? 14 : 6 }, (_, i) => ({
      x: random(10, 90),
      y: random(10, 45),
      delay: random(0, final ? 7 : 4),
      color: PARTY_COLORS[i % PARTY_COLORS.length],
      // Sparks fly out evenly in a circle, each with a slightly different reach
      sparks: Array.from({ length: 24 }, (_, j) => {
        const angle = (j / 24) * Math.PI * 2;
        const distance = random(final ? 100 : 80, final ? 170 : 130);
        return { dx: Math.cos(angle) * distance, dy: Math.sin(angle) * distance };
      }),
    })),
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes balloonRise {
          0%   { transform: translate(0, 0) rotate(-4deg); }
          50%  { transform: translate(24px, -60vh) rotate(4deg); }
          100% { transform: translate(-12px, -130vh) rotate(-4deg); }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.7; }
        }
        @keyframes popIn {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fireworkRocket {
          0%   { transform: translateY(100vh); opacity: 1; }
          100% { transform: translateY(0); opacity: 0; }
        }
        @keyframes fireworkSpark {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translate(var(--dx), calc(var(--dy) + 40px)) scale(0.3); opacity: 0; }
        }
      `}</style>

      {pieces.fireworks.map((f, i) => (
        <div key={`f${i}`} style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%` }}>
          {/* Rocket trail shooting up to the burst point */}
          <div style={{
            position: 'absolute', width: '4px', height: '16px', marginLeft: '-2px', borderRadius: '2px',
            background: `linear-gradient(to top, transparent, ${f.color})`,
            opacity: 0, animation: `fireworkRocket 0.8s ease-out ${f.delay}s forwards`,
          }} />
          {f.sparks.map((s, j) => (
            <div key={j} style={{
              position: 'absolute', width: '6px', height: '6px', margin: '-3px 0 0 -3px', borderRadius: '50%',
              backgroundColor: f.color, boxShadow: `0 0 8px 2px ${f.color}`,
              '--dx': `${s.dx}px`, '--dy': `${s.dy}px`,
              opacity: 0, animation: `fireworkSpark 1.3s ease-out ${f.delay + 0.8}s forwards`,
            }} />
          ))}
        </div>
      ))}

      {pieces.confetti.map((c, i) => (
        <div key={`c${i}`} style={{
          position: 'absolute', top: 0, left: `${c.left}%`,
          width: `${c.width}px`, height: `${c.height}px`, backgroundColor: c.color, borderRadius: '2px',
          transform: 'translateY(-10vh)',
          animation: `confettiFall ${c.duration}s ease-in ${c.delay}s forwards`,
        }} />
      ))}

      {pieces.balloons.map((b, i) => (
        <div key={`b${i}`} style={{
          position: 'absolute', bottom: '-120px', left: `${b.left}%`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: `balloonRise ${b.duration}s ease-in ${b.delay}s forwards`,
        }}>
          <div style={{
            width: `${b.size}px`, height: `${b.size * 1.25}px`, backgroundColor: b.color,
            borderRadius: '50% 50% 50% 50% / 45% 45% 55% 55%',
            boxShadow: 'inset -6px -8px 0 rgba(0,0,0,0.12), inset 6px 6px 0 rgba(255,255,255,0.25)',
          }} />
          <div style={{
            width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderBottom: `7px solid ${b.color}`, marginTop: '-2px',
          }} />
          <div style={{ width: '1px', height: '50px', backgroundColor: '#9ca3af' }} />
        </div>
      ))}

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{
          padding: '24px 32px', borderRadius: '16px', backgroundColor: '#fff', textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)', animation: 'popIn 0.5s ease-out forwards',
        }}>
          {final ? (
            <>
              <div style={{ fontSize: '56px' }}>🎓🎉🥳</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#1f2937', marginTop: '8px' }}>Sare papers khatam!</div>
              <div style={{ fontSize: '16px', color: '#6b7280', marginTop: '6px' }}>
                {EXAMS.length} of {EXAMS.length} exams done — chhuttiyan mubarak! 🎈
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '48px' }}>🎉🎈🎉</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginTop: '8px' }}>Paper khatam!</div>
              <div style={{ fontSize: '15px', color: '#6b7280', marginTop: '4px' }}>{course} done ✓</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

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

  // { id, course, final } while the celebration is showing
  const [celebration, setCelebration] = useState(null);
  const prevDoneRef = useRef(null);

  // Exam scheduled for today's calendar date, if any
  const todayExam = now === null ? null : EXAMS.find(
    (e) => new Date(e.start).toDateString() === new Date(now).toDateString()
  );
  const todayStatus = todayExam ? getStatus(todayExam, now) : null;

  // Celebrate when an exam finishes while the page is open (big party after the last one).
  // On first load, also celebrate if today's exam has already ended.
  useEffect(() => {
    if (now === null) return;
    const isFirstTick = prevDoneRef.current === null;
    const justFinished = !isFirstTick && doneCount > prevDoneRef.current;
    const finishedToday = isFirstTick && todayStatus === 'done';
    if (justFinished || finishedToday) {
      const finished = justFinished ? EXAMS[doneCount - 1] : todayExam;
      setCelebration({
        id: Date.now(),
        course: finished.course,
        final: finished === EXAMS[EXAMS.length - 1],
      });
    }
    prevDoneRef.current = doneCount;
  }, [now, doneCount, todayExam, todayStatus]);

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(
      () => setCelebration(null),
      celebration.final ? CELEBRATION_MS.final : CELEBRATION_MS.single
    );
    return () => clearTimeout(timer);
  }, [celebration]);

  return (
    <>
      <Head>
        <title>Exam Countdown</title>
      </Head>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 16px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#1f2937' }}>Exam Countdown</h1>
            {/* <button
              onClick={() => setCelebration({ id: Date.now(), course: (shown || EXAMS[0]).course })}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff',
                fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
              }}
            >
              🎉 Demo
            </button>
            <button
              onClick={() => setCelebration({ id: Date.now(), final: true })}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff',
                fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
              }}
            >
              🎓 Final Demo
            </button> */}
          </div>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280' }}>
            {doneCount} of {EXAMS.length} exams completed
          </p>

          {todayExam && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', marginBottom: '16px',
              borderRadius: '12px', fontSize: '15px',
              ...(todayStatus === 'done'
                ? { backgroundColor: '#d1fae5', border: '1px solid #10b981', color: '#065f46' }
                : todayStatus === 'live'
                  ? { backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#7f1d1d' }
                  : { backgroundColor: '#fef3c7', border: '1px solid #f59e0b', color: '#78350f' }),
            }}>
              <span style={{ fontSize: '24px' }}>
                {todayStatus === 'done' ? '✅' : todayStatus === 'live' ? '✍️' : '📅'}
              </span>
              <div>
                <div style={{ fontWeight: '700' }}>
                  {todayStatus === 'done'
                    ? 'Aaj ka paper khatam!'
                    : todayStatus === 'live'
                      ? 'Paper chal raha hai — all the best! 🍀'
                      : 'Aaj paper hai!'}
                </div>
                <div style={{ fontSize: '13px', opacity: 0.85 }}>
                  {todayExam.course} ({todayExam.code}) · 14:00 – 17:00
                </div>
              </div>
            </div>
          )}

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
                    if (status === 'done') setCelebration({ id: Date.now(), course: exam.course });
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
      {celebration && <Celebration key={celebration.id} course={celebration.course} final={celebration.final} />}
    </>
  );
}

