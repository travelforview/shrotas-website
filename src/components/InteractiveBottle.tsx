"use client";
import Image from "next/image";
import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { assets } from "@/data/productFacts";

type Props={enabled:boolean;reducedMotion:boolean;onActivity:(active:boolean)=>void;onRotation:(turn:number)=>void;onAuto:(active:boolean)=>void};

export function InteractiveBottle({enabled,reducedMotion,onActivity,onRotation,onAuto}:Props){
  const stage=useRef<HTMLButtonElement>(null),raf=useRef(0),angle=useRef(0),auto=useRef(false);
  const [engaged,setEngaged]=useState(false),[settling,setSettling]=useState(false),[used,setUsed]=useState(false);
  const render=useCallback((next:number)=>{angle.current=((next%1)+1)%1;const layers=stage.current?.querySelectorAll<HTMLElement>(".angle-layer");layers?.forEach((layer,index)=>{const anchor=index/3,raw=Math.abs(angle.current-anchor),distance=Math.min(raw,1-raw),weight=Math.max(0,1-distance*3);layer.style.opacity=String(weight);layer.style.transform=`scale(${.985+weight*.015})`});onRotation(angle.current)},[onRotation]);
  const stop=()=>cancelAnimationFrame(raf.current);
  const settle=useCallback(()=>{stop();setSettling(true);const start=performance.now(),from=angle.current,distance=1-from,duration=reducedMotion?150:900;const tick=(now:number)=>{const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,4);render(from+distance*ease);if(p<1)raf.current=requestAnimationFrame(tick);else{render(0);setSettling(false);setEngaged(false);auto.current=false;onAuto(false);onActivity(false)}};raf.current=requestAnimationFrame(tick)},[onActivity,onAuto,reducedMotion,render]);
  const cinematic=useCallback(()=>{if(!enabled||auto.current)return;stop();auto.current=true;setUsed(true);onAuto(true);setEngaged(true);onActivity(true);const start=performance.now(),from=angle.current,turns=reducedMotion?1-angle.current:3.4+(1-angle.current),duration=reducedMotion?450:2200;const tick=(now:number)=>{const p=Math.min(1,(now-start)/duration),ease=p<.2?2.5*p*p:1-Math.pow(1-p,3);render(from+turns*ease);if(p<1)raf.current=requestAnimationFrame(tick);else settle()};raf.current=requestAnimationFrame(tick)},[enabled,onActivity,onAuto,reducedMotion,render,settle]);
  const hover=(e:PointerEvent<HTMLButtonElement>)=>{if(e.pointerType!=="mouse"||!stage.current||auto.current)return;const r=stage.current.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.current.style.setProperty("--hover-x",`${x*9}px`);stage.current.style.setProperty("--hover-y",`${y*4}px`);stage.current.style.setProperty("--hover-ry",`${x*6}deg`)};
  const resetHover=()=>{stage.current?.style.setProperty("--hover-x","0px");stage.current?.style.setProperty("--hover-y","0px");stage.current?.style.setProperty("--hover-ry","0deg")};
  useEffect(()=>()=>stop(),[]);
  return <button ref={stage} type="button" className={`interactive-bottle tap-only ${used?"has-interacted":""} ${engaged?"is-engaged":""} ${settling?"is-settling":""}`} disabled={!enabled} onClick={cinematic} onPointerMove={hover} onPointerLeave={resetHover} aria-label="Tap to experience The Art of Hydration">
    <span className="bottle-glow"/>{[assets.front,assets.side,assets.back].map((src,index)=><span className="angle-layer" key={src} style={{opacity:index===0?1:0}}><Image src={src} alt={index===0?"Front of the Shrotas 750 ml bottle":""} aria-hidden={index!==0} draggable={false} fill priority={index===0} sizes="(max-width: 768px) 58vw, 350px"/></span>)}
    <span className="finish-sweep"/><span className="rotate-hint">tap</span>
  </button>;
}
