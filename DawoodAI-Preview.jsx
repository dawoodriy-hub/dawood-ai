// Dawood AI — Self-contained preview artifact
// This file mirrors src/App.jsx but is fully standalone (no CSS imports).
// Copy to claude.ai artifacts or use src/App.jsx + App.css for the real Vite app.

import { useState, useRef, useEffect, useCallback } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#050a14;color:#e2e8f0;font-family:'Syne',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:rgba(0,212,255,.2);border-radius:2px}
  ::selection{background:rgba(0,212,255,.25);color:#fff}
  @keyframes a1{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}33%{transform:translate(6%,-8%) scale(1.12) rotate(5deg)}66%{transform:translate(-4%,6%) scale(.93) rotate(-3deg)}}
  @keyframes a2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-10%,8%) scale(1.18)}}
  @keyframes a3{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}40%{transform:translate(8%,10%) scale(1.08) rotate(-6deg)}80%{transform:translate(-5%,-4%) scale(.96) rotate(4deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes glowPulse{0%,100%{box-shadow:0 0 12px rgba(0,212,255,.25)}50%{box-shadow:0 0 28px rgba(0,212,255,.5)}}
  .au1{animation:a1 13s ease-in-out infinite}
  .au2{animation:a2 16s ease-in-out infinite}
  .au3{animation:a3 19s ease-in-out infinite}
  .h1{animation:fadeUp .7s ease-out forwards}
  .h2{animation:fadeUp .7s ease-out .15s forwards;opacity:0}
  .h3{animation:fadeUp .7s ease-out .3s forwards;opacity:0}
  .h4{animation:fadeUp .7s ease-out .45s forwards;opacity:0}
  .shimmer-text{background:linear-gradient(90deg,#00d4ff,#7c3aed,#ff6b6b,#00d4ff);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite}
  .cursor{display:inline-block;width:8px;height:14px;background:#00d4ff;vertical-align:middle;animation:blink 1s step-end infinite}
  .msg{animation:msgIn .25s ease-out}
  .navlink{color:#475569;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:.02em;transition:color .2s}
  .navlink:hover{color:#e2e8f0}
  .fcrd{padding:22px 18px;border-radius:14px;background:rgba(12,21,38,.65);border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(16px);transition:all .25s;cursor:default}
  .fcrd:hover{transform:translateY(-4px);border-color:rgba(0,212,255,.22);box-shadow:0 12px 40px rgba(0,0,0,.35)}
  .abtn{display:flex;align-items:center;gap:12px;padding:13px 18px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#e2e8f0;font-size:14px;font-weight:500;cursor:pointer;font-family:'Syne',sans-serif;transition:background .2s;width:100%}
  .abtn:hover{background:rgba(255,255,255,.09)}
  .abtn:disabled{opacity:.45;cursor:not-allowed}
  .sblink{color:#64748b;text-decoration:none;font-size:13px;transition:color .2s;background:none;border:none;cursor:pointer;font-family:'Syne',sans-serif;padding:0}
  .sblink:hover{color:#e2e8f0}
  .input-base{width:100%;background:transparent;border:none;outline:none;color:#e2e8f0;font-size:14px;font-family:'Syne',sans-serif;padding:13px 16px;border-radius:12px}
  .cinput{width:100%;background:transparent;border:none;outline:none;color:#e2e8f0;font-size:15px;font-family:'Syne',sans-serif;resize:none;padding:16px 56px 16px 20px;max-height:180px;overflow-y:auto;line-height:1.6}
  .sidebar-btn{display:flex;align-items:center;padding:9px 12px;border-radius:8px;border:none;background:transparent;color:#64748b;font-size:13px;cursor:pointer;text-align:left;font-family:'Syne',sans-serif;width:100%;transition:all .2s;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sidebar-btn:hover{background:rgba(255,255,255,.04);color:#94a3b8}
  .sidebar-btn.active{background:rgba(0,212,255,.08);color:#e2e8f0}
  select{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#94a3b8;font-size:13px;border-radius:8px;padding:6px 12px;cursor:pointer;font-family:'Syne',sans-serif;outline:none}
`;

const FEATURES=[
  {icon:"⬡",title:"Code & Debug",desc:"Write, review, and fix code across any language or framework.",col:"#00d4ff"},
  {icon:"⚡",title:"Automate",desc:"Build scripts, workflows, and agents for repetitive tasks.",col:"#7c3aed"},
  {icon:"✦",title:"Create",desc:"Draft documents, strategies, and creative content instantly.",col:"#ff6b6b"},
  {icon:"◎",title:"Analyse",desc:"Process data and reason through complex problems.",col:"#f59e0b"},
];

const PROVIDERS=[
  {id:"google",label:"Continue with Google",icon:<svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>},
  {id:"microsoft",label:"Continue with Microsoft",icon:<svg width="17" height="17" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#f25022"/><rect x="13" y="1" width="10" height="10" fill="#7fba00"/><rect x="1" y="13" width="10" height="10" fill="#00a4ef"/><rect x="13" y="13" width="10" height="10" fill="#ffb900"/></svg>},
  {id:"github",label:"Continue with GitHub",icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>},
  {id:"apple",label:"Continue with Apple",icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>},
];

const CONVOS=["Explain how neural networks learn","Write a REST API in Node.js","Review my Python code for bugs","Plan a microservices architecture","Draft a technical blog post"];

const LOGO=(
  <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#00d4ff,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>D</div>
);

function Aurora(){
  const blob=(cls,s,top,left,right,bot,col)=>(
    <div className={cls} style={{position:"absolute",width:s,height:s,borderRadius:"50%",background:`radial-gradient(circle,${col} 0%,transparent 70%)`,top,left,right,bottom:bot,filter:"blur(70px)",pointerEvents:"none"}}/>
  );
  return(
    <div style={{position:"fixed",inset:0,overflow:"hidden",zIndex:0,pointerEvents:"none"}}>
      {blob("au1",680,-180,-120,undefined,undefined,"rgba(0,212,255,.17)")}
      {blob("au2",580,undefined,undefined,-90,"10%","rgba(124,58,237,.2)")}
      {blob("au3",480,undefined,undefined,undefined,-80,"rgba(255,107,107,.11)")}
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,212,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.018) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
    </div>
  );
}

function Navbar({onSignIn}){
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",height:60,background:"rgba(5,10,20,.75)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(0,212,255,.07)"}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        {LOGO}
        <span style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:18,fontWeight:600,background:"linear-gradient(135deg,#e2e8f0,#94a3b8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Dawood AI</span>
      </div>
      <div style={{display:"flex",gap:28}}>
        {["Features","Docs","GitHub","Terminal"].map(l=><a key={l} href="#" className="navlink">{l}</a>)}
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onSignIn} style={{padding:"7px 18px",borderRadius:8,border:"1px solid rgba(0,212,255,.3)",background:"transparent",color:"#00d4ff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",transition:"all .2s"}}
          onMouseEnter={e=>{e.target.style.background="rgba(0,212,255,.1)"}}
          onMouseLeave={e=>{e.target.style.background="transparent"}}>Log in</button>
        <button onClick={onSignIn} style={{padding:"7px 18px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#00d4ff,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",boxShadow:"0 4px 18px rgba(0,212,255,.3)",transition:"all .2s"}}
          onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";e.target.style.boxShadow="0 8px 28px rgba(0,212,255,.45)"}}
          onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 4px 18px rgba(0,212,255,.3)"}}>Sign up free</button>
      </div>
    </nav>
  );
}

function AuthModal({onClose,onAuth}){
  const [loading,setLoading]=useState(null);
  const [email,setEmail]=useState("");
  function go(id){setLoading(id);setTimeout(()=>onAuth(id),1100)}
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,.65)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s ease-out"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:400,borderRadius:22,background:"rgba(10,18,34,.97)",border:"1px solid rgba(0,212,255,.18)",boxShadow:"0 40px 80px rgba(0,0,0,.65)",padding:"36px 32px",animation:"fadeUp .22s ease-out"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:52,height:52,borderRadius:14,margin:"0 auto 14px",background:"linear-gradient(135deg,#00d4ff,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>D</div>
          <h2 style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:24,fontWeight:600,color:"#e2e8f0",marginBottom:6}}>Welcome to Dawood AI</h2>
          <p style={{color:"#475569",fontSize:13}}>Sign in to start chatting</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {PROVIDERS.map(({id,label,icon})=>(
            <button key={id} className="abtn" onClick={()=>go(id)} disabled={loading!==null}>
              {loading===id?<div style={{width:17,height:17,borderRadius:"50%",border:"2px solid rgba(255,255,255,.15)",borderTopColor:"#00d4ff",animation:"spin .7s linear infinite"}}/>:icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0"}}>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)"}}/>
          <span style={{color:"#1e293b",fontSize:11}}>or</span>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)"}}/>
        </div>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
          className="input-base"
          style={{border:"1px solid rgba(255,255,255,.07)",borderRadius:12,marginBottom:8}}
          onFocus={e=>e.target.style.borderColor="rgba(0,212,255,.35)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.07)"}/>
        <button onClick={()=>go("email")} disabled={loading!==null}
          style={{width:"100%",padding:13,borderRadius:12,border:"none",background:"linear-gradient(135deg,#00d4ff,#7c3aed)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",transition:"opacity .2s",opacity:loading?"0.7":"1"}}>
          Continue with email
        </button>
        <p style={{textAlign:"center",marginTop:16,color:"#1e293b",fontSize:11,lineHeight:1.6}}>
          By continuing you agree to our <a href="#" style={{color:"#00d4ff",textDecoration:"none"}}>Terms</a> and <a href="#" style={{color:"#00d4ff",textDecoration:"none"}}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

function HomePage({onSignIn}){
  const [val,setVal]=useState("");
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:110,zIndex:1,position:"relative"}}>
      <div style={{textAlign:"center",maxWidth:740,padding:"0 20px"}}>
        {/* Badge */}
        <div className="h1" style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:100,background:"rgba(0,212,255,.07)",border:"1px solid rgba(0,212,255,.18)",marginBottom:28}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#00d4ff",animation:"glowPulse 2s ease-in-out infinite"}}/>
          <span style={{color:"#00d4ff",fontSize:12,fontWeight:700,letterSpacing:".04em"}}>OPEN-SOURCE · v1.0.0</span>
        </div>

        {/* Headline */}
        <h1 className="h1" style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:"clamp(46px,6.5vw,76px)",fontWeight:300,lineHeight:1.08,letterSpacing:"-.025em",marginBottom:20,color:"#e2e8f0"}}>
          Meet{" "}
          <span className="shimmer-text">Dawood AI</span>
        </h1>

        <p className="h2" style={{fontSize:18,lineHeight:1.7,color:"#475569",marginBottom:44,maxWidth:520,margin:"0 auto 44px"}}>
          A powerful open-source AI agent for your terminal and browser.
          Code, automate, create — from the command line or the web.
        </p>

        {/* Input */}
        <div className="h3" style={{position:"relative",maxWidth:580,margin:"0 auto 22px"}}>
          <div style={{display:"flex",alignItems:"center",background:"rgba(10,18,34,.85)",border:"1px solid rgba(0,212,255,.2)",borderRadius:18,padding:"3px 3px 3px 20px",backdropFilter:"blur(20px)",boxShadow:"0 20px 55px rgba(0,0,0,.45),0 0 0 1px rgba(0,212,255,.04)",gap:10}}>
            <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&val.trim())onSignIn()}} placeholder="Ask Dawood anything…"
              style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#e2e8f0",fontSize:15,fontFamily:"'Syne',sans-serif",padding:"10px 0"}}/>
            <button onClick={onSignIn} style={{padding:"11px 22px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#00d4ff,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",whiteSpace:"nowrap",transition:"opacity .2s"}}
              onMouseEnter={e=>e.target.style.opacity=".85"}
              onMouseLeave={e=>e.target.style.opacity="1"}>Chat →</button>
          </div>
        </div>

        {/* CTA row */}
        <div className="h3" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:28,marginBottom:72}}>
          <button onClick={onSignIn} className="sblink">Sign up free</button>
          <span style={{color:"#1e293b"}}>·</span>
          <a href="#" className="sblink" style={{display:"flex",alignItems:"center",gap:7,color:"#64748b",textDecoration:"none"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,padding:"2px 8px",background:"rgba(255,255,255,.05)",borderRadius:6,border:"1px solid rgba(255,255,255,.07)"}}>npm i -g @dawood</span>
            Terminal
          </a>
        </div>
      </div>

      {/* Feature cards */}
      <div className="h4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,maxWidth:860,width:"100%",padding:"0 20px",marginBottom:72}}>
        {FEATURES.map(({icon,title,desc,col})=>(
          <div key={title} className="fcrd">
            <div style={{fontSize:22,marginBottom:10,color:col,fontFamily:"'JetBrains Mono',monospace"}}>{icon}</div>
            <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:6,letterSpacing:"-.01em"}}>{title}</div>
            <div style={{fontSize:12,color:"#475569",lineHeight:1.65}}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Terminal preview */}
      <div className="h4" style={{width:"100%",maxWidth:640,padding:"0 20px",marginBottom:80}}>
        <div style={{background:"#080e1c",border:"1px solid rgba(0,212,255,.1)",borderRadius:14,overflow:"hidden",boxShadow:"0 40px 70px rgba(0,0,0,.55)"}}>
          <div style={{padding:"10px 14px",background:"rgba(0,0,0,.3)",display:"flex",alignItems:"center",gap:7,borderBottom:"1px solid rgba(255,255,255,.04)"}}>
            {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}
            <span style={{marginLeft:8,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#334155"}}>dawood — zsh</span>
          </div>
          <div style={{padding:"18px 22px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:2}}>
            <div style={{color:"#334155"}}>$ npm install -g @dawood</div>
            <div style={{color:"#22c55e"}}>✓ Installed @dawood/cli@1.0.0 globally</div>
            <div style={{color:"#334155",marginTop:6}}>$ dawood</div>
            <div style={{color:"#00d4ff",marginTop:4,fontSize:11,lineHeight:1.5}}>
              ██████╗  █████╗ ██╗    ██╗ ██████╗  ██████╗ ██████╗<br/>
              ██╔══██╗██╔══██╗██║    ██║██╔═══██╗██╔═══██╗██╔══██╗<br/>
              ██║  ██║███████║██║ █╗ ██║██║   ██║██║   ██║██║  ██║<br/>
            </div>
            <div style={{color:"#475569",fontSize:11}}>  Dawood AI Chatbot — v1.0.0 · Open-Source · MIT</div>
            <div style={{color:"#475569",fontSize:11,marginTop:6}}>  Type /help for commands, /key YOUR_KEY to start</div>
            <div style={{marginTop:10,color:"#334155"}}>  › <span className="cursor"/></div>
          </div>
        </div>
      </div>

      <footer style={{width:"100%",padding:"20px 28px",borderTop:"1px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{color:"#1e293b",fontSize:12}}>© 2025 Dawood AI · Open Source (MIT)</span>
        <div style={{display:"flex",gap:22}}>
          {["GitHub","Docs","Discord","npm"].map(l=><a key={l} href="#" className="sblink" style={{fontSize:12}}>{l}</a>)}
        </div>
      </footer>
    </div>
  );
}

function ChatPage({user,onOut}){
  const [msgs,setMsgs]=useState([{role:"assistant",content:`Hello${user?.name?`, ${user.name}`:""}! I'm Dawood AI. Ask me to write code, debug issues, explain concepts, or automate anything. What shall we build today?`}]);
  const [inp,setInp]=useState("");
  const [typing,setTyping]=useState(false);
  const btmRef=useRef(null);

  useEffect(()=>{btmRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const send=useCallback(()=>{
    if(!inp.trim()||typing)return;
    const q=inp.trim();
    setInp("");
    setMsgs(p=>[...p,{role:"user",content:q}]);
    setTyping(true);
    const answers=[
      "Great question! Here's a concise approach:\n\n```javascript\nasync function fetchData(url) {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}\n```\n\nThis handles errors gracefully and works in any modern JS environment. Want me to add retry logic or TypeScript types?",
      "Absolutely — here's a clean breakdown:\n\n**1. Define your goal clearly** — what's the expected input/output?\n\n**2. Choose the right data structure** — arrays for ordered data, objects for keyed lookups.\n\n**3. Test edge cases** — null inputs, empty arrays, maximum values.\n\nShall I write a full implementation?",
      "That's a classic architecture challenge. The key insight is to separate your concerns: use a thin API gateway, stateless service workers, and a persistent data layer. Here's how I'd structure it...",
    ];
    const resp=answers[Math.floor(Math.random()*answers.length)];
    let i=0,cur="";
    setMsgs(p=>[...p,{role:"assistant",content:""}]);
    const iv=setInterval(()=>{
      if(i<resp.length){cur+=resp[i];setMsgs(p=>{const u=[...p];u[u.length-1]={role:"assistant",content:cur};return u});i++;}
      else{clearInterval(iv);setTyping(false);}
    },14);
  },[inp,typing]);

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"'Syne',sans-serif"}}>
      {/* Sidebar */}
      <div style={{width:250,flexShrink:0,background:"rgba(5,10,20,.97)",borderRight:"1px solid rgba(0,212,255,.07)",display:"flex",flexDirection:"column",padding:"14px 10px",backdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 8px",marginBottom:18}}>
          {LOGO}
          <span style={{fontFamily:"'Fraunces',Georgia,serif",fontSize:15,fontWeight:600,background:"linear-gradient(135deg,#e2e8f0,#94a3b8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Dawood AI</span>
        </div>
        <button style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:10,border:"1px solid rgba(0,212,255,.2)",background:"rgba(0,212,255,.06)",color:"#00d4ff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Syne',sans-serif",marginBottom:14,transition:"all .2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(0,212,255,.12)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(0,212,255,.06)"}>
          <span style={{fontSize:16,lineHeight:1}}>+</span> New chat
        </button>
        <div style={{color:"#1e293b",fontSize:11,fontWeight:700,letterSpacing:".1em",padding:"0 8px",marginBottom:7}}>RECENT</div>
        {CONVOS.map((t,i)=>(
          <button key={i} className={`sidebar-btn${i===0?" active":""}`}>{t}</button>
        ))}
        <div style={{marginTop:"auto",padding:"12px 8px",borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#00d4ff,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{user?.name?.[0]||"D"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:"#e2e8f0",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name||"User"}</div>
              <div style={{color:"#334155",fontSize:11}}>Free plan</div>
            </div>
            <button onClick={onOut} style={{padding:"3px 8px",borderRadius:6,border:"1px solid rgba(255,255,255,.06)",background:"transparent",color:"#334155",fontSize:11,cursor:"pointer",fontFamily:"'Syne',sans-serif",flexShrink:0}}>Out</button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",background:"#050a14",overflow:"hidden"}}>
        <div style={{padding:"14px 28px",borderBottom:"1px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",gap:10}}>
          <select><option>dawood-sonnet (default)</option><option>dawood-opus</option><option>dawood-haiku</option></select>
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:"auto",padding:"28px",display:"flex",flexDirection:"column",gap:22}}>
          {msgs.map((m,i)=>(
            <div key={i} className="msg" style={{display:"flex",gap:14,justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant"&&<div style={{width:30,height:30,borderRadius:9,flexShrink:0,marginTop:2,background:"linear-gradient(135deg,#00d4ff,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>D</div>}
              <div style={{maxWidth:"72%",padding:"13px 17px",borderRadius:15,background:m.role==="user"?"linear-gradient(135deg,rgba(0,212,255,.13),rgba(124,58,237,.13))":"rgba(255,255,255,.04)",border:`1px solid ${m.role==="user"?"rgba(0,212,255,.18)":"rgba(255,255,255,.05)"}`,color:"#e2e8f0",fontSize:14,lineHeight:1.72,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                {m.content||<span className="cursor" style={{width:7,height:13,display:"inline-block"}}/>}
              </div>
            </div>
          ))}
          {typing&&msgs[msgs.length-1]?.content&&(
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#00d4ff,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>D</div>
              <div style={{display:"flex",gap:5}}>
                {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"#00d4ff",animation:`glowPulse 1.2s ease-in-out ${i*.2}s infinite`,opacity:.55}}/>)}
              </div>
            </div>
          )}
          <div ref={btmRef}/>
        </div>

        {/* Input */}
        <div style={{padding:"18px 28px 24px"}}>
          <div style={{position:"relative",background:"rgba(10,18,34,.85)",border:"1px solid rgba(0,212,255,.18)",borderRadius:15,backdropFilter:"blur(20px)",boxShadow:"0 0 35px rgba(0,212,255,.04)"}}>
            <textarea className="cinput" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Message Dawood AI…" rows={1}/>
            <button onClick={send} disabled={!inp.trim()||typing} style={{position:"absolute",right:10,bottom:10,width:34,height:34,borderRadius:9,border:"none",background:inp.trim()&&!typing?"linear-gradient(135deg,#00d4ff,#7c3aed)":"rgba(255,255,255,.05)",color:inp.trim()&&!typing?"#fff":"#334155",cursor:inp.trim()&&!typing?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,transition:"all .2s",fontFamily:"'Syne',sans-serif"}}>↑</button>
          </div>
          <div style={{textAlign:"center",marginTop:8,color:"#1e293b",fontSize:11}}>Dawood AI can make mistakes. Verify important information.</div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("home");
  const [showAuth,setShowAuth]=useState(false);
  const [user,setUser]=useState(null);

  const handleAuth=(provider)=>{
    setUser({name:"Dawood",provider});
    setShowAuth(false);
    setView("chat");
  };

  if(view==="chat"&&user)return<ChatPage user={user} onOut={()=>{setUser(null);setView("home")}}/>;

  return(
    <>
      <style>{CSS}</style>
      <Aurora/>
      <Navbar onSignIn={()=>setShowAuth(true)}/>
      <HomePage onSignIn={()=>setShowAuth(true)}/>
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={handleAuth}/>}
    </>
  );
}