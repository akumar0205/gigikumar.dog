import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Treat {
  id: number;
  angle: number;
}

let treatIdCounter = 0;

export default function TreatCounter() {
  const [treatCount, setTreatCount] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('gigi-treats') || '0', 10);
  });
  const [flyingTreats, setFlyingTreats] = useState<Treat[]>([]);
  const [isWiggling, setIsWiggling] = useState(false);

  const handleGiveTreat = useCallback(() => {
    const newCount = treatCount + 1;
    setTreatCount(newCount);
    localStorage.setItem('gigi-treats', String(newCount));

    const newTreat: Treat = {
      id: treatIdCounter++,
      angle: Math.random() * 40 - 20,
    };
    setFlyingTreats((prev) => [...prev, newTreat]);

    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 600);

    setTimeout(() => {
      setFlyingTreats((prev) => prev.filter((t) => t.id !== newTreat.id));
    }, 1200);
  }, [treatCount]);

  const treatEmojis = ['🦴', '🥩', '🍖', '🧇', '🥓'];
  const displayTreats = treatEmojis.slice(0, Math.min(treatCount, 5));
  const overflow = treatCount > 5;

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
      <h2 className="mb-2 font-mono text-sm tracking-[0.3em] uppercase text-cream/50">
        Section 2
      </h2>
      <h3 className="mb-8 font-mono text-xl tracking-widest text-gold md:text-2xl">
        GIVE GIGI A TREAT
      </h3>

      <div className="relative mb-8">
        <AnimatePresence>
          {flyingTreats.map((treat) => (
            <motion.div
              key={treat.id}
              className="absolute left-1/2 top-1/2 z-20 text-4xl"
              initial={{ opacity: 1, scale: 0.3, x: '-50%', y: '-50%' }}
              animate={{
                opacity: 0,
                scale: 1.5,
                y: '-400%',
                x: `calc(-50% + ${treat.angle}px)`,
                rotate: treat.angle * 5,
              }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              🦴
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          onClick={handleGiveTreat}
          className="group relative rounded-full bg-gradient-to-br from-gold to-amber-600 px-10 py-5 font-mono text-lg font-bold tracking-widest text-dark shadow-lg shadow-gold/20 transition-transform duration-100 hover:scale-105 hover:shadow-xl hover:shadow-gold/30 active:scale-95"
          animate={isWiggling ? { rotate: [0, -3, 3, -2, 2, 0] } : {}}
          transition={isWiggling ? { duration: 0.6 } : {}}
        >
          <span className="relative z-10">GIVE TREAT 🦴</span>
        </motion.button>
      </div>

      <motion.div
        className="text-center"
        key={treatCount}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-mono text-sm tracking-widest text-cream/60">
          <span className="text-gold">{treatCount}</span>{' '}
          {treatCount === 1 ? 'treat' : 'treats'} given
        </p>

        {treatCount > 0 && (
          <div className="mt-4 flex items-center justify-center gap-1 text-2xl">
            {displayTreats.map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
              >
                {emoji}
              </motion.span>
            ))}
            {overflow && (
              <span className="font-mono text-sm text-cream/40">
                +{treatCount - 5}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {treatCount >= 10 && treatCount < 20 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-mono text-xs tracking-wider text-gold/60"
        >
          Gigi is enjoying the treats! 🐶
        </motion.p>
      )}
      {treatCount >= 20 && treatCount < 50 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-mono text-xs tracking-wider text-gold/60"
        >
          That{"'"}s a lot of treats... Gigi approves 🐾
        </motion.p>
      )}
      {treatCount >= 50 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-mono text-xs tracking-wider text-gold/60"
        >
          Gigi has entered a food coma. Still accepting treats. 😴🦴
        </motion.p>
      )}
    </section>
  );
}