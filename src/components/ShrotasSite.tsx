"use client";
import { useCallback,useEffect,useRef,useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroScene } from "./HeroScene";
import { assets,businessContent,productFacts as f } from "@/data/productFacts";

const studies=[
  {src:assets.front,kicker:"Composition / 01",title:"Essential Minerals",body:f.minerals.join(" · ")},
  {src:assets.side,kicker:"Origin / 02",title:"Source to Soul",body:"What begins as water becomes Shrotas."},
  {src:assets.back,kicker:"Material / 03",title:"Designed to Recycle",body:f.recyclable},
];

export function ShrotasSite(){
  const root=useRef<HTMLElement>(null),[entered,setEntered]=useState(false),[angle,setAngle]=useState(0),[lens,setLens]=useState({x:50,y:50}),[portal,setPortal]=useState(false);
  const ready=useCallback(()=>setEntered(true),[]);
  useEffect(()=>{gsap.registerPlugin(ScrollTrigger);if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const ctx=gsap.context(()=>{
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el=>gsap.fromTo(el,{y:50,opacity:0},{y:0,opacity:1,duration:1.1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 84%"}}));
    gsap.to(".manifesto-type",{xPercent:-13,ease:"none",scrollTrigger:{trigger:"#story",start:"top bottom",end:"bottom top",scrub:1}});
    const media=gsap.matchMedia();
    const studyTriggers=(start:string)=>gsap.utils.toArray<HTMLElement>(".study-step").forEach((el,i)=>ScrollTrigger.create({trigger:el,start,end:"bottom 45%",onEnter:()=>setAngle(i),onEnterBack:()=>setAngle(i)}));
    media.add("(max-width: 760px)",()=>studyTriggers("top 58%"));
    media.add("(min-width: 761px) and (max-width: 1100px)",()=>studyTriggers("top 55%"));
    media.add("(min-width: 1101px)",()=>studyTriggers("top center"));
    let orientationFrame=0;const refresh=()=>{cancelAnimationFrame(orientationFrame);orientationFrame=requestAnimationFrame(()=>ScrollTrigger.refresh())};
    addEventListener("orientationchange",refresh);
    return()=>{removeEventListener("orientationchange",refresh);cancelAnimationFrame(orientationFrame);media.revert()};
  },root);return()=>ctx.revert()},[]);
  const active=studies[angle];
  return <main ref={root} className={entered?"site-entered":""}><HeroScene onReady={ready}/>
    <header className="nav"><a href="#top" className="wordmark">SHROTAS</a><nav aria-label="Primary"><a href="#story">Philosophy</a><a href="#bottle">Bottle</a><a href="#contact">Contact</a></nav></header>
    <section id="story" className="scene manifesto"><div className="manifesto-type" aria-hidden>THE ART OF HYDRATION</div><div className="manifesto-copy" data-reveal><p className="eyebrow">SHROTAS / 750 ML</p><h1>An everyday essential, treated like an object of design.</h1><p>{f.mineralLine}. Nothing more needs saying.</p><div className="early-facts" aria-label="Product highlights"><div className="source-soul"><strong>From Source<br/>To Soul</strong><span>What begins as water becomes Shrotas.</span></div><div><strong>Mg · Ca · K</strong><span>{f.minerals.join(" · ")}</span></div><div><strong>750 ml</strong><span>{f.recyclable}</span></div></div></div></section>
    <section id="bottle" className="product-study"><div className="study-stage"><div className="stage-number">0{angle+1}</div>{studies.map((s,i)=><div key={s.src} className={`study-image ${i===angle?"is-active":""}`}><Image src={s.src} alt={`${s.kicker} view of the Shrotas bottle`} fill sizes="(max-width: 760px) 65vw, 38vw"/></div>)}<div className="study-caption"><p>{active.kicker}</p><h2>{active.title}</h2><span>{active.body}</span></div></div><div className="study-track" aria-label="Product facts">{studies.map((s,i)=><article className="study-step" key={s.src}><span>0{i+1}</span><h3>{s.title}</h3><p>{s.body}</p></article>)}</div></section>
    <section className={`scene water-lens ${portal?"is-open":""}`} onPointerMove={e=>{if(portal)return;const r=e.currentTarget.getBoundingClientRect();setLens({x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100})}} style={{"--lx":`${lens.x}%`,"--ly":`${lens.y}%`} as React.CSSProperties}>
      <div className="portal-field" aria-hidden>THE ART<br/>OF HYDRATION</div><button className="water-portal" type="button" onClick={()=>setPortal(v=>!v)} aria-expanded={portal} aria-label={portal?"Close Shrotas business portal":"Open Shrotas business portal"}><span className="portal-rest"><strong>SHROTAS</strong><small>Beyond the bottle</small></span><span className="portal-business"><small>Hospitality · Events · Distribution</small><strong>{businessContent.heading}</strong><i>Hospitality · Events · Distribution</i><b>{portal?"Close":"Explore"}</b></span></button><div className="business-action"><a className="primary-cta" href={businessContent.contact.emailHref}>Get in touch <span aria-hidden>↗</span></a><a href={businessContent.contact.phoneHref}>{businessContent.contact.phone}</a><a href={businessContent.contact.emailHref}>{businessContent.contact.email}</a></div><p className="lens-hint">{portal?"inside the water":"move through the water"}</p>
    </section>
    <footer id="contact" className="scene finale"><Image src={assets.front} alt="Shrotas bottle" width={260} height={760}/><div data-reveal><p className="eyebrow">SHROTAS</p><h2>The Art<br/>of Hydration.</h2><p>{f.category} · {f.volume}</p><div className="finale-contact"><a href={businessContent.contact.phoneHref}>{businessContent.contact.phone}</a><a href={businessContent.contact.emailHref}>{businessContent.contact.email}</a></div></div><small>© {new Date().getFullYear()} SHROTAS</small></footer>
  </main>;
}
