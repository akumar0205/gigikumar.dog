import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
}

export default function PawParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const nextIdRef = useRef(0);

  const reduceMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const createParticle = useCallback((): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {
      id: 0, x: 0, y: 0, size: 0, opacity: 0, speed: 0, drift: 0, rotation: 0, rotationSpeed: 0
    };

    return {
      id: nextIdRef.current++,
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 14 + 8,
      opacity: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.5 + 0.2,
      drift: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
    };
  }, []);

  const drawPaw = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = '#FFFAFA';

    const s = particle.size;
    const padSize = s * 0.35;
    const bigPad = s * 0.4;

    ctx.beginPath();
    ctx.ellipse(0, 0, bigPad, padSize, 0, 0, Math.PI * 2);
    ctx.fill();

    const toes = [
      { x: -bigPad * 0.85, y: -padSize * 1.1, r: padSize * 0.38 },
      { x: -bigPad * 0.3, y: -padSize * 1.6, r: padSize * 0.32 },
      { x: bigPad * 0.3, y: -padSize * 1.6, r: padSize * 0.32 },
      { x: bigPad * 0.85, y: -padSize * 1.1, r: padSize * 0.38 },
    ];

    toes.forEach((toe) => {
      ctx.beginPath();
      ctx.arc(toe.x, toe.y, toe.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 12; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particlesRef.current.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.02 && particlesRef.current.length < 20) {
        particlesRef.current.push(createParticle());
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        p.rotation += p.rotationSpeed;

        drawPaw(ctx, p);

        return p.y > -30;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [reduceMotion, createParticle, drawPaw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}