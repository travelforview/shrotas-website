"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { assets } from "@/data/productFacts";

type Mode = "flip" | "spin";
type Phase = "idle" | "loading" | "playing";
type Props = {
  enabled: boolean;
  reducedMotion: boolean;
  onActivity: (active: boolean) => void;
  onRotation: (turn: number) => void;
  onAuto: (active: boolean) => void;
};

const animation = {
  flip: { src: assets.flip, duration: 4000, label: "Flip" },
  spin: { src: assets.spin, duration: 5000, label: "Spin" },
} as const;

export function InteractiveBottle({ enabled, reducedMotion, onActivity, onRotation, onAuto }: Props) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const artTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);

  const clearPlayback = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setMode(null);
    setPhase("idle");
    onActivity(false);
    onAuto(false);
    onRotation(.5);
  }, [onActivity, onAuto, onRotation]);

  const choose = useCallback((next: Mode) => {
    if (!enabled) return;
    if (timer.current) clearTimeout(timer.current);
    onRotation(.5);
    if (reducedMotion) {
      setMode(next);
      setPhase("idle");
      timer.current = setTimeout(clearPlayback, 700);
      return;
    }
    setMode(next);
    setPhase("loading");
    setRun(value => value + 1);
    onActivity(true);
    onAuto(true);
  }, [clearPlayback, enabled, onActivity, onAuto, onRotation, reducedMotion]);

  const begin = useCallback(() => {
    if (!mode || reducedMotion) return;
    setPhase("playing");
    timer.current = setTimeout(clearPlayback, animation[mode].duration);
  }, [clearPlayback, mode, reducedMotion]);

  const animateArt = useCallback(() => {
    if (!enabled) return;
    if (artTimer.current) clearTimeout(artTimer.current);
    onRotation(.5);
    onActivity(true);
    onAuto(true);
    artTimer.current = setTimeout(() => {
      onActivity(false);
      onAuto(false);
      artTimer.current = null;
    }, reducedMotion ? 150 : 3100);
  }, [enabled, onActivity, onAuto, onRotation, reducedMotion]);

  useEffect(() => {
    if (!enabled || reducedMotion) return;
    const preload = () => {
      const flip = new window.Image();
      flip.src = assets.flip;
      const spinDelay = window.setTimeout(() => {
        const spin = new window.Image();
        spin.src = assets.spin;
      }, 1800);
      return () => window.clearTimeout(spinDelay);
    };
    const idleWindow = window as unknown as {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (idleWindow.requestIdleCallback) {
      let cancelPreloads: (() => void) | undefined;
      const idle = idleWindow.requestIdleCallback(() => { cancelPreloads = preload(); }, { timeout: 2500 });
      return () => { idleWindow.cancelIdleCallback?.(idle); cancelPreloads?.(); };
    }
    let cancelPreloads: (() => void) | undefined;
    const fallback = setTimeout(() => { cancelPreloads = preload(); }, 1200);
    return () => { clearTimeout(fallback); cancelPreloads?.(); };
  }, [enabled, reducedMotion]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (artTimer.current) clearTimeout(artTimer.current);
    onActivity(false);
    onAuto(false);
  }, [onActivity, onAuto]);

  const active = mode ? animation[mode] : null;
  return <div className={`interactive-bottle phase-${phase}`} aria-busy={phase !== "idle"}>
    <button
      className="bottle-touch"
      type="button"
      disabled={!enabled}
      aria-label="Animate The Art of Hydration"
      onClick={animateArt}
      onPointerMove={(event) => {
        if (!enabled || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        onRotation(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)));
        onActivity(true);
      }}
      onPointerLeave={() => { if (phase === "idle") { onRotation(.5); onActivity(false); } }}
    >
      <span className="bottle-glow" aria-hidden="true" />
      <span className="hero-still">
        <Image src={assets.heroFront} alt="Front of the Shrotas 750 ml bottle" draggable={false} fill priority sizes="(max-width: 768px) 66vw, 420px" />
      </span>
      {active && !reducedMotion && <Image
        key={`${mode}-${run}`}
        className="hero-animation is-playing"
        src={`${active.src}?run=${run}`}
        alt=""
        aria-hidden="true"
        draggable="false"
        fill
        unoptimized
        sizes="(max-width: 768px) 66vw, 420px"
        onLoad={begin}
        onError={clearPlayback}
      />}
    </button>
    <div className="motion-control" aria-label="Bottle animation">
      {(["flip", "spin"] as const).map(option => <button
        key={option}
        type="button"
        disabled={!enabled}
        aria-label={`Play ${option} bottle animation`}
        aria-pressed={mode === option}
        className={mode === option ? "is-active" : ""}
        onPointerEnter={() => { if (!reducedMotion) { const image = new window.Image(); image.src = animation[option].src; } }}
        onFocus={() => { if (!reducedMotion) { const image = new window.Image(); image.src = animation[option].src; } }}
        onClick={() => choose(option)}
      >{animation[option].label}</button>)}
    </div>
    <span className="sr-only" aria-live="polite">{mode ? `${animation[mode].label} ${reducedMotion ? "selected; animation reduced" : phase}` : "Bottle at front view"}</span>
  </div>;
}
