import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dispatchMessages = [
  'Gigi is on her way! 🐾',
  'Dispatching Gigi to the scene... 🚨',
  'Gigi has been alerted. Fun will be stopped. 🐕',
  'Unit K9-GIGI en route. Estimated arrival: immediately. 🏃‍♀️',
  'Gigi is suiting up. No fun shall survive. 👮‍♀️',
  'Backup requested. Gigi is already there. 🐾',
  'Gigi is sprinting to intercept the fun. 🐺',
  'Fun detected. Gigi deploying. 🎯',
  'Gigi has locked onto the fun. It won\'t last. 🔒',
  'All units: Gigi is handling this one personally. 🚔',
];

export default function FunPoliceBadge() {
  const [funStopped, setFunStopped] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('gigi-fun-stopped') || '0', 10);
  });
  const [sirenActive, setSirenActive] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchMsg, setDispatchMsg] = useState('');
  const [sirenBurst, setSirenBurst] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSirenActive((prev) => !prev);
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleReportFun = () => {
    const newCount = funStopped + 1;
    setFunStopped(newCount);
    localStorage.setItem('gigi-fun-stopped', String(newCount));

    setSirenBurst(true);
    setTimeout(() => setSirenBurst(false), 1500);

    setDispatching(true);
    setDispatchMsg(dispatchMessages[Math.floor(Math.random() * dispatchMessages.length)]);
    setTimeout(() => setDispatching(false), 2500);
  };

  const badgeItems = [
    { label: 'Name', value: 'Gigi Kumar' },
    { label: 'Title', value: 'Chief, Fun Police Dept.' },
    { label: 'Badge #', value: '#K9-GIGI-001' },
    { label: 'Status', value: 'On Duty', highlight: true },
    { label: 'Specialties', value: 'Barking at nothing, Sitting on laps during important meetings, Chasing squirrels and birds, Stopping fun professionally' },
  ];

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-1/2 top-0 h-full w-1/3"
          style={{
            opacity: sirenBurst ? 0.12 : 0.03,
            background: sirenActive
              ? 'linear-gradient(90deg, transparent, var(--color-siren-red), transparent)'
              : 'linear-gradient(90deg, transparent, var(--color-siren-blue), transparent)',
            transition: 'opacity 0.15s ease',
          }}
        />
        <div
          className="absolute -right-1/2 top-0 h-full w-1/3"
          style={{
            opacity: sirenBurst ? 0.12 : 0.03,
            background: sirenActive
              ? 'linear-gradient(90deg, transparent, var(--color-siren-blue), transparent)'
              : 'linear-gradient(90deg, transparent, var(--color-siren-red), transparent)',
            transition: 'opacity 0.15s ease',
          }}
        />
      </div>

      {sirenBurst && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0, 0.3, 0, 0.2, 0] }}
          transition={{ duration: 1.5 }}
          style={{
            background: 'radial-gradient(circle at center, var(--color-siren-red), transparent 70%)',
          }}
        />
      )}

      <h3 className="mb-10 font-mono text-xl tracking-widest text-gold md:text-2xl">
        FUN POLICE DEPARTMENT
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-lg rounded-2xl border border-cream/10 bg-dark-card p-8 shadow-2xl shadow-black/40 md:p-10"
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="relative flex items-center justify-center rounded-full bg-dark-card px-4 py-1">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gold/10" />
            <span className="relative font-mono text-xs tracking-[0.3em] uppercase text-gold">
              OFFICIAL BADGE
            </span>
          </div>
        </div>

        <div className="mb-6 mt-4 flex items-center gap-4 border-b border-cream/10 pb-6">
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-gold/30">
            <img
              src="/images/gigi3.jpg"
              alt="Chief Gigi - Mugshot"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-mono text-lg font-bold tracking-wider text-cream">
              FUN POLICE
            </p>
            <p className="font-mono text-xs tracking-widest text-cream/40">
              DEPARTMENT — EST. BIRTH
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {badgeItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 md:flex-row md:gap-4">
              <span className="font-mono text-xs tracking-widest uppercase text-cream/40 md:w-28 md:flex-shrink-0">
                {item.label}
              </span>
              <span
                className={`font-mono text-sm tracking-wide ${
                  item.highlight
                    ? 'font-bold text-green-400'
                    : 'text-cream/80'
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-cream/10 pt-6">
          <motion.button
            onClick={handleReportFun}
            className="group relative overflow-hidden rounded-lg border border-siren-red/30 bg-siren-red/10 px-6 py-3 font-mono text-xs tracking-widest uppercase text-siren-red transition-all hover:border-siren-red/50 hover:bg-siren-red/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">🚨 Report Fun — Gigi is On Her Way</span>
          </motion.button>

          <AnimatePresence mode="wait">
            {dispatching ? (
              <motion.div
                key="dispatch"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 1 }}
                  className="text-lg"
                >
                  🐾
                </motion.span>
                <span className="font-mono text-xs tracking-wider text-gold">
                  {dispatchMsg}
                </span>
              </motion.div>
            ) : (
              <motion.p
                key="counter"
                className="font-mono text-xs text-cream/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Fun reported{' '}
                <span className="text-siren-red">{funStopped}</span>{' '}
                {funStopped === 1 ? 'time' : 'times'} — Gigi stopped it every time
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest text-cream/10">
          VOID WHERE PROHIBITED
        </div>
      </motion.div>

      <p className="mt-8 max-w-md text-center font-mono text-xs leading-relaxed text-cream/30">
        Gigi takes her job very seriously. No fun goes unstopped. No lap goes unsat upon. No squirrel or bird goes unchased.
      </p>
    </section>
  );
}