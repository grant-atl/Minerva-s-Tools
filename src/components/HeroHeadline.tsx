import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export default function HeroHeadline() {
  const underlineRef = useRef<HTMLSpanElement>(null);
  const placeRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);

  const text = "all in one place";

  // Underline draw-in
  useEffect(() => {
    if (!underlineRef.current) return;
    gsap.fromTo(
      underlineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  // Letter tilt handlers
  const handleMouseEnter = useCallback(() => {
    letterRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        rotation: (Math.random() - 0.5) * 30,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    letterRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        rotation: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
      });
    });
  }, []);

  return (
    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]">
      Free{" "}
      <span className="relative inline-block">
        design{" "}
        <span
          className="relative inline-block group/tools cursor-pointer"
          onMouseEnter={() => {
            const path = document.getElementById("circle-path");
            if (path) {
              const length = (path as unknown as SVGPathElement).getTotalLength();
              gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
              gsap.to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" });
            }
          }}
          onMouseLeave={() => {
            const path = document.getElementById("circle-path");
            if (path) {
              const length = (path as unknown as SVGPathElement).getTotalLength();
              gsap.to(path, { strokeDashoffset: length, duration: 0.4, ease: "power2.in" });
            }
          }}
        >
          tools,
          <svg
            className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)] pointer-events-none"
            viewBox="0 0 120 60"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              id="circle-path"
              d="M10,30 C10,10 30,5 60,5 C90,5 110,10 110,30 C110,50 90,55 60,55 C30,55 10,50 10,30 Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="400"
              strokeDashoffset="400"
              opacity="0.7"
            />
          </svg>
        </span>
        <span
          ref={underlineRef}
          className="absolute left-0 bottom-1 sm:bottom-2 w-full h-[3px] sm:h-[4px] bg-foreground/40 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </span>
      <br />
      <span
        ref={placeRef}
        className="inline-block cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) letterRefs.current[i] = el;
            }}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </h1>
  );
}
