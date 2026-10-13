import React, { useEffect, useLayoutEffect, useRef, HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

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

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Card size before perspective. */
  cardWidth?: number;
  cardHeight?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** Keeps the ring still. The home archive uses this while it covers the gallery. */
  paused?: boolean;
}

const CircularGallery = React.memo(
  React.forwardRef<HTMLDivElement, CircularGalleryProps>(
    (
      {
        items,
        className,
        radius = 600,
        cardWidth = 240,
        cardHeight = 320,
        autoRotateSpeed = 0.02,
        paused = false,
        ...props
      },
      ref,
    ) => {
      const spinRef = useRef<HTMLDivElement>(null);
      const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
      const rotationRef = useRef(0);
      const scrollingRef = useRef(false);
      const scrollTimeoutRef = useRef<number | null>(null);
      const pausedRef = useRef(paused);
      const reducedRef = useRef(false);
      const applyRef = useRef<() => void>(() => {});
      const pointerRef = useRef({ x: 0, y: 0, active: false });
      const cardRefs = useRef<Array<HTMLElement | null>>([]);
      const faceRefs = useRef<Array<HTMLDivElement | null>>([]);
      const lightRefs = useRef<Array<HTMLDivElement | null>>([]);

      useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => {
          reducedRef.current = media.matches;
        };
        sync();
        media.addEventListener('change', sync);
        return () => media.removeEventListener('change', sync);
      }, []);

      useEffect(() => {
        const handleScroll = () => {
          scrollingRef.current = true;
          if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);

          const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
          rotationRef.current = scrollProgress * 360;
          if (!pausedRef.current && !document.hidden) applyRef.current();

          scrollTimeoutRef.current = window.setTimeout(() => {
            scrollingRef.current = false;
          }, 150);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
          window.removeEventListener('scroll', handleScroll);
          if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
        };
      }, []);

      useLayoutEffect(() => {
        pausedRef.current = paused;
        applyRef.current = () => {
          const rotation = rotationRef.current;
          if (spinRef.current) spinRef.current.style.transform = `rotateY(${rotation}deg)`;
          if (items.length === 0) return;
          const anglePerItem = 360 / items.length;
          const totalRotation = ((rotation % 360) + 360) % 360;
          for (let index = 0; index < items.length; index += 1) {
            const el = itemRefs.current[index];
            if (!el) continue;
            const relativeAngle = (index * anglePerItem + totalRotation) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            el.style.opacity = String(Math.max(0.3, 1 - normalizedAngle / 180));
          }
        };

        let frame = 0;
        let alive = true;

        const loop = () => {
          if (!alive || document.hidden || pausedRef.current) return;
          if (!reducedRef.current && !scrollingRef.current) rotationRef.current += autoRotateSpeed;
          applyRef.current();
          if (reducedRef.current) return;
          frame = requestAnimationFrame(loop);
        };

        const resume = () => {
          if (!alive || document.hidden || pausedRef.current) return;
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(loop);
        };

        document.addEventListener('visibilitychange', resume);
        loop();
        return () => {
          alive = false;
          cancelAnimationFrame(frame);
          document.removeEventListener('visibilitychange', resume);
        };
      }, [paused, autoRotateSpeed, items]);

      useEffect(() => {
        lightRefs.current.forEach((light) => {
          if (light) light.style.background = 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.28), transparent 42%)';
        });
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (media.matches) return;
        const tilts = items.map(() => ({ x: 0, y: 0, lightX: 50, lightY: 40 }));
        let frame = 0;
        let running = false;

        const tick = () => {
          let moving = false;
          items.forEach((_, index) => {
            const card = cardRefs.current[index];
            const face = faceRefs.current[index];
            const light = lightRefs.current[index];
            const current = tilts[index];
            if (!card || !face || !current) return;
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
            face.style.transform = `rotateX(${current.x}deg) rotateY(${current.y}deg)`;
            if (light) {
              light.style.background = `radial-gradient(circle at ${current.lightX}% ${current.lightY}%, rgba(255,255,255,0.28), transparent 42%)`;
            }
            if (Math.abs(current.x - targetX) > 0.08 || Math.abs(current.y - targetY) > 0.08) moving = true;
          });
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

      const anglePerItem = items.length > 0 ? 360 / items.length : 0;

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
            ref={spinRef}
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {items.map((item, i) => {
              const itemAngle = i * anglePerItem;
              const card = (
                <div className="h-full w-full [perspective:900px]">
                  <div
                    ref={(node) => {
                      faceRefs.current[i] = node;
                    }}
                    className="relative h-full w-full overflow-hidden rounded-lg"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <img
                      src={item.photo.url}
                      alt={item.href ? '' : item.photo.text}
                      fetchPriority="low"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: item.photo.pos || 'center' }}
                    />
                    <div
                      ref={(node) => {
                        lightRefs.current[i] = node;
                      }}
                      className="pointer-events-none absolute inset-0"
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
                  ref={(node) => {
                    itemRefs.current[i] = node;
                  }}
                  className="absolute"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    left: '50%',
                    top: '50%',
                    marginLeft: -cardWidth / 2,
                    marginTop: -cardHeight / 2,
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
    },
  ),
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
