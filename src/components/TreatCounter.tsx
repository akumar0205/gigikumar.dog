import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingTreat {
  id: number;
  emoji: string;
  angle: number;
  startX: number;
  isYuck: boolean;
}

const treatMenu = [
  { emoji: '🥩', label: 'Steak', points: 5 },
  { emoji: '🥓', label: 'Bacon', points: 5 },
  { emoji: '🍕', label: 'Pizza', points: 3 },
  { emoji: '🦴', label: 'Bone', points: 1 },
  { emoji: '🧀', label: 'Cheese', points: 2 },
  { emoji: '🥕', label: 'Carrot', points: -3, yuck: true },
  { emoji: '🥦', label: 'Broccoli', points: -5, yuck: true },
  { emoji: '🥬', label: 'Lettuce', points: -4, yuck: true },
];

const moodMessages = [
  { threshold: -20, msg: 'Gigi is giving you THE look...', face: '😾' },
  { threshold: -5, msg: 'Gigi side-eyes you suspiciously', face: '😬' },
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

const yuckReactions = [
  '*gags dramatically*', 'Absolutely NOT.', '*turns away in disgust*',
  'Gigi demands to speak to the manager.', '😒 Seriously?',
  '*pushes it off the table*', 'Where is the REAL food?!',
  '*stares in betrayal*', 'This is an insult.',
];

const goodReactions = [
  'Nom nom nom!', '*tail wagging intensifies*', 'Woof!', '*happy panting*',
  'MORE.', '*drools*', 'Best day ever!', '*spins in circles*',
  'WOOF WOOF!',
];

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
  const [isShaking, setIsShaking] = useState(false);

  const handleGiveTreat = useCallback((treat: typeof treatMenu[0]) => {
    const newCount = treatCount + 1;
    setTreatCount(newCount);
    localStorage.setItem('gigi-treats', String(newCount));

    const newHappiness = Math.max(-25, Math.min(100, happiness + treat.points));
    setHappiness(newHappiness);
    localStorage.setItem('gigi-happiness', String(newHappiness));

    const newFlying: FlyingTreat = {
      id: flyingId++,
      emoji: treat.emoji,
      angle: Math.random() * 60 - 30,
      startX: Math.random() * 100 - 50,
      isYuck: !!treat.yuck,
    };
    setFlyingTreats((prev) => [...prev, newFlying]);

    if (treat.yuck) {
      setGigiReaction(yuckReactions[Math.floor(Math.random() * yuckReactions.length)]);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else {
      const extraReaction = treat.points >= 4
        ? [' ' + treat.label.toUpperCase() + '!!!', ' BEST. THING. EVER.']
        : [];
      const allReactions = [...goodReactions, ...extraReaction];
      setGigiReaction(allReactions[Math.floor(Math.random() * allReactions.length)]);
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 600);
    }

    setTimeout(() => setGigiReaction(''), 2000);
    setTimeout(() => {
      setFlyingTreats((prev) => prev.filter((t) => t.id !== newFlying.id));
    }, 1200);
  }, [treatCount, happiness]);

  const mood = getMood(happiness);

  const barColor = happiness < -5 ? 'bg-red-500'
    : happiness < 5 ? 'bg-blue-400'
    : happiness < 20 ? 'bg-gold'
    : happiness < 50 ? 'bg-amber-400'
    : happiness < 80 ? 'bg-orange-400'
    : 'bg-green-400';

  return (
    <div className="flex flex-col items-center">
      <h3 className="mb-4 font-mono text-xl tracking-widest text-gold md:text-2xl">
        GIVE GIGI A TREAT
      </h3>

      <motion.div
        className="mb-4 flex flex-col items-center"
        animate={
          isBouncing
            ? { scale: [1, 1.2, 0.95, 1.05, 1] }
            : isShaking
            ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
            : {}
        }
        transition={isBouncing || isShaking ? { duration: 0.5 } : {}}
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
            className={`mb-3 font-mono text-sm italic tracking-wide ${
              mood.face === '😾' || mood.face === '😬'
                ? 'text-red-400/80'
                : 'text-gold/80'
            }`}
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
        <div className="h-2.5 overflow-hidden rounded-full bg-cream/5">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={false}
            animate={{ width: `${Math.max(0, Math.min(100, happiness + 25))}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-0.5 flex justify-between">
          <span className="font-mono text-[8px] text-red-400/40">😾</span>
          <span className="font-mono text-[8px] text-green-400/40">✨</span>
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
              animate={
                treat.isYuck
                  ? {
                      opacity: 0,
                      scale: 0.3,
                      x: `calc(-50% + ${treat.angle * 3}px)`,
                      y: '200%',
                      rotate: treat.angle * 12,
                    }
                  : {
                      opacity: 0,
                      scale: 1.8,
                      y: '-500%',
                      x: `calc(-50% + ${treat.angle}px)`,
                      rotate: treat.angle * 8,
                    }
              }
              transition={{ duration: treat.isYuck ? 0.8 : 1, ease: 'easeOut' }}
            >
              {treat.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mb-2 grid grid-cols-4 gap-2.5 sm:grid-cols-8">
        {treatMenu.map((treat) => (
          <motion.button
            key={treat.emoji}
            onClick={() => handleGiveTreat(treat)}
            className={`group flex flex-col items-center gap-1 rounded-xl border px-2.5 py-2 transition-all active:scale-95 ${
              treat.yuck
                ? 'border-red-500/10 bg-red-500/[0.03] hover:border-red-500/30 hover:bg-red-500/10'
                : 'border-cream/10 bg-cream/[0.03] hover:border-gold/30 hover:bg-gold/10'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className={`text-2xl transition-transform group-hover:scale-110 ${treat.yuck ? 'grayscale-[20%]' : ''}`}>
              {treat.emoji}
            </span>
            <span className={`font-mono text-[10px] tracking-wider ${
              treat.yuck
                ? 'text-red-400/50 group-hover:text-red-400/80'
                : 'text-cream/40 group-hover:text-gold/80'
            }`}>
              {treat.label}
            </span>
            {treat.points > 0 && !treat.yuck && (
              <span className="font-mono text-[9px] text-gold/40">
                +{treat.points}
              </span>
            )}
            {treat.yuck && (
              <span className="font-mono text-[9px] text-red-400/50">
                {treat.points}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      <p className="mb-5 font-mono text-[9px] tracking-wider text-red-400/30">
        vegetables will be rejected
      </p>

      <motion.div
        className="text-center"
        key={treatCount}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-mono text-sm tracking-widest text-cream/50">
          <span className="text-gold">{treatCount}</span>{' '}
          {treatCount === 1 ? 'item' : 'items'} offered
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
      {happiness <= -15 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 font-mono text-xs tracking-wider text-red-400/70"
        >
          GIGI IS OFFENDED 😾
        </motion.p>
      )}
    </div>
  );
}