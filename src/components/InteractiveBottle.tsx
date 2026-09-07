"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { assets } from "@/data/productFacts";

type Mode = "flip" | "spin";
type Phase = "idle" | "playing";
type Props = {
  enabled: boolean;
  reducedMotion: boolean;
  onActivity: (active: boolean) => void;
  onRotation: (turn: number) => void;
  onAuto: (active: boolean) => void;
};

const animation = {
  flip: { duration: 1400, label: "Flip" },
  spin: { duration: 1700, label: "Spin" },
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
    setMode(next);
    setPhase(reducedMotion ? "idle" : "playing");
    setRun(value => value + 1);
    onActivity(true);
    onAuto(true);
    timer.current = setTimeout(clearPlayback, reducedMotion ? 350 : animation[next].duration);
  }, [clearPlayback, enabled, onActivity, onAuto, onRotation, reducedMotion]);

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

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (artTimer.current) clearTimeout(artTimer.current);
    onActivity(false);
    onAuto(false);
  }, [onActivity, onAuto]);

  return <div className={`interactive-bottle phase-${phase} ${mode ? `mode-${mode}` : ""}`} aria-busy={phase !== "idle"}>
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
      <span key={run} className="hero-still">
        <Image src={assets.heroFront} alt="Front of the Shrotas 750 ml bottle" draggable={false} fill priority sizes="(max-width: 768px) 66vw, 420px" />
      </span>
    </button>
    <div className="motion-control" aria-label="Bottle animation">
      {(["flip", "spin"] as const).map(option => <button
        key={option}
        type="button"
        disabled={!enabled}
        aria-label={`Play ${option} bottle animation`}
        aria-pressed={mode === option}
        className={mode === option ? "is-active" : ""}
        onClick={() => choose(option)}
      >{animation[option].label}</button>)}
    </div>
    <span className="sr-only" aria-live="polite">{mode ? `${animation[mode].label} ${reducedMotion ? "selected; animation reduced" : phase}` : "Bottle at front view"}</span>
  </div>;
}
