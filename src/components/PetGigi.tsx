import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
}

let heartId = 0;

export default function PetGigi() {
  const [petCount, setPetCount] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('gigi-pets') || '0', 10);
  });
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [isWiggling, setIsWiggling] = useState(false);
  const clickTimesRef = useRef<number[]>([]);
  const [zoomies, setZoomies] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imgX = useSpring(0, { stiffness: 50, damping: 20 });
  const imgY = useSpring(0, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 25;
      const y = (e.clientY - rect.top - rect.height / 2) / 25;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (zoomies) return;

      const newCount = petCount + 1;
      setPetCount(newCount);
      localStorage.setItem('gigi-pets', String(newCount));

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newHearts: Heart[] = Array.from({ length: 5 }, () => ({
        id: heartId++,
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        size: Math.random() * 12 + 10,
      }));
      setHearts((prev) => [...prev, ...newHearts]);

      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 500);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
      }, 1000);

      const now = Date.now();
      clickTimesRef.current = [...clickTimesRef.current, now].filter((t) => now - t < 2000);
      if (clickTimesRef.current.length >= 7) {
        clickTimesRef.current = [];
        setZoomies(true);
        setTimeout(() => setZoomies(false), 3000);
      }
    },
    [petCount, zoomies]
  );

  return (
    <div className="flex flex-col items-center">
      {zoomies && (
        <div className="zoomies-overlay pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-dark/50" style={{ animation: 'zoomies-shake 0.3s infinite' }} />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
            className="relative z-10 font-mono text-4xl font-bold tracking-widest text-gold md:text-6xl"
          >
            ZOOMIES ACTIVATED
          </motion.div>
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl md:text-4xl"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
                scale: 0.5,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 2 + Math.random(), ease: 'easeOut' }}
            >
              🐾
            </motion.div>
          ))}
        </div>
      )}

      <h3 className="mb-6 font-mono text-xl tracking-widest text-gold md:text-2xl">
        PET GIGI
      </h3>

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative cursor-pointer select-none"
        animate={isWiggling ? { rotate: [0, -5, 5, -3, 3, 0] } : {}}
        transition={isWiggling ? { duration: 0.5 } : {}}
        style={{
          x: imgX,
          y: imgY,
        }}
      >
        <motion.img
          src="/images/gigi2.jpg"
          alt="Pet Gigi"
          className="h-[20rem] w-[20rem] rounded-2xl object-cover shadow-2xl shadow-black/50 md:h-[26rem] md:w-[26rem]"
          animate={zoomies ? { rotate: [0, 360] } : {}}
          transition={zoomies ? { duration: 0.5, repeat: 6, ease: 'linear' } : {}}
          drag={false}
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      </motion.div>

      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="pointer-events-none absolute z-20"
            initial={{ opacity: 1, scale: 0.5, y: heart.y, x: heart.x }}
            animate={{ opacity: 0, scale: 1.2, y: heart.y - 80 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ left: 0, fontSize: heart.size }}
          >
            💛
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.p
        className="mt-6 font-mono text-sm tracking-widest text-cream/60"
        key={petCount}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Petted{' '}
        <span className="text-gold">{petCount}</span>{' '}
        {petCount === 1 ? 'time' : 'times'} 💛
      </motion.p>

      <p className="mt-2 text-xs tracking-wider text-cream/30">
        Try clicking really fast...
      </p>
    </div>
  );
}