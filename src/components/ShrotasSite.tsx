"use client";
import { useCallback,useEffect,useRef,useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroScene } from "./HeroScene";
import { assets,businessContent,productFacts as f } from "@/data/productFacts";

const studies=[
  {src:assets.front,kicker:"Front / 01",title:f.tagline,body:`${f.category} · ${f.volume}`},
  {src:assets.side,kicker:"Mineral study / 02",title:"Essential minerals.",body:`${f.minerals.join(" · ")} · ${f.ph}`},
  {src:assets.back,kicker:"From source",title:"To Soul.",body:"From Source to Soul"},
];

export function ShrotasSite(){
  const root=useRef<HTMLElement>(null),[entered,setEntered]=useState(false),[angle,setAngle]=useState(0),[lens,setLens]=useState({x:50,y:50}),[portal,setPortal]=useState(false);
  const ready=useCallback(()=>setEntered(true),[]);
  useEffect(()=>{gsap.registerPlugin(ScrollTrigger);if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const ctx=gsap.context(()=>{
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el=>gsap.fromTo(el,{y:50,opacity:0},{y:0,opacity:1,duration:1.1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 84%"}}));
    gsap.to(".manifesto-type",{xPercent:-13,ease:"none",scrollTrigger:{trigger:"#story",start:"top bottom",end:"bottom top",scrub:1}});
    gsap.utils.toArray<HTMLElement>(".study-step").forEach((el,i)=>ScrollTrigger.create({trigger:el,start:"top center",end:"bottom center",onEnter:()=>setAngle(i),onEnterBack:()=>setAngle(i)}));
  },root);return()=>ctx.revert()},[]);
  const active=studies[angle];
  return <main ref={root} className={entered?"site-entered":""}><HeroScene onReady={ready}/>
    <header className="nav"><a href="#top" className="wordmark">SHROTAS</a><nav aria-label="Primary"><a href="#story">Philosophy</a><a href="#bottle">Bottle</a><a href="#contact">Contact</a></nav></header>
    <section id="story" className="scene manifesto"><div className="manifesto-type" aria-hidden>THE ART OF HYDRATION</div><div className="manifesto-copy" data-reveal><p className="eyebrow">SHROTAS / 750 ML</p><h1>An everyday essential, treated like an object of design.</h1><p>{f.mineralLine}. Nothing more needs saying.</p></div></section>
    <section id="bottle" className="product-study"><div className="study-stage"><div className="stage-number">0{angle+1}</div>{studies.map((s,i)=><div key={s.src} className={`study-image ${i===angle?"is-active":""}`}><Image src={s.src} alt={`${s.kicker} of the Shrotas bottle`} fill sizes="(max-width: 760px) 65vw, 38vw"/></div>)}<div className="study-caption"><p>{active.kicker}</p><h2>{active.title}</h2><span>{active.body}</span></div></div><div className="study-track">{studies.map((s,i)=><article className="study-step" key={s.src}><span>0{i+1}</span><h3>{s.title}</h3></article>)}</div></section>
    <section className={`scene water-lens ${portal?"is-open":""}`} onPointerMove={e=>{if(portal)return;const r=e.currentTarget.getBoundingClientRect();setLens({x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100})}} style={{"--lx":`${lens.x}%`,"--ly":`${lens.y}%`} as React.CSSProperties}>
      <div className="portal-field" aria-hidden>THE ART<br/>OF HYDRATION</div><button className="water-portal" type="button" onClick={()=>setPortal(v=>!v)} aria-expanded={portal} aria-label={portal?"Close Shrotas business portal":"Open Shrotas business portal"}><span className="portal-rest"><strong>SHROTAS</strong><small>Beyond the bottle</small></span><span className="portal-business"><small>Partnerships / Hospitality / Events</small><strong>{businessContent.heading}</strong><i>{businessContent.categories.join(" · ")}</i><span className="business-contact"><a href={businessContent.contact.phoneHref} onClick={e=>e.stopPropagation()}>{businessContent.contact.phone}</a><a href={businessContent.contact.emailHref} onClick={e=>e.stopPropagation()}>{businessContent.contact.email}</a></span><b>{portal?"Close":"Explore"}</b></span></button><p className="lens-hint">{portal?"inside the water":"move through the water"}</p>
    </section>
    <footer id="contact" className="scene finale"><Image src={assets.front} alt="Shrotas bottle" width={260} height={760}/><div data-reveal><p className="eyebrow">SHROTAS</p><h2>The Art<br/>of Hydration.</h2><p>{f.category} · {f.volume}</p><div className="finale-contact"><a href={businessContent.contact.phoneHref}>{businessContent.contact.phone}</a><a href={businessContent.contact.emailHref}>{businessContent.contact.email}</a></div></div><small>© {new Date().getFullYear()} SHROTAS</small></footer>
  </main>;
}
