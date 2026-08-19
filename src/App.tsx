import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView, useSpring, useMotionValue } from "framer-motion";

import CarouselCylindricalVariant1 from "@/components/CarouselCylindricalVariant1";
const colors = {
  ocean: "#0A3D62",
  oceanDeep: "#072641",
  green: "#1E8449",
  copper: "#CD7F32",
  aqua: "#00D2FF",
  aquaSoft: "#55e6fb",
  sand: "#F5F0E8",
  charcoal: "#1A1A2E",
  charcoal2: "#141425",
  slate: "#23364b",
};

const HERO_VIDEO = "https://videos.pexels.com/video-files/7109028/7109028-uhd_3840_2160_25fps.mp4";
const WATER_TAP = "https://videos.pexels.com/video-files/29251309/12621376_1920_1080_30fps.mp4";

const gardenImages = {
  knysna: "https://images.pexels.com/photos/38201192/pexels-photo-38201192.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  heads: "https://images.pexels.com/photos/36764016/pexels-photo-36764016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  valley: "https://images.pexels.com/photos/5359990/pexels-photo-5359990.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  copperPipes: "https://images.pexels.com/photos/28169591/pexels-photo-28169591.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  plumber: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  bath1: "https://images.pexels.com/photos/19608778/pexels-photo-19608778.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  bath2: "https://images.pexels.com/photos/19013525/pexels-photo-19013525.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  bath3: "https://images.pexels.com/photos/19666087/pexels-photo-19666087.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  radInstall: "https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

const services = [
  { id:"plumbing", icon:"🔧", title:"General Plumbing", desc:"Full residential & commercial systems. Precision joints, pressure balance, forever-fit finishes.", color:"#00D2FF"},
  { id:"bath", icon:"🚿", title:"Bathroom Renovations", desc:"Bathroom remodels, sauna installations, leak free guarentee.", color:"#22c55e"},
  { id:"leak", icon:"🌊", title:"Leak Detection", desc:"Fast and accurate leak detection. Quick repair, satisfation guarantee.", color:"#00D2FF"},
  { id:"install", icon:"🏗️", title:"New Installations", desc:"Coastal-grade copper & PEX. Salt air rated fittings for homes from Hartenbos to Plett.", color:"#CD7F32"},
  { id:"geyser", icon:"🔥", title:"Geyser Repairs", desc:"Burst geyser, we’re here for you. Full replacements and repairs.", color:"#f59e0b"},
  { id:"drain", icon:"🧹", title:"Drain Cleaning", desc:"High-pressure jetting. Roots from forest properties cleared – camera verified.", color:"#1E8449"},
  { id:"filter", icon:"💧", title:"Water Filtration", desc:"Tank, borehole & municipal. Johannesburg / Central Gauteng water – pure, mineral balanced.", color:"#00D2FF"},
  { id:"emerg", icon:"🚨", title:"Emergency Callouts", desc:"True 24/7. Average 38min response inside route corridor. Live GPS dispatch.", color:"#ff4d6d"},
];

const serviceTowns = [
  { name:"Mossel Bay", time:"22 min", lat: 71, lon: 18, quote:"Fixed our geyser burst at midnight. Legends." },
  { name:"Hartenbos", time:"26 min", lat: 66, lon: 23, quote:"So neat you'd never know they were here." },
  { name:"George", time:"18 min", lat: 60, lon: 29, quote:"Full house re-pipe. Flawless." },
  { name:"Nature's Valley", time:"42 min", lat: 33, lon: 76, quote:"Forest pipe roots cleared permanently." },
  { name:"Storms River", time:"47 min", lat: 28, lon: 86, quote:"Worth every km. True pros." },
];

const testimonials = [
  { name:"Liezl van Rooyen", area:"Knysna Heads", text:"We redid our entire water system with GRP. Copper detailing is museum-level. Their respect for our lagoon home was incredible.", stars:5, avatar:"LV" },
  { name:"André & Sanet Botha", area:"Wilderness Beach", text:"Burst main at 3:12am in a storm. They were at the door 27 minutes later. Punctual Plumbers is not marketing — it’s real.", stars:5, avatar:"AB" },
  { name:"Michael Chen", area:"Plettenberg Bay", text:"Whole-house filtration + copper re-pipe. Water bill -64%, pressure perfect. They even sent Johannesburg / Central Gauteng water quality reports.", stars:5, avatar:"MC" },
  { name:"Nandi Mbeki", area:"George", text:"Three plumbers failed to find the slab leak. GRP found it in 14 minutes with thermal. Saved our oak floors.", stars:5, avatar:"NM" },
];

function AnimatedNumber({ value, suffix="", prefix="" } : { value:number, suffix?:string, prefix?:string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 40, stiffness: 80 });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if(isInView){ motionValue.set(value); }
  }, [isInView, value, motionValue]);
  useEffect(() => {
    const unsub = springValue.on("change", latest => setDisplay(Math.floor(latest)));
    return () => unsub();
  }, [springValue]);
  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset:["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0,1], ["0%", "32%"]);
  const heroOpacity = useTransform(scrollYProgress, [0,0.85], [1,0]);
  const heroScale = useTransform(scrollYProgress, [0,1], [1,1.08]);

  const [activeService, setActiveService] = useState<string | null>(null);
  const [beforeAfter, setBeforeAfter] = useState(55);
  const [mapActive, setMapActive] = useState(serviceTowns[5]);
  const [mobileMenu, setMobileMenu] = useState(false);


  const [people, setPeople] = useState(3);
  const [showers, setShowers] = useState(14);
  const [garden, setGarden] = useState(true);
  const calcSavings = useMemo(() => {
    const base = people*210 + showers*9 + (garden?650:0);
    const saved = Math.round(base * 0.37);
    const rand = Math.round(saved * 84 / 1000);
    return { litres: saved*30, rand: rand, co2: Math.round(saved*0.018) };
  }, [people, showers, garden]);



  // testimonial carousel
  const [tIdx, setTIdx] = useState(0);
  useEffect(()=> {
    const id = setInterval(()=> setTIdx(i=>(i+1)%testimonials.length), 5300);
    return ()=>clearInterval(id);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        backgroundColor: colors.charcoal,
        color: "#f6f6f6",
      }}
      className="min-h-screen antialiased overflow-x-clip"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&display=swap');
        h1,h2,h3,.display { font-family: 'Outfit', 'Inter', sans-serif; letter-spacing:-0.018em; }
        ::selection { background:#00d2ff33; color:#fff; }
        * { scrollbar-width: thin; scrollbar-color: #00D2FF33 #0b1b2b;}
        @keyframes pingSlow { 75%,100% { transform: scale(2.6); opacity:0;} }
        @keyframes waveShift { 0% { background-position:0% 50% } 50% { background-position:100% 50% } 100% { background-position:0% 50% } }
        @keyframes floatY { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px)} }
        @keyframes drip { 0% { transform: translateY(-6px); opacity:0 } 30% { opacity:1 } 100% { transform: translateY(14px); opacity:0 } }
        @keyframes ripplePulse { 0% { box-shadow:0 0 0 0 #00d2ff55 } 70% { box-shadow:0 0 0 18px #00d2ff00 } 100% { box-shadow:0 0 0 0 #00d2ff00 } }
        @keyframes copperSpin { to { transform: rotate(360deg) } }
        .glass { backdrop-filter: blur(18px) saturate(160%); -webkit-backdrop-filter: blur(18px) saturate(160%); background: rgba(14,27,46,0.58); border:1px solid rgba(255,255,255,0.09); }
        .glass-light { backdrop-filter: blur(16px) saturate(150%); -webkit-backdrop-filter: blur(16px) saturate(150%); background: rgba(245,240,232,0.82); border:1px solid rgba(10,61,98,0.07); }
        .water-grid { background-image: linear-gradient(rgba(0,210,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.05) 1px, transparent 1px); background-size: 42px 42px; }
        .no-scrollbar::-webkit-scrollbar { display:none }
        input[type=range] { accent-color: #00D2FF; }
      `}</style>

      {/* NAV */}
      <motion.nav
        initial={{ y:-18, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
        className="fixed top-0 z-[60] w-full"
      >
        <div className="mx-auto max-w-[1250px] px-4 sm:px-7 pt-4">
          <div className="glass rounded-2xl px-4 sm:px-6 py-[13px] flex items-center justify-between shadow-[0_12px_60px_rgba(0,0,0,0.38)]">
            <div className="flex items-center gap-3">
              <img src="/plumbers-logo.png" alt="Punctual Plumbers" className="h-[64px] w-auto" />
              
              <div className="hidden lg:block ml-5 pl-5 border-l border-white/10 text-[11px] text-white/56 leading-snug">
                Serving Johannesburg & Central Gauteng<br/>Since 2009 • PIRB 3419
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-8 text-[13.5px] text-white/80 font-[500]">
              {["Services","Process","Coverage","Reviews","Journal"].map(l=>(
                <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <a href="#quote" className="hidden sm:inline-flex text-[12.5px] font-[600] text-white/85 hover:text-white transition">Get Quote</a>
              <a href="tel:+27832379132" className="relative px-[15px] sm:px-[18px] py-[10px] rounded-full text-[12.5px] sm:text-[13px] font-[700] text-[#041a2a] overflow-hidden"
                 style={{ background: `linear-gradient(120deg, ${colors.aqua}, #8ef7ff)` }}>
                <span className="relative z-10">📞 083 237 9132</span>
                <span className="absolute inset-0 opacity-[0.22]" style={{ background:"linear-gradient(95deg, transparent, #fff, transparent)", animation:"waveShift 4.2s infinite" }} />
              </a>
              <button onClick={()=>setMobileMenu(!mobileMenu)} className="xl:hidden ml-1 px-2 py-1 text-white/80 text-[22px]">≡</button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity:0, y:-8 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }}
              className="xl:hidden mx-4 mt-2 glass rounded-2xl px-4 py-4 text-[14px] text-white/85"
            >
              {["Services","Process","Coverage","Reviews","Journal"].map(l=>(
                <a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setMobileMenu(false)} className="block py-2 border-b border-white/7 last:border-0">{l}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[740px] w-full overflow-hidden">
        <motion.div style={{ y:heroY, scale:heroScale }} className="absolute inset-0">
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={gardenImages.knysna}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          {/* Cinematic overlays */}
          <div className="absolute inset-0" style={{
            background: `
              linear-gradient(180deg, rgba(7,14,26,0.37) 0%, rgba(7,14,26,0.14) 34%, rgba(6,18,34,0.64) 78%, rgba(16,19,38,1) 100%),
              radial-gradient(1200px 700px at 78% 18%, rgba(0,210,255,0.10), transparent 60%),
              radial-gradient(900px 560px at 15% 78%, rgba(30,132,73,0.13), transparent 62%)
            `
          }}/>
          <div className="absolute inset-0 opacity-[0.045] water-grid pointer-events-none" />
          {/* water vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(1200px 540px at 50% 65%, transparent 32%, rgba(3,8,16,0.36) 100%)"
          }}/>
        </motion.div>

        {/* Floating coastal text */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full mx-auto max-w-[1250px] px-5 sm:px-7 flex flex-col justify-center pt-[88px]">
          <div className="mt-6 sm:mt-8 max-w-[980px]">
            <h1 className="display text-[44px] sm:text-[64px] lg:text-[84px] leading-[0.89] font-[800] tracking-[-0.022em] text-white"
                style={{ textShadow:"0 18px 55px rgba(0,0,0,.52)"}}>
              <span style={{
                background: `linear-gradient(98deg, #bdf7ff 0%, ${colors.aqua} 38%, #4ff0b2 100%)`,
                WebkitBackgroundClip:"text",
                backgroundClip:"text",
                color:"transparent"
              }}>Punctual Plumbers.</span>
            </h1>
          </div>

          <div className="mt-7 grid lg:grid-cols-[minmax(0,1fr)_430px] gap-8 items-end">
            <div>
              <p className="text-[17px] sm:text-[19px] leading-relaxed text-white/80 max-w-[600px]">
                The Johannesburg / Central Gauteng’s trusted plumbers. From emergency leaks to full installations — reliable craftsmanship built for home and business.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-[11.7px] font-[600] text-white/72">
                <span className="px-3 py-[7px] rounded-full border border-white/14 bg-white/[0.045]">PIRB 3419 • Licensed</span>
                <span className="px-3 py-[7px] rounded-full border border-white/14 bg-white/[0.045]">⭐ 4.9 / Google 312 reviews</span>
                <span className="px-3 py-[7px] rounded-full border border-white/14 bg-white/[0.045]">Coastal Grade Copper</span>
              </div>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href="#quote"
                   className="group relative px-[26px] py-[15px] rounded-[16px] font-[750] text-[15px] text-[#04212f] overflow-hidden shadow-[0_12px_40px_rgba(0,210,255,0.28)]"
                   style={{ background: `linear-gradient(135deg, ${colors.aqua}, #7fefff)` }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    💧 Get a Free Quote
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                  <span className="absolute -right-10 -top-10 h-24 w-24 rounded-full blur-[34px] bg-white/30 group-hover:scale-110 transition" />
                </a>
                <a href="https://wa.me/27832379132?text=Hi%20Punctual%20Plumbers%20-%20Emergency%20at%20" target="_blank" rel="noreferrer"
                   className="px-[22px] py-[15px] rounded-[16px] glass text-[14.5px] font-[650] text-white">
                  📱 WhatsApp 24/7
                </a>
              </div>
              <div className="mt-4 text-[12.2px] text-white/56">
                Trusted across the Johannesburg / Central Gauteng — since 2009
              </div>
            </div>

            {/* liquid-glass panel */}
            <motion.div
              initial={{ opacity:0, y:30, scale:0.985 }}
              animate={{ opacity:1, y:0, scale:1 }}
              transition={{ delay:0.55, duration:0.9, ease:[0.22,1,0.36,1] }}
              className="relative rounded-[26px] overflow-hidden"
              style={{
                background:"linear-gradient(180deg, rgba(13,27,44,0.78), rgba(9,19,32,0.87))",
                border:"1px solid rgba(255,255,255,0.095)",
                boxShadow:"0 32px 80px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.055)"
              }}
            >
              <div className="absolute -right-16 -top-16 w-[180px] h-[180px] rounded-full blur-[70px] opacity-25" style={{ background: colors.aqua }} />
              <div className="p-[22px]">
                <div className="text-[11px] tracking-[0.18em] text-[#94f0ff] font-[700]">LIVE ROUTE BOARD</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                  {[
                    {k:"38m", s:"Avg arrival"},
                    {k:"9", s:"Vans active"},
                    {k:"24/7", s:"Dispatch"},
                    {k:"0", s:"Call-out if hired"},
                  ].map(c=>(
                    <div key={c.s} className="rounded-[16px] py-3" style={{ background:"rgba(255,255,255,0.032)", border:"1px solid rgba(255,255,255,0.06)"}}>
                      <div className="display text-[22px] font-[800] text-white">{c.k}</div>
                      <div className="text-[10.8px] text-white/54">{c.s}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[14px] overflow-hidden border border-white/[0.08]">
                  <video src={WATER_TAP} autoPlay loop muted playsInline className="w-full h-[108px] object-cover opacity-90" />
                </div>
                <div className="mt-[14px] text-[11.8px] leading-relaxed text-white/76">
                  <span className="text-[#91f3ff] font-[650]">Next available:</span> Today 14:40 – Knysna / Sedgefield loop.
                  <br/>Emergency triage line open now.
                </div>
              </div>
              <div className="h-[3px] w-full"
                style={{
                  background:`linear-gradient(90deg, ${colors.ocean}, ${colors.aqua}, ${colors.green}, ${colors.copper})`,
                  backgroundSize:"200% 100%",
                  animation:"waveShift 8s linear infinite"
                }}
              />
            </motion.div>
          </div>

          </motion.div>
        {/* bottom fade into charcoal */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none"
          style={{ background:"linear-gradient(180deg, rgba(26,26,46,0) 0%, #1A1A2E 82%)" }} />
      </section>

      {/* Trust ribbon */}
      <section className="relative z-20 mt-8 pb-6">
        <div className="mx-auto max-w-[1250px] px-5 sm:px-7">
          <div className="rounded-[20px] px-4 sm:px-7 py-[16px] flex flex-wrap items-center justify-center sm:justify-between gap-4 text-[12.3px] sm:text-[13px]"
            style={{ background:"#101629", border:"1px solid rgba(255,255,255,0.073)", boxShadow:"0 20px 60px rgba(0,0,0,0.42)" }}>
            {[
              "⭐ 4.9/5 Google Rating",
              "🏆 Johannesburg's #1 Rated Plumber",
              "🛡️ Fully Licensed & Insured PIRB",
              "🌍 Proud Local Business – 100% Gauteng Team",
            ].map(t=> <span key={t} className="text-white/72 font-[500]">{t}</span>)}
          </div>
        </div>
      </section>

      {/* Scene 1 – Johannesburg / Central Gauteng deserves better */}
      <section id="services" className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12]"
             style={{ backgroundImage:`url(${gardenImages.heads})`, backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed" }} />
        <div className="absolute inset-0"
             style={{ background:`linear-gradient(180deg, ${colors.charcoal} 0%, rgba(26,26,46,0.92) 16%, rgba(11,32,52,0.58) 50%, rgba(26,26,46,0.97) 100%)`}}/>
        <div className="relative mx-auto max-w-[1250px] px-5 sm:px-7">
          <motion.div
            initial={{ opacity:0, y:32 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:"-120px" }}
            transition={{ duration:0.78 }}
            className="max-w-[900px]"
          >

            </div>
      </section>

      {/* Scene 2 – Services */}
      <section className="relative py-14 sm:py-20" style={{ background:`linear-gradient(180deg, ${colors.charcoal} 0%, ${colors.charcoal2} 100%)` }}>
        <div className="mx-auto max-w-[1250px] px-5 sm:px-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
            <div>
            <h2 className="display text-[34px] sm:text-[48px] font-[800] mt-3">What we can do for you.</h2>
            </div>
</div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[14px] sm:gap-[20px]">
            {services.map((s,idx)=>(
              <motion.div
                key={s.id}
                initial={{ opacity:0, y:28 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:"-80px" }}
                transition={{ delay: idx*0.045, duration:0.55 }}
                onMouseEnter={()=>setActiveService(s.id)}
                onMouseLeave={()=>setActiveService(null)}
                className="group relative rounded-[24px] p-[20px] sm:p-[24px] cursor-pointer overflow-hidden"
                style={{
                  background: activeService===s.id
                    ? "linear-gradient(170deg, rgba(23,48,76,0.98), rgba(8,24,44,0.98))"
                    : "linear-gradient(170deg, rgba(255,255,255,0.038), rgba(255,255,255,0.016))",
                  border:"1px solid rgba(255,255,255,0.085)",
                  boxShadow: activeService===s.id ? `0 20px 70px rgba(0,210,255,0.13), inset 0 0 0 1px ${s.color}33` : "none",
                  transform: activeService===s.id ? "translateY(-4px)" : "translateY(0)",
                  transition:"all .34s cubic-bezier(.22,1,.36,1)"
                }}
              >
                <div className="text-[30px]">{s.icon}</div>
                <div className="mt-4 display text-[19px] font-[750] tracking-[-0.01em] text-white">{s.title}</div>
                <p className="mt-[10px] text-[13.4px] leading-relaxed text-white/66">{s.desc}</p>
                {/* animated copper pipe accent */}
                <div className="absolute -right-8 -bottom-8 w-[110px] h-[110px] rounded-full opacity-[0.07]"
                     style={{ background:`radial-gradient(circle, ${s.color} 0%, transparent 70%)`}}/>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Scene 2.5 — Did You Know? 3D CoverFlow Carousel */}
      <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background:`linear-gradient(180deg, ${colors.charcoal2} 0%, ${colors.oceanDeep} 100%)` }}>
        <div className="absolute inset-0 opacity-[0.06] water-grid pointer-events-none" />
        <div className="mx-auto max-w-[1250px] px-5 sm:px-7">
            <div className="max-w-[720px]">
            <h2 className="display text-[34px] sm:text-[48px] font-[800] mt-3 text-white">Water wisdom from the Route.</h2>
          </div>
          <div className="mt-12 relative" style={{ perspective:"1300px" }}>
            <div className="relative h-[340px] sm:h-[380px] flex items-center justify-center">
              <CarouselCylindricalVariant1 />
            </div>
          </div>
        </div>
      </section>
      {/* Before / After */}
      <section className="py-20 sm:py-24" style={{ background: colors.charcoal }}>
        <div className="mx-auto max-w-[1100px] px-5 sm:px-7">
          <div className="text-center max-w-[750px] mx-auto">
            <h3 className="display text-[32px] sm:text-[44px] font-[800] mt-3">Drag the water line.</h3>
            <p className="text-white/68 mt-3 text-[15.5px]">Knysna lagoon cottage – full copper re-pipe + designer bath. 11 days, zero dust in living areas.</p>
          </div>

          <div className="mt-10 relative rounded-[24px] overflow-hidden border border-white/[0.10] shadow-[0_30px_90px_rgba(0,0,0,0.48)]">
            <div className="relative h-[380px] sm:h-[520px] w-full">
              <img src={gardenImages.bath2} alt="After" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ clipPath:`inset(0 ${100-beforeAfter}% 0 0)` }}>
                <img src={gardenImages.bath3} alt="Before" className="h-full w-full object-cover saturate-[.65] brightness-[.82]" />
                <div className="absolute inset-0 bg-[#06243a]/28" />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#031827]/78 text-[11.5px] font-[700] text-white/90 border border-white/14">BEFORE – 1998 tile / galvanized</div>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#00d2ff]/95 text-[11.5px] font-[750] text-[#04212d]">AFTER – Coastal copper / travertine</div>

              {/* divider */}
              <div className="absolute top-0 bottom-0" style={{ left:`${beforeAfter}%` }}>
                <div className="absolute top-0 bottom-0 w-[2.5px] -translate-x-1/2" style={{ background: colors.aqua, boxShadow:`0 0 28px ${colors.aqua}` }} />
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[48px] h-[48px] rounded-full flex items-center justify-center"
                     style={{ background: `linear-gradient(135deg, ${colors.aqua}, #73f3ff)`, boxShadow:"0 8px 30px rgba(0,210,255,.45)" }}>
                  <span className="text-[#062636] text-[15px] font-[900]">⇆</span>
                </div>
              </div>
              <input
                type="range" min={6} max={94} value={beforeAfter}
                onChange={e=>setBeforeAfter(parseInt(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize"
                aria-label="Before after slider"
              />
            </div>
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.075] text-center text-[12.7px] bg-[#0d1828]">
              {[
                ["11 days", "full strip to handover"],
                ["R 187,400", "fixed – no extras"],
                ["7-year", "workmanship COC"],
              ].map(([a,b])=>(
                <div key={a} className="py-[14px] px-4">
                  <span className="font-[750] text-white mr-1">{a}</span>
                  <span className="text-white/54">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 sm:py-28" style={{ background: colors.sand, color:"#1a2836"}}>
        <div className="mx-auto max-w-[1250px] px-5 sm:px-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h3 className="display text-[32px] sm:text-[44px] font-[800] mt-3" style={{ color: colors.ocean }}>Johannesburg / Central Gauteng homeowners, unfiltered.</h3>
            </div>
            <div className="text-[13.8px] text-[#355269]">⭐⭐⭐⭐⭐ 4.9 average • 312 Google reviews • video verified</div>
          </div>

          <div className="mt-10 grid lg:grid-cols-[1.15fr_.85fr] gap-6 items-start">
            <div className="relative rounded-[24px] bg-white border border-[#0a3d6214] p-6 sm:p-8 shadow-[0_14px_56px_rgba(10,61,98,0.09)] min-h-[260px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tIdx}
                  initial={{ opacity:0, y:16 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-10 }}
                  transition={{ duration:0.45 }}
                >
                  <div className="text-[15px] leading-relaxed" style={{ fontFamily:"'Playfair Display', serif", fontSize:"20px", lineHeight:"1.55", color:"#24364a" }}>
                    “{testimonials[tIdx].text}”
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-[46px] w-[46px] rounded-full flex items-center justify-center font-[800] text-white text-[14px]"
                      style={{ background:`linear-gradient(135deg, ${colors.ocean}, ${colors.aqua})`}}>
                      {testimonials[tIdx].avatar}
                    </div>
                    <div>
                      <div className="font-[740] text-[15px]" style={{ color: colors.ocean }}>{testimonials[tIdx].name}</div>
                      <div className="text-[12.5px] text-[#567286]">{testimonials[tIdx].area} • ⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-[20px] right-[22px] flex gap-2">
                {testimonials.map((_,i)=>(
                  <button key={i} onClick={()=>setTIdx(i)}
                    className="h-[7px] rounded-full transition-all"
                    style={{
                      width: i===tIdx ? 28 : 7,
                      background: i===tIdx ? colors.aqua : "#c7d6e2"
                    }}
                    aria-label={`testimonial ${i+1}`} />
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { icon:"🏆", t:"Johannesburg / Central Gauteng's #1 Rated Plumber", s:"Google Local Services 2023–2025"},
                { icon:"🛡️", t:"PIRB 3419 • IOPSA Member", s:"Full insurance, COC traceable"},
                { icon:"🏆", t:"Quality Materials Guaranteed", s:"Premium pipes, fittings & workmanship"},
              ].map(b=>(
                <div key={b.t} className="rounded-[18px] bg-white border border-[#0a3d6213] px-5 py-[18px] shadow-[0_8px_32px_rgba(10,61,98,0.062)]">
                  <div className="text-[19px]">{b.icon}</div>
                  <div className="mt-1 font-[730] text-[15px]" style={{ color: colors.ocean }}>{b.t}</div>
                  <div className="text-[12.5px] text-[#506a7f]">{b.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="coverage" className="py-20 sm:py-28" style={{ background: colors.oceanDeep }}>
        <div className="mx-auto max-w-[1250px] px-5 sm:px-7">
            <div className="max-w-[780px]">
            <h3 className="display text-[32px] sm:text-[44px] font-[800] mt-3">
              Wherever you are on the Johannesburg / Central Gauteng — we're already nearby.
            </h3>
          </div>

          <div className="mt-10 grid lg:grid-cols-1 gap-6">
            <div className="relative rounded-[26px] overflow-hidden border border-white/[0.096] bg-[#0a1930]">
              {/* stylised map */}
              <div className="relative h-[420px] sm:h-[500px] overflow-hidden">
                <img src={gardenImages.valley} alt="Johannesburg / Central Gauteng" className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"/>
                <div className="absolute inset-0"
                  style={{ background:"radial-gradient(800px 360px at 60% 48%, rgba(0,210,255,0.086), transparent 70%), linear-gradient(180deg, rgba(7,23,42,0.42), rgba(6,15,28,0.78))" }}/>
                {/* coastline line */}
                <svg viewBox="0 0 900 480" className="absolute inset-0 w-full h-full">
                  <path d="M 70 355 C 210 305 355 338 520 282 C 642 241 740 189 850 170"
                    fill="none" stroke="#00D2FF" strokeWidth="3.1" strokeDasharray="7 12" opacity="0.9"/>
                </svg>
                {/* pins */}
                {serviceTowns.map(tw=>(
                  <button key={tw.name}
                    onClick={()=>setMapActive(tw)}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left:`${tw.lon}%`,
                      top:`${tw.lat}%`
                    }}
                  >
                    <span className="relative block">
                      <span className="absolute inset-[-12px] rounded-full"
                        style={{
                          background: mapActive.name===tw.name ? "rgba(0,210,255,0.115)" : "transparent",
                          animation: mapActive.name===tw.name ? "pingSlow 2.0s infinite" : undefined
                        }}/>
                      <span className="relative h-[16px] w-[16px] block rounded-full border-2 border-white shadow-lg"
                        style={{ background: mapActive.name===tw.name ? colors.copper : colors.aqua }} />
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2 top-[17px] whitespace-nowrap text-[10.4px] font-[700] tracking-wide text-white/86 drop-shadow">
                      {tw.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="px-5 py-4 text-[12px] text-white/58 flex flex-wrap gap-4">
                {serviceTowns.map(t=>(
                  <span key={t.name} className={t.name===mapActive.name ? "text-[#98f5ff] font-[650]" : ""}>
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus viral features */}
      <section id="journal" className="py-20 sm:py-28" style={{ background: colors.charcoal }}>
        <div className="mx-auto max-w-[1250px] px-5 sm:px-7">
          <div className="mt-12 grid lg:grid-cols-2 gap-[18px]">
            <div className="lg:col-span-2 flex justify-center">
              <div className="rounded-[24px] border border-white/[0.095] bg-[#111c31] p-[22px] sm:p-[28px] w-full max-w-[560px]">
              <div className="text-[11px] tracking-widest text-[#7ef3ff] font-[700]">WATER SAVINGS CALCULATOR</div>
              <div className="display text-[24px] font-[800] mt-1">How much Johannesburg / Central Gauteng water are you wasting?</div>
              <div className="mt-5 grid gap-4">
                <label className="text-[13px] text-white/80">People in home: <span className="font-[700] text-white">{people}</span>
                  <input type="range" min={1} max={8} value={people} onChange={e=>setPeople(+e.target.value)} className="w-full mt-1"/>
                </label>
                <label className="text-[13px] text-white/80">Showers / week: <span className="font-[700] text-white">{showers}</span>
                  <input type="range" min={0} max={35} value={showers} onChange={e=>setShowers(+e.target.value)} className="w-full mt-1"/>
                </label>
                <label className="flex items-center gap-3 text-[13.8px] text-white/82">
                  <input type="checkbox" checked={garden} onChange={e=>setGarden(e.target.checked)} />
                  Garden / irrigation
                </label>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-[16px] bg-white/[0.040] border border-white/[0.075] py-3">
                  <div className="display text-[22px] font-[800] text-[#8fffff]">{calcSavings.litres.toLocaleString()}</div>
                  <div className="text-[11px] text-white/55">litres / month saved</div>
                </div>
                <div className="rounded-[16px] bg-white/[0.040] border border-white/[0.075] py-3">
                  <div className="display text-[22px] font-[800] text-[#8fffff]">R {calcSavings.rand}</div>
                  <div className="text-[11px] text-white/55">Rand / month</div>
                </div>
                <div className="rounded-[16px] bg-white/[0.040] border border-white/[0.075] py-3">
                  <div className="display text-[22px] font-[800] text-[#8fffff]">{calcSavings.co2}kg</div>
                  <div className="text-[11px] text-white/55">CO₂ avoided</div>
                </div>
              </div>

            </div>
            </div>

          </div>

          {/* seasonal blog strip */}
          <div className="mt-[18px] grid md:grid-cols-3 gap-[16px]">
            {[
              { tag:"WINTER", title:"Knysna pipe freeze protection – 7 low-cost checks", read:"4 min" },
              { tag:"SUMMER", title:"Load-shedding geyser timers that actually save", read:"5 min" },
              { tag:"COASTAL", title:"Why Plett homes need copper – not PVC – within 800m of sea", read:"6 min" },
            ].map(post=>(
              <div key={post.title} className="rounded-[20px] border border-white/[0.095] bg-[#131f35] p-5">
                <div className="text-[10.5px] tracking-widest font-[800]" style={{ color: colors.aqua }}>{post.tag}</div>
                <div className="mt-2 font-[680] text-[15.4px] text-white leading-snug">{post.title}</div>
                <div className="mt-3 text-[12px] text-white/52">{post.read} • Johannesburg / Central Gauteng seasonal tips</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / quote */}
      <section id="quote" className="py-[78px]" style={{ background:`linear-gradient(135deg, ${colors.ocean} 0%, #0a2f4f 46%, #0a3b4c 100%)` }}>
        <div className="mx-auto max-w-[1100px] px-5 sm:px-7">
          <div className="grid lg:grid-cols-[1.06fr_.94fr] gap-10 items-center">
            <div>
              <div className="text-[11.5px] tracking-[0.22em] text-[#b9faff] font-[700]">READY?</div>
              <h3 className="display text-[34px] sm:text-[46px] font-[800] mt-3 text-white leading-[0.96]">Flow with confidence.<br/>Your water. Our craft.</h3>
<p className="mt-4 text-[15.8px] text-white/78 max-w-[530px]">
                 Free route assessment today. Fixed quotes, quality materials, PIRB stamped.
</p>
             </div>
            <div className="rounded-[24px] bg-white text-[#1b2d3d] p-[20px] sm:p-[26px] shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
              <div className="text-[13.3px] font-[750]" style={{ color: colors.ocean }}>Free Johannesburg / Central Gauteng assessment</div>
              <form className="mt-4 grid gap-[12px]" onSubmit={e=>{e.preventDefault(); alert("Thank you!")}}>
                <div className="grid sm:grid-cols-2 gap-[12px]">
                  <input required placeholder="Name" className="w-full rounded-[12px] border border-[#c9d8e4] px-[13px] py-[12px] text-[14px] bg-white outline-none focus:border-[#00bde6]"/>
                  <input required placeholder="WhatsApp / Phone" className="w-full rounded-[12px] border border-[#c9d8e4] px-[13px] py-[12px] text-[14px] bg-white outline-none focus:border-[#00bde6]"/>
                </div>
                <div className="grid sm:grid-cols-2 gap-[12px]">
                  <select className="w-full rounded-[12px] border border-[#c9d8e4] px-[13px] py-[12px] text-[14px] bg-white">
                    {serviceTowns.map(t=> <option key={t.name}>{t.name}</option>)}
                  </select>
                  <select className="w-full rounded-[12px] border border-[#c9d8e4] px-[13px] py-[12px] text-[14px] bg-white">
                    <option>Emergency</option>
                    <option>Quote / Renovation</option>
                    <option>Geyser / Hot Water</option>
<option>Leak detection</option>
                   </select>
                </div>
                <textarea placeholder="Describe issue – photos welcome via WhatsApp after submit" rows={3}
                  className="w-full rounded-[12px] border border-[#c9d8e4] px-[13px] py-[12px] text-[14px] bg-white outline-none focus:border-[#00bde6]"/>
                <button className="w-full py-[13px] rounded-[14px] font-[750] text-[15px] text-[#042535]"
                  style={{ background:`linear-gradient(120deg, ${colors.aqua}, #82faff)`}}>
                  Send
                </button>
                
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 border-t border-white/[0.078]" style={{ background:"#111428" }}>
        <div className="mx-auto max-w-[1250px] px-5 sm:px-7 grid md:grid-cols-4 gap-10 text-[13.6px] text-white/68">
          <div>
            <div className="flex items-center gap-2">
              <img src="/plumbers-logo.png" alt="Punctual Plumbers" className="h-[56px] w-auto" />
              <div>
                <div className="display font-[800] text-white text-[14px] -mt-[2px]">Punctual Plumbers</div>
              </div>
            </div>
            <p className="mt-3 text-white/55 leading-relaxed">
              Quality-certified plumbers. PIRB 3419. Serving Johannesburg & Central Gauteng since 2009. 24/7 emergency.
            </p>
          </div>
          <div>
            <div className="text-white font-[700] mb-2">Services</div>
            <ul className="space-y-[7px] text-white/60">
              <li>General Plumbing</li>
              <li>Bathroom Renovations</li>
              <li>Leak Detection</li>
              <li>Water Filtration</li>
              <li>Emergency Callouts</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-[700] mb-2">Route Offices</div>
            <ul className="space-y-[7px] text-white/60">
              <li>Knysna HQ – 083 237 9132</li>
              <li>George – 083 237 9132</li>
              <li>Plettenberg Bay – 083 237 9132</li>
              <li>Emergency 24/7 – same number</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-[700] mb-2">Certified</div>
            <div className="text-white/60 leading-relaxed">
              PIRB 3419<br/>
              IOPSA • SANS 10252<br/>
              <span className="text-[#a3f9ff]">punctualplumbers@outlook.com</span>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1250px] px-5 sm:px-7 mt-10 pt-6 border-t border-white/[0.075] text-[11.6px] text-white/42 flex flex-col sm:flex-row justify-between gap-3">
          <div>© 2009–2026 Punctual Plumbers (Pty) Ltd</div>
        </div>
      </footer>



      {/* WhatsApp floating button */}
      <div className="fixed bottom-4 left-3 sm:left-5 z-[70]">
        <a
          href="https://wa.me/27832379132?text=Hi%20Punctual%20Plumbers%20-%20I%20need%20help%20with%20"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[52px] w-[52px] rounded-full flex items-center justify-center shadow-[0_18px_50px_rgba(0,0,0,0.43)] transition-all duration-300"
          style={{
            background:"linear-gradient(135deg, #25D366, #128C7E)",
            border:"1px solid rgba(255,255,255,0.15)",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-[26px] w-[26px] fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>


    </div>
  );
}