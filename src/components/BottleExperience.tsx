"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { assets, productFacts } from "@/data/productFacts";
import { ParticleBottle } from "./ParticleBottle";
import { InteractiveBottle } from "./InteractiveBottle";
export type ExperiencePhase="loading"|"forming"|"resolving"|"ready";

export function BottleExperience({onReady}:{onReady:()=>void}) {
  const [phase,setPhase]=useState<ExperiencePhase>("loading"), [progress,setProgress]=useState(0), [reduced,setReduced]=useState(false),[active,setActive]=useState(false),[auto,setAuto]=useState(false),[turn,setTurn]=useState(0);
  useEffect(()=>{const mq=matchMedia("(prefers-reduced-motion: reduce)");setReduced(mq.matches);let value=0;const interval=window.setInterval(()=>{value=Math.min(100,value+20);setProgress(value);if(value===100){window.clearInterval(interval);setTimeout(()=>setPhase("forming"),180)}},140);[assets.front,assets.logo].forEach(src=>{const i=new window.Image();i.src=src});return()=>window.clearInterval(interval)},[]);
  useEffect(()=>{if(phase!=="forming")return;const t=setTimeout(()=>setPhase("resolving"),reduced?100:3950);return()=>clearTimeout(t)},[phase,reduced]);
  useEffect(()=>{if(phase!=="resolving")return;const t=setTimeout(()=>{setPhase("ready");onReady()},reduced?100:1500);return()=>clearTimeout(t)},[phase,reduced,onReady]);
  const bottleVisible=phase==="resolving"||phase==="ready";
  const activity=useCallback((value:boolean)=>setActive(value),[]),rotation=useCallback((value:number)=>setTurn(value),[]);
  return <section id="top" className={`experience phase-${phase} ${active?"is-rotating":""} ${auto?"is-auto":""}`} style={{"--turn":turn} as React.CSSProperties} aria-label="Shrotas bottle introduction">
    <div className="atmosphere"/><div className="hero-type" aria-hidden><span className="hero-type-left"><i>THE</i><b>ART</b></span><span className="hero-type-right"><i>OF</i><b>HYDRATION</b></span></div><div className="hero-foretype" aria-hidden>SHROTAS</div>
    <ParticleBottle active={phase==="forming"||phase==="resolving"} formed={phase==="ready"} reducedMotion={reduced}/>
    <div className={`viewer-wrap ${bottleVisible?"is-visible":""}`}><InteractiveBottle enabled={phase==="ready"} reducedMotion={reduced} onActivity={activity} onRotation={rotation} onAuto={setAuto}/></div>
    <div className="hero-mark"><Image src={assets.logo} alt="Shrotas" width={120} height={70} priority/><span>{productFacts.volume}</span></div>
    <div className={`preloader ${phase==="loading"?"":"is-gone"}`}><span>SHROTAS</span><strong>{String(progress).padStart(3,"0")}</strong><i><b style={{width:`${progress}%`}}/></i></div>
    <a href="#story" className="scroll-mark" aria-label="Continue to the Shrotas story"><span>scroll</span><i/></a>
  </section>;
}
