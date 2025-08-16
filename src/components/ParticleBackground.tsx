import { useEffect, useRef, useState } from "react";
import './ParticleBackground.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  originalSize: number;
  opacity: number;
  originalOpacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  colors?: string[];
  particleSize?: number;
  speed?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  interactionType?: 'attract' | 'repel';
}

export default function ParticleBackground({
  particleCount = 80,
  colors = ["#1e40af", "#7c3aed", "#dc2626"],
  particleSize = 2,
  speed = 0.5,
  interactionRadius = 100,
  interactionStrength = 0.02,
  interactionType = 'attract'
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * particleSize + 1;
      const opacity = Math.random() * 0.8 + 0.2;
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size,
        originalSize: size,
        opacity,
        originalOpacity: opacity,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    particlesRef.current = particles;
  };

  // Update particle positions and handle interactions
  const updateParticles = (width: number, height: number) => {
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    particles.forEach(particle => {
      // Update position with base velocity
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      // Calculate mouse interaction
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < interactionRadius) {
        const force = (interactionRadius - distance) / interactionRadius;
        const angle = Math.atan2(dy, dx);
        
        const forceX = Math.cos(angle) * force * interactionStrength;
        const forceY = Math.sin(angle) * force * interactionStrength;

        if (interactionType === 'attract') {
          particle.vx += forceX;
          particle.vy += forceY;
        } else {
          particle.vx -= forceX;
          particle.vy -= forceY;
        }

        // Enhanced visual effects near mouse
        const normalizedForce = force * 2;
        particle.size = particle.originalSize * (1 + normalizedForce);
        particle.opacity = Math.min(1, particle.originalOpacity * (1 + normalizedForce));
      } else {
        // Return to original size and opacity
        particle.size += (particle.originalSize - particle.size) * 0.1;
        particle.opacity += (particle.originalOpacity - particle.opacity) * 0.1;
      }

      // Apply damping to prevent infinite acceleration
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Ensure minimum velocity for continuous movement
      if (Math.abs(particle.vx) < 0.1) particle.vx += (Math.random() - 0.5) * 0.02;
      if (Math.abs(particle.vy) < 0.1) particle.vy += (Math.random() - 0.5) * 0.02;
    });
  };

  // Render particles
  const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const particles = particlesRef.current;
    
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
      
      // Add subtle glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw connection lines between nearby particles
    ctx.globalAlpha = 0.1;
    particles.forEach((particle, i) => {
      particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles(dimensions.width, dimensions.height);
    render(ctx, dimensions.width, dimensions.height);
    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize and start animation
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      initParticles(dimensions.width, dimensions.height);
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, particleCount, colors, particleSize, speed]);

  return (
    <div className="particle-background">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="particle-canvas"
      />
    </div>
  );
}