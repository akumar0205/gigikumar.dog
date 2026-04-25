import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function FunPoliceBadge() {
  const [funStopped, setFunStopped] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('gigi-fun-stopped') || '0', 10);
  });
  const [sirenActive, setSirenActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSirenActive((prev) => !prev);
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleFunStopped = () => {
    const newCount = funStopped + 1;
    setFunStopped(newCount);
    localStorage.setItem('gigi-fun-stopped', String(newCount));
  };

  const badgeItems = [
    { label: 'Name', value: 'Gigi Kumar' },
    { label: 'Title', value: 'Chief, Fun Police Dept.' },
    { label: 'Badge #', value: '#K9-GIGI-001' },
    { label: 'Status', value: 'On Duty', highlight: true },
    { label: 'Specialties', value: 'Barking at nothing, Sitting on laps during important meetings, Confiscating squeaky toys, Stopping fun professionally' },
  ];

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-1/2 top-0 h-full w-1/3 opacity-[0.03]"
          style={{
            background: sirenActive
              ? 'linear-gradient(90deg, transparent, var(--color-siren-red), transparent)'
              : 'linear-gradient(90deg, transparent, var(--color-siren-blue), transparent)',
          }}
        />
        <div
          className="absolute -right-1/2 top-0 h-full w-1/3 opacity-[0.03]"
          style={{
            background: sirenActive
              ? 'linear-gradient(90deg, transparent, var(--color-siren-blue), transparent)'
              : 'linear-gradient(90deg, transparent, var(--color-siren-red), transparent)',
          }}
        />
      </div>

      <h2 className="mb-2 font-mono text-sm tracking-[0.3em] uppercase text-cream/50">
        Section 3
      </h2>
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
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-gold/5 ring-2 ring-gold/30">
            <span className="text-4xl">🐕‍🦺</span>
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
            onClick={handleFunStopped}
            className="group relative overflow-hidden rounded-lg border border-siren-red/30 bg-siren-red/10 px-6 py-3 font-mono text-xs tracking-widest uppercase text-siren-red transition-all hover:border-siren-red/50 hover:bg-siren-red/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">🚨 Report Fun Stopped</span>
          </motion.button>

          <motion.p
            className="font-mono text-xs text-cream/40"
            key={funStopped}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Fun stopped{' '}
            <span className="text-siren-red">{funStopped}</span>{' '}
            {funStopped === 1 ? 'time' : 'times'} today
          </motion.p>
        </div>

        <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest text-cream/10">
          VOID WHERE PROHIBITED
        </div>
      </motion.div>

      <p className="mt-8 max-w-md text-center font-mono text-xs leading-relaxed text-cream/30">
        Gigi takes her job very seriously. No fun goes unstopped. No lap goes unsat upon. No squeaky toy survives confiscation.
      </p>
    </section>
  );
}