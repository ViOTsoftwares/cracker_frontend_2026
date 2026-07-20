import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Rocket } from 'lucide-react';

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFireworks = useCallback(() => {
    setIsPlaying(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Stop the animation after 2 seconds
    timerRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  }, []);

  // Trigger on initial load
  useEffect(() => {
    triggerFireworks();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerFireworks]);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: any[] = [];
    const fireworks: any[] = [];

    let hue = 120;
    let timerTotal = 30; // Adjust for firework frequency
    let timerTick = 0;
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    class Firework {
      x: number;
      y: number;
      sx: number;
      sy: number;
      tx: number;
      ty: number;
      distanceToTarget: number;
      distanceTraveled: number;
      coordinates: number[][];
      coordinateCount: number;
      angle: number;
      speed: number;
      acceleration: number;
      brightness: number;
      targetRadius: number;

      constructor(sx: number, sy: number, tx: number, ty: number) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = sx;
        this.ty = ty;
        this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = random(50, 70);
        this.targetRadius = 1;
      }

      update(index: number) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        if (this.targetRadius < 8) {
          this.targetRadius += 0.3;
        } else {
          this.targetRadius = 1;
        }

        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.sqrt(Math.pow(this.sx - this.x - vx, 2) + Math.pow(this.sy - this.y - vy, 2));

        if (this.distanceTraveled >= this.distanceToTarget) {
          createParticles(this.tx, this.ty);
          fireworks.splice(index, 1);
        } else {
          this.x += vx;
          this.y += vy;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    class Particle {
      x: number;
      y: number;
      coordinates: number[][];
      coordinateCount: number;
      angle: number;
      speed: number;
      friction: number;
      gravity: number;
      hue: number;
      brightness: number;
      alpha: number;
      decay: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 10);
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = random(hue - 50, hue + 50);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
      }

      update(index: number) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
          particles.splice(index, 1);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
      }
    }

    function createParticles(x: number, y: number) {
      let particleCount = 30;
      while (particleCount--) {
        particles.push(new Particle(x, y));
      }
    }

    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);
      hue += 0.5;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      let i = fireworks.length;
      while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
      }

      let j = particles.length;
      while (j--) {
        particles[j].draw();
        particles[j].update(j);
      }

      if (timerTick >= timerTotal) {
        if (Math.random() > 0.3) {
          fireworks.push(new Firework(width / 2, height, random(0, width), random(0, height / 2)));
        }
        if (Math.random() > 0.7) {
          fireworks.push(new Firework(width / 2, height, random(0, width), random(0, height / 2)));
        }
        timerTick = 0;
      } else {
        timerTick++;
      }
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <>
      {isPlaying && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      )}

      {/* Button is now ALWAYS visible so it can be clicked continuously */}
      <button
        onClick={triggerFireworks}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 10px rgba(234, 88, 12, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.1) translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 6px 15px rgba(234, 88, 12, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(234, 88, 12, 0.4)';
        }}
        title="Play Diwali Fireworks"
      >
        <Rocket size={20} style={{ transform: 'translateY(-1px)' }} />
      </button>
    </>
  );
};

export default Fireworks;
