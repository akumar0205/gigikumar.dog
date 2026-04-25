import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingTreat {
  id: number;
  emoji: string;
  angle: number;
  startX: number;
}

const treatMenu = [
  { emoji: '🦴', label: 'Bone', points: 1 },
  { emoji: '🥩', label: 'Steak', points: 5 },
  { emoji: '🥓', label: 'Bacon', points: 5 },
  { emoji: '🧀', label: 'Cheese', points: 2 },
  { emoji: '🥕', label: 'Carrot', points: 0.5 },
  { emoji: '🍕', label: 'Pizza', points: 3 },
];

const moodMessages = [
  { threshold: 0, msg: 'Gigi is watching... waiting...', face: '👀' },
  { threshold: 5, msg: "Gigi's tail is wagging!", face: '🐕' },
  { threshold: 15, msg: 'Gigi is VERY excited', face: '🤩' },
  { threshold: 30, msg: 'Gigi has entered maximum happiness mode', face: '🥳' },
  { threshold: 50, msg: 'Gigi has ascended to a higher plane of treats', face: '✨' },
];

function getMood(happiness: number) {
  let current = moodMessages[0];
  for (const m of moodMessages) {
    if (happiness >= m.threshold) current = m;
  }
  return current;
}

let flyingId = 0;

export default function TreatCounter() {
  const [treatCount, setTreatCount] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('gigi-treats') || '0', 10);
  });
  const [happiness, setHappiness] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseFloat(localStorage.getItem('gigi-happiness') || '0');
  });
  const [flyingTreats, setFlyingTreats] = useState<FlyingTreat[]>([]);
  const [gigiReaction, setGigiReaction] = useState('');
  const [isBouncing, setIsBouncing] = useState(false);

  const handleGiveTreat = useCallback((treat: typeof treatMenu[0]) => {
    const newCount = treatCount + 1;
    setTreatCount(newCount);
    localStorage.setItem('gigi-treats', String(newCount));

    const newHappiness = Math.min(happiness + treat.points, 100);
    setHappiness(newHappiness);
    localStorage.setItem('gigi-happiness', String(newHappiness));

    const newFlying: FlyingTreat = {
      id: flyingId++,
      emoji: treat.emoji,
      angle: Math.random() * 60 - 30,
      startX: Math.random() * 100 - 50,
    };
    setFlyingTreats((prev) => [...prev, newFlying]);

    const reactions = [
      'Nom nom nom!', '*tail wagging intensifies*', 'Woof!', '*happy panting*',
      'MORE.', '*drools*', 'Best day ever!', '*spins in circles*',
      'Did someone say ' + treat.label.toLowerCase() + '?!', 'WOOF WOOF!',
    ];
    setGigiReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    setTimeout(() => setGigiReaction(''), 2000);

    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    setTimeout(() => {
      setFlyingTreats((prev) => prev.filter((t) => t.id !== newFlying.id));
    }, 1200);
  }, [treatCount, happiness]);

  const recentTreats = treatMenu
    .filter(() => treatCount > 0)
    .slice(0, 3);

  const mood = getMood(happiness);

  const barColor = happiness < 20 ? 'bg-blue-400'
    : happiness < 50 ? 'bg-gold'
    : happiness < 80 ? 'bg-orange-400'
    : 'bg-green-400';

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 font-mono text-xl tracking-widest text-gold md:text-2xl">
        GIVE GIGI A TREAT
      </h3>

      <motion.div
        className="mb-6 flex flex-col items-center"
        animate={isBouncing ? { scale: [1, 1.2, 0.95, 1.05, 1] } : {}}
        transition={isBouncing ? { duration: 0.5 } : {}}
      >
        <span className="text-6xl md:text-7xl">{mood.face}</span>
      </motion.div>

      <AnimatePresence mode="wait">
        {gigiReaction && (
          <motion.div
            key={gigiReaction}
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 font-mono text-sm italic tracking-wide text-gold/80"
          >
            {gigiReaction}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 w-full max-w-xs">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-widest uppercase text-cream/30">Happiness</span>
          <span className="font-mono text-[10px] tracking-widest text-cream/30">{Math.round(happiness)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-cream/5">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={false}
            animate={{ width: `${happiness}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <p className="mb-5 font-mono text-xs tracking-wider text-cream/40">{mood.msg}</p>

      <div className="relative mb-5">
        <AnimatePresence>
          {flyingTreats.map((treat) => (
            <motion.div
              key={treat.id}
              className="absolute left-1/2 top-1/2 z-20 text-4xl"
              initial={{ opacity: 1, scale: 0.5, x: `calc(-50% + ${treat.startX}px)`, y: '-20%' }}
              animate={{
                opacity: 0,
                scale: 1.8,
                y: '-500%',
                x: `calc(-50% + ${treat.angle}px)`,
                rotate: treat.angle * 8,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {treat.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {treatMenu.map((treat) => (
          <motion.button
            key={treat.emoji}
            onClick={() => handleGiveTreat(treat)}
            className="group flex flex-col items-center gap-1 rounded-xl border border-cream/10 bg-cream/[0.03] px-3 py-2.5 transition-all hover:border-gold/30 hover:bg-gold/10 active:scale-95"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-2xl transition-transform group-hover:scale-110">{treat.emoji}</span>
            <span className="font-mono text-[10px] tracking-wider text-cream/40 group-hover:text-gold/80">
              {treat.label}
            </span>
            {treat.points > 0 && (
              <span className="font-mono text-[9px] text-gold/40">
                +{treat.points}
              </span>
            )}
            {treat.points === 0.5 && (
              <span className="font-mono text-[9px] text-cream/20">
                meh
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="text-center"
        key={treatCount}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-mono text-sm tracking-widest text-cream/50">
          <span className="text-gold">{treatCount}</span>{' '}
          {treatCount === 1 ? 'treat' : 'treats'} given
        </p>
      </motion.div>

      {happiness >= 80 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 font-mono text-xs tracking-wider text-green-400/70"
        >
          MAXIMUM HAPPINESS ACHIEVED ✨
        </motion.p>
      )}
    </div>
  );
}