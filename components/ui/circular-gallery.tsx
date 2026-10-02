import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial: string;
  /** 点这张照片时进入的页面。没有则只展示。 */
  href?: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
    by: string;
  };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Card size before perspective. */
  cardWidth?: number;
  cardHeight?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, cardWidth = 240, cardHeight = 320, autoRotateSpeed = 0.02, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const pointerRef = useRef({ x: 0, y: 0, active: false });
    const cardRefs = useRef<Array<HTMLElement | null>>([]);
    const [cardTilts, setCardTilts] = useState(() =>
      items.map(() => ({ x: 0, y: 0, lightX: 50, lightY: 40 })),
    );

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed]);

    useEffect(() => {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) return;
      const tilts = items.map(() => ({ x: 0, y: 0, lightX: 50, lightY: 40 }));
      let frame = 0;
      let running = false;

      const tick = () => {
        let moving = false;
        items.forEach((_, index) => {
          const card = cardRefs.current[index];
          const current = tilts[index];
          if (!card || !current) return;
          const box = card.getBoundingClientRect();
          const px = (pointerRef.current.x - (box.left + box.width / 2)) / Math.max(box.width, 1);
          const py = (pointerRef.current.y - (box.top + box.height / 2)) / Math.max(box.height, 1);
          const clampedX = Math.max(-0.55, Math.min(0.55, px));
          const clampedY = Math.max(-0.55, Math.min(0.55, py));
          const active = pointerRef.current.active;
          const targetX = active ? clampedY * -14 : 0;
          const targetY = active ? clampedX * 18 : 0;
          const targetLightX = active ? ((clampedX + 0.55) / 1.1) * 100 : 50;
          const targetLightY = active ? ((clampedY + 0.55) / 1.1) * 100 : 40;
          current.x += (targetX - current.x) * 0.16;
          current.y += (targetY - current.y) * 0.16;
          current.lightX += (targetLightX - current.lightX) * 0.16;
          current.lightY += (targetLightY - current.lightY) * 0.16;
          if (
            Math.abs(current.x - targetX) > 0.08 ||
            Math.abs(current.y - targetY) > 0.08
          ) {
            moving = true;
          }
        });
        setCardTilts(tilts.map((tilt) => ({ ...tilt })));
        if (moving) frame = requestAnimationFrame(tick);
        else running = false;
      };

      const wake = () => {
        if (running) return;
        running = true;
        frame = requestAnimationFrame(tick);
      };
      const onPointerMove = (event: PointerEvent) => {
        pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
        wake();
      };
      const onPointerLeave = () => {
        pointerRef.current = { ...pointerRef.current, active: false };
        wake();
      };

      window.addEventListener('pointermove', onPointerMove);
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('blur', onPointerLeave);
      return () => {
        running = false;
        cancelAnimationFrame(frame);
        window.removeEventListener('pointermove', onPointerMove);
        document.documentElement.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('blur', onPointerLeave);
      };
    }, [items]);

    const anglePerItem = 360 / items.length;
    
    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn("relative w-full h-full flex items-center justify-center", className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - (normalizedAngle / 180));

            const tilt = cardTilts[i] ?? { x: 0, y: 0, lightX: 50, lightY: 40 };
            const card = (
              <div className="h-full w-full [perspective:900px]">
                <div
                  className="relative h-full w-full overflow-hidden rounded-lg"
                  style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <img
                    src={item.photo.url}
                    alt={item.href ? '' : item.photo.text}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at ${tilt.lightX}% ${tilt.lightY}%, rgba(255,255,255,0.28), transparent 42%)`,
                    }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-xl font-bold">{item.common}</h2>
                    {item.binomial ? <em className="text-sm italic opacity-80">{item.binomial}</em> : null}
                    {item.photo.by ? <p className="text-xs mt-2 opacity-70">Photo by: {item.photo.by}</p> : null}
                  </div>
                </div>
              </div>
            );

            return (
              <div
                key={item.photo.url}
                className="absolute"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: -cardWidth / 2,
                  marginTop: -cardHeight / 2,
                  opacity: opacity,
                  transition: 'opacity 0.3s linear'
                }}
              >
                {item.href ? (
                  <Link
                    ref={(node) => {
                      cardRefs.current[i] = node;
                    }}
                    to={item.href}
                    aria-label={item.common}
                    className="relative block w-full h-full cursor-pointer rounded-lg shadow-2xl border border-border bg-card/70 dark:bg-card/30 outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {card}
                  </Link>
                ) : (
                  <div
                    ref={(node) => {
                      cardRefs.current[i] = node;
                    }}
                    role="group"
                    aria-label={item.common}
                    className="relative w-full h-full rounded-lg shadow-2xl border border-border bg-card/70 dark:bg-card/30"
                  >
                    {card}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
