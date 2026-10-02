"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * One-shot reveal on scroll. No looping animation, and it disables itself
 * entirely when the visitor has asked for reduced motion.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  id,
}: {
  children: ReactNode;
  as?: "div" | "section" | "li" | "article";
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // With reduced motion requested, globals.css already forces .reveal visible,
    // so there is nothing to observe and nothing to animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      id={id}
      className={`reveal ${className}`.trim()}
      data-visible={visible}
    >
      {children}
    </Tag>
  );
}
