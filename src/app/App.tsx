import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";
import {
  Menu, X, Sun, Moon, ArrowRight, Star, MessageCircle, Mail,
  MapPin, Clock, ChevronDown, Zap, Shield, Smartphone, Code2, Search,
  Globe, DollarSign, Headphones, Rocket, Cpu, Layers, ExternalLink,
  Quote, BadgeCheck, Twitter, Linkedin, Instagram, Github, TrendingUp,
  Users, Award, Calendar, Sparkles, Palette, BarChart3,
  Terminal, CheckCircle2, Play,
} from "lucide-react";

/* ─── TYPES ─────────────────────────────────────────────── */
interface Testimonial {
  id: number; name: string; title: string; company: string;
  country: string; flag: string; review: string; rating: number;
  initials: string; color: string;
}

/* ─── DATA ───────────────────────────────────────────────── */
const STATS = [
  { value: 60, suffix: "+", label: "Happy Clients", icon: Users },
  { value: 120, suffix: "+", label: "Projects Delivered", icon: Award },
  { value: 99, suffix: "%", label: "Client Satisfaction", icon: TrendingUp },
  { value: 5, suffix: "+", label: "Years Experience", icon: Calendar },
];

const COMPANIES = [
  "Google","Microsoft","Amazon","Apple","Meta","Netflix","Spotify","Airbnb",
  "Uber","Tesla","Shopify","Stripe","Vercel","Figma","GitHub","Slack","Zoom",
  "Notion","Discord","Linear","Atlassian","Salesforce","HubSpot","Twilio",
];

const AVATAR_COLORS = [
  "from-blue-500 to-purple-600","from-purple-500 to-pink-500",
  "from-green-500 to-teal-500","from-orange-500 to-red-500",
  "from-indigo-500 to-blue-500","from-teal-500 to-cyan-500",
  "from-rose-500 to-pink-500","from-amber-500 to-orange-500",
];

const RAW_TESTIMONIALS: [string,string,string,string,string,string,number][] = [
  ["Sarah Johnson","CEO","TechVentures","USA","🇺🇸","SkyLink transformed our online presence completely. The website they built generated leads from day one. Exceptional quality and professionalism throughout.",5],
  ["Michael Chen","CTO","InnovateTech","Canada","🇨🇦","Working with SkyLink was a game-changer. Their team understood our vision instantly and delivered a product that exceeded all expectations.",5],
  ["Emma Williams","Founder","StyleBoutique","UK","🇬🇧","The level of attention to detail is remarkable. Our boutique website looks like it was designed by a top London agency. Absolutely stunning.",5],
  ["Raj Patel","Director","MedCare Solutions","India","🇮🇳","SkyLink's healthcare website improved our patient acquisition by 60%. Fast, secure, and beautifully designed. Highly recommend.",5],
  ["Yuki Tanaka","CEO","AsiaTech","Japan","🇯🇵","Professional service from start to finish. The website loads incredibly fast and our organic traffic has tripled since launch.",4],
  ["Lucas Oliveira","Founder","StartupBR","Brazil","🇧🇷","Our startup landing page has been praised by every investor we've met. SkyLink delivered world-class quality at a fraction of agency prices.",5],
  ["Sophie Martin","CMO","FashionForward","France","🇫🇷","The team at SkyLink understood our luxury brand perfectly. The animations and design feel premium and exclusive. Our customers love it.",5],
  ["Ahmed Al-Rashid","CEO","GulfBiz","UAE","🇦🇪","GulfBiz needed a corporate website that reflected our regional expertise. SkyLink delivered beyond expectations. Highly recommend.",5],
  ["Isabella Romano","Director","LuxuryVilla","Italy","🇮🇹","Beautifully crafted website for our villa rental business. Bookings increased 40% in the first month after launch.",4],
  ["Daniel Müller","CTO","TechDE","Germany","🇩🇪","SkyLink built our SaaS product landing page with perfect technical precision. The performance scores are outstanding.",5],
  ["Amelia Brown","Founder","FitLife","Australia","🇦🇺","The FitLife platform they built handles thousands of users daily without a single issue. Scalable, fast, and beautiful.",5],
  ["Carlos García","CEO","SpainTech","Spain","🇪🇸","Our Spanish tech consulting website looks like it belongs alongside Stripe and Vercel. Incredible design sensibility.",4],
  ["Priya Sharma","CMO","IndiaFin","India","🇮🇳","SkyLink built our fintech dashboard and the UX is flawless. Our clients consistently compliment the interface.",5],
  ["James Wilson","Founder","MedTech","USA","🇺🇸","MedTech needed a website that inspired trust in medical professionals. SkyLink nailed the brief perfectly.",5],
  ["Mei Li","CEO","ChinaTech","China","🇨🇳","The AI company website SkyLink built for us has won three design awards since launch. Phenomenal work.",5],
  ["Patrick Dupont","Director","EuroConsult","France","🇫🇷","Very professional communication throughout. Delivered exactly what was promised, on time and within budget.",4],
  ["Olivia Taylor","Founder","GreenBiz","UK","🇬🇧","Our sustainability consulting website perfectly captures our ethos. The green design choices and animations are spot-on.",5],
  ["Hassan Mohammed","CEO","AfricaTech","Nigeria","🇳🇬","SkyLink built our African tech marketplace and the UX is exceptional. Lagos users love the fast loading times.",5],
  ["Anna Kowalski","CTO","PolandTech","Poland","🇵🇱","The ecommerce platform SkyLink built has streamlined our Polish online retail operations completely.",5],
  ["Kevin O'Brien","Founder","IrishStartup","Ireland","🇮🇪","Our Dublin startup got a website that punches well above its weight. Investors were impressed at first sight.",4],
  ["Maria Santos","CEO","BrazilTech","Brazil","🇧🇷","SkyLink's work on our Brazilian fintech landing page drove our series A fundraising conversations forward significantly.",5],
  ["Hiroshi Yamamoto","Director","JapanBiz","Japan","🇯🇵","The automotive consulting website SkyLink built reflects the precision of our Japanese clients' expectations.",5],
  ["Lisa Anderson","CMO","USATech","USA","🇺🇸","Every element of our website tells our brand story. SkyLink truly listened and translated vision into design.",5],
  ["Omar Khalid","Founder","MidEastBiz","Egypt","🇪🇬","Our Cairo digital agency website looks world-class. SkyLink matched the quality we've seen from top European studios.",4],
  ["Elena Petrov","CEO","RussiaTech","Russia","🇷🇺","The EdTech platform landing page SkyLink built converts visitors at a rate that has surprised our whole team.",5],
  ["Thomas Schmidt","Director","GermanBiz","Germany","🇩🇪","SkyLink delivered corporate German precision to our website. Everything works perfectly and looks clean.",5],
  ["Natalie Kim","Founder","KoreaTech","South Korea","🇰🇷","Our K-beauty brand website is the talk of the Seoul startup community. SkyLink set a new benchmark.",5],
  ["Roberto Fernandez","CEO","MexicoTech","Mexico","🇲🇽","The restaurant group website SkyLink built has increased reservations by 70% since launch. Worth every peso.",4],
  ["Asha Nair","CMO","IndiaStart","India","🇮🇳","SkyLink's understanding of our Indian market needs was remarkable. The localisation and design quality impressed us.",5],
  ["Ben Mitchell","Founder","AusBiz","Australia","🇦🇺","SkyLink built our real estate platform with features we didn't even think to ask for. True professionals.",5],
  ["Fatima Al-Zahra","CEO","UAEBiz","UAE","🇦🇪","Our luxury real estate website positions us perfectly in the UAE premium market. Every client asks who built it.",5],
  ["Pierre Leblanc","Director","CanadaTech","Canada","🇨🇦","SkyLink built our bilingual Canadian tech website flawlessly. Both English and French versions are perfectly executed.",4],
  ["Aiko Suzuki","Founder","TokyoStart","Japan","🇯🇵","The Tokyo fashion startup website SkyLink built has been featured in Vogue Japan's digital picks. Stunning.",5],
  ["William Davies","CEO","BritishTech","UK","🇬🇧","British precision meets modern design in the website SkyLink delivered for our consultancy. Perfect.",5],
  ["Nguyen Thi Lan","CMO","VietnamBiz","Vietnam","🇻🇳","Our Vietnamese food delivery platform website handles high traffic peaks perfectly. SkyLink built it to scale.",5],
  ["Stefan Johansson","Founder","SwedenTech","Sweden","🇸🇪","The Scandinavian minimal design SkyLink delivered for our cleantech firm was exactly right.",4],
  ["Grace Okafor","CEO","NigeriaTech","Nigeria","🇳🇬","SkyLink understood West African design sensibilities while maintaining global quality standards. Impressive.",5],
  ["Antonio Rossi","Director","ItalyBiz","Italy","🇮🇹","Our Milan fashion house website now ranks on the first page of Google for our key terms. Great SEO work.",5],
  ["Zara Ahmed","Founder","PakBiz","Pakistan","🇵🇰","The startup ecosystem website SkyLink built for our Karachi tech community has become the region's reference.",5],
  ["Noah Williams","CEO","MidwestTech","USA","🇺🇸","Clean, fast, and converts. SkyLink delivered exactly what our Midwest manufacturing clients needed.",4],
  ["Aisha Diallo","CMO","WestAfrica","Senegal","🇸🇳","Our Dakar-based NGO website now reaches international donors effectively. SkyLink understood our mission.",5],
  ["Tomás Novák","Founder","CzechTech","Czech Republic","🇨🇿","The Prague tech accelerator website SkyLink built has helped us attract top European talent and investors.",5],
  ["Jenny Park","CEO","SeoulStart","South Korea","🇰🇷","Our Korean beauty app has the most beautiful landing page in the industry. SkyLink made us stand out completely.",5],
  ["Mohammed Al-Amin","Director","SaudiBiz","Saudi Arabia","🇸🇦","The Saudi corporate website SkyLink delivered meets the highest standards for the Kingdom's business environment.",5],
  ["Clara Rousseau","Founder","FrenchStart","France","🇫🇷","Wonderful attention to brand detail. Our Bordeaux wine tech startup website is sophisticated and effective.",4],
  ["Ethan Clark","CEO","SiliconTech","USA","🇺🇸","SkyLink built our AI startup website and the technical understanding they brought to the brief was exceptional.",5],
  ["Amara Diallo","CMO","AfricaStart","Ghana","🇬🇭","Our pan-African startup platform website reaches investors worldwide effectively. SkyLink understood the brief.",5],
  ["Ivan Petrov","Founder","EasternTech","Ukraine","🇺🇦","The Kyiv tech company website SkyLink built has helped us maintain international business partnerships.",5],
  ["Rachel Green","CEO","LondonBiz","UK","🇬🇧","Our London investment firm website commands the seriousness our clients expect. Every detail is considered.",5],
  ["Arjun Mehta","Director","MumbaiTech","India","🇮🇳","SkyLink's team worked through our complex requirements with patience and expertise. The Mumbai tech scene noticed.",4],
  ["Valentina Cruz","Founder","ArgentinaTech","Argentina","🇦🇷","The Buenos Aires tech startup website SkyLink built competes visually with Silicon Valley companies. World-class.",5],
  ["Marco Bianchi","CEO","MilanBiz","Italy","🇮🇹","Our Milan creative studio website is now our best sales tool. Every prospect comments on the design quality.",5],
  ["Yara Hassan","CMO","EgyptTech","Egypt","🇪🇬","SkyLink built our Cairo tourism platform with Arabic RTL support perfectly implemented. Technically flawless.",5],
  ["Liam O'Connor","Founder","DublinStart","Ireland","🇮🇪","The Dublin biotech startup website SkyLink built secured our seed funding round in record time.",4],
  ["Sakura Tanaka","CEO","OsakaBiz","Japan","🇯🇵","Our Osaka traditional crafts marketplace balances modern e-commerce with Japanese aesthetic principles perfectly.",5],
  ["David Reyes","Director","MadridTech","Spain","🇪🇸","SkyLink built our Madrid architecture firm portfolio and it now wins new clients automatically.",5],
  ["Fatou Diop","Founder","DakarStart","Senegal","🇸🇳","The Dakar creative agency website SkyLink built positions us as the continent's leading design studio.",5],
  ["Alex Turner","CEO","ChicagoTech","USA","🇺🇸","Our Chicago logistics company website has reduced our sales cycle by 30%. SkyLink delivered real ROI.",5],
  ["Nadia Korolev","CMO","MoscowBiz","Russia","🇷🇺","SkyLink built our Moscow retail brand website with sophisticated animations that our customers absolutely love.",4],
  ["Sun Wei","Founder","ShanghaiStart","China","🇨🇳","The Shanghai tech accelerator website SkyLink built has become the industry standard for similar platforms.",5],
  ["Carlos Mendez","CEO","ColombiaFin","Colombia","🇨🇴","Our Bogotá fintech startup website positions us perfectly against regional competitors. SkyLink delivered excellence.",5],
  ["Aditya Kumar","CTO","BangaloreTech","India","🇮🇳","The SaaS dashboard SkyLink built for our Bangalore startup is the most polished product we've ever shipped.",5],
];

const TESTIMONIALS: Testimonial[] = RAW_TESTIMONIALS.map(([name, title, company, country, flag, review, rating], i) => ({
  id: i + 1,
  name: name as string,
  title: title as string,
  company: company as string,
  country: country as string,
  flag: flag as string,
  review: review as string,
  rating: rating as number,
  initials: (name as string).split(" ").map((n: string) => n[0]).join("").slice(0, 2),
  color: AVATAR_COLORS[i % AVATAR_COLORS.length],
}));

const PORTFOLIO = [
  { id: 1, title: "Restaurant Website", category: "Food & Dining", tech: ["React","Tailwind","Node.js"], gradient: "from-orange-500 via-red-500 to-pink-500", emoji: "🍽️" },
  { id: 2, title: "Gym Website", category: "Health & Fitness", tech: ["Next.js","Framer Motion","MongoDB"], gradient: "from-green-500 via-teal-500 to-cyan-500", emoji: "💪" },
  { id: 3, title: "Hospital Website", category: "Healthcare", tech: ["React","TypeScript","PostgreSQL"], gradient: "from-blue-500 via-indigo-500 to-purple-500", emoji: "🏥" },
  { id: 4, title: "Portfolio Website", category: "Creative", tech: ["Next.js","GSAP","Three.js"], gradient: "from-purple-500 via-pink-500 to-rose-500", emoji: "✨" },
  { id: 5, title: "Real Estate Website", category: "Property", tech: ["React","Node.js","Firebase"], gradient: "from-amber-500 via-orange-500 to-red-500", emoji: "🏠" },
  { id: 6, title: "School Website", category: "Education", tech: ["Next.js","Tailwind","MySQL"], gradient: "from-sky-500 via-blue-500 to-indigo-500", emoji: "🎓" },
  { id: 7, title: "Crypto Website", category: "Web3 / Finance", tech: ["React","Ethers.js","Web3"], gradient: "from-yellow-500 via-amber-500 to-orange-500", emoji: "₿" },
  { id: 8, title: "Ecommerce Website", category: "Retail", tech: ["Next.js","Stripe","PostgreSQL"], gradient: "from-pink-500 via-rose-500 to-red-500", emoji: "🛍️" },
  { id: 9, title: "Law Firm Website", category: "Legal", tech: ["React","TypeScript","Node.js"], gradient: "from-slate-500 via-gray-600 to-zinc-700", emoji: "⚖️" },
  { id: 10, title: "Finance Website", category: "FinTech", tech: ["Next.js","D3.js","PostgreSQL"], gradient: "from-emerald-500 via-green-500 to-teal-500", emoji: "📈" },
  { id: 11, title: "Travel Website", category: "Tourism", tech: ["React","Firebase","Maps API"], gradient: "from-cyan-500 via-sky-500 to-blue-500", emoji: "✈️" },
  { id: 12, title: "Startup Landing Page", category: "SaaS", tech: ["Next.js","Framer Motion","Vercel"], gradient: "from-violet-500 via-purple-500 to-indigo-500", emoji: "🚀" },
];

const WHY_CHOOSE = [
  { icon: Palette, title: "Premium UI", desc: "Pixel-perfect designs that elevate your brand above competitors." },
  { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed with 95+ PageSpeed scores guaranteed." },
  { icon: Search, title: "SEO Optimized", desc: "Built-in SEO best practices to rank higher on Google." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Flawless experience across all devices and screen sizes." },
  { icon: Code2, title: "Clean Code", desc: "Production-ready, maintainable, and well-documented codebase." },
  { icon: Terminal, title: "React Development", desc: "Modern React with hooks, TypeScript, and best practices." },
  { icon: Shield, title: "Secure Website", desc: "Enterprise-grade security with SSL, CORS, and data protection." },
  { icon: DollarSign, title: "Affordable Pricing", desc: "Premium quality at startup-friendly prices with no hidden fees." },
  { icon: Headphones, title: "24x7 Support", desc: "Round-the-clock support via WhatsApp and email whenever you need." },
  { icon: Rocket, title: "Fast Delivery", desc: "We ship fast without compromising on quality or performance." },
  { icon: Cpu, title: "Modern Technology", desc: "Built with the latest frameworks, tools, and cloud infrastructure." },
  { icon: Layers, title: "Scalable Architecture", desc: "Systems that grow seamlessly alongside your business needs." },
];

const PROCESS = [
  { step: 1, title: "Requirement Gathering", desc: "We deeply understand your goals, target audience, and technical needs through collaborative discovery sessions.", icon: Users },
  { step: 2, title: "UI/UX Design", desc: "Our designers craft wireframes and high-fidelity Figma prototypes aligned with your brand identity.", icon: Palette },
  { step: 3, title: "Development", desc: "Our engineers build your product using React, Next.js, and modern cloud-native architecture.", icon: Code2 },
  { step: 4, title: "Testing", desc: "Rigorous QA testing across devices, browsers, and performance benchmarks before any launch.", icon: CheckCircle2 },
  { step: 5, title: "Deployment", desc: "Seamless deployment on Vercel or AWS with CI/CD pipelines and zero-downtime releases.", icon: Rocket },
  { step: 6, title: "Support", desc: "Post-launch monitoring, updates, and priority support to keep your website running perfectly.", icon: Headphones },
];

const TECH_STACK = [
  { name: "React", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { name: "Next.js", color: "text-white", bg: "bg-white/10" },
  { name: "Node.js", color: "text-green-400", bg: "bg-green-400/10" },
  { name: "Express", color: "text-gray-300", bg: "bg-gray-400/10" },
  { name: "MongoDB", color: "text-green-500", bg: "bg-green-500/10" },
  { name: "PostgreSQL", color: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "Firebase", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { name: "Tailwind CSS", color: "text-cyan-300", bg: "bg-cyan-300/10" },
  { name: "TypeScript", color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Framer Motion", color: "text-purple-400", bg: "bg-purple-400/10" },
  { name: "Figma", color: "text-pink-400", bg: "bg-pink-400/10" },
  { name: "Cloudflare", color: "text-orange-400", bg: "bg-orange-400/10" },
  { name: "Vercel", color: "text-white", bg: "bg-white/10" },
  { name: "AWS", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Docker", color: "text-blue-400", bg: "bg-blue-400/10" },
  { name: "GitHub", color: "text-gray-300", bg: "bg-gray-400/10" },
];

const FAQ_ITEMS = [
  { q: "How long does it take to build a website?", a: "Delivery timelines depend on the package: Starter is 5 days, Professional is 10 days, and Enterprise is 15 days. Complex custom projects may vary. We always provide a clear timeline upfront before starting." },
  { q: "Do you redesign existing websites?", a: "Absolutely! We specialize in redesigning outdated websites into modern, high-converting platforms. We analyze your current site, identify opportunities, and deliver a stunning redesign that drives results." },
  { q: "Do you provide web hosting?", a: "We deploy your site on best-in-class platforms like Vercel, Netlify, or AWS, and can guide you through selecting the best hosting plan. Hosting fees are separate and managed by you for full ownership." },
  { q: "Will my website be SEO optimized?", a: "Yes, every website we build follows SEO best practices — semantic HTML, meta tags, Open Graph, sitemap, robots.txt, structured data, fast load times, and mobile-first indexing. Advanced SEO is included in Professional and Enterprise plans." },
  { q: "Do you offer website maintenance?", a: "Yes! We offer ongoing maintenance packages covering updates, security patches, content changes, performance monitoring, and priority support. Ask us about our monthly retainer plans." },
  { q: "Can I update my website content later?", a: "Yes. Professional and Enterprise sites include a CMS (like Sanity, Contentful, or a custom dashboard) so you can manage content without touching code. We also offer a brief training session to get you comfortable." },
];

const WA_LINK = "https://wa.me/919653249734";

/* ─── HELPERS ────────────────────────────────────────────── */
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function useAnimatedCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

/* ─── ANIMATED COUNTER ───────────────────────────────────── */
function AnimatedCounter({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: React.ElementType }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useAnimatedCounter(value, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-1">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div className="text-4xl md:text-5xl font-black font-poppins text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

/* ─── SECTION HEADER ─────────────────────────────────────── */
function SectionHeader({ badge, title, subtitle, center = true }: { badge: string; title: string; subtitle?: string; center?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={cn("mb-16", center && "text-center")}
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-5">
        <Sparkles className="w-3 h-3" /> {badge}
      </span>
      <h2 className="text-3xl md:text-5xl font-black font-poppins leading-tight text-foreground mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────── */
function Navbar({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Home","Services","Portfolio","Testimonials","About","Contact"];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) { el.scrollIntoView({ behavior: "smooth" }); setMobileOpen(false); }
    else { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "backdrop-blur-2xl bg-background/70 border-b border-border shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 font-black font-poppins text-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Sky</span>
            <span className="text-foreground -ml-2">Link</span>
          </motion.button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <motion.button
                key={link}
                onClick={() => scrollTo(link)}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                {link}
              </motion.button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <AnimatePresence mode="wait">
                <motion.div key={darkMode ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.a
              href={WA_LINK} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center text-foreground">
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 backdrop-blur-2xl bg-background/95 border-b border-border p-6 flex flex-col gap-2"
          >
            {links.map(link => (
              <button key={link} onClick={() => scrollTo(link)} className="py-3 px-4 text-left text-sm font-medium text-foreground hover:bg-muted/50 rounded-xl transition-colors">
                {link}
              </button>
            ))}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold text-center">
              Get Started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── HERO ───────────────────────────────────────────────── */
function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 120 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 40);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 40);
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <motion.div style={{ x: springX, y: springY }} className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        </motion.div>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <style>{`
        @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
        .animate-blob{animation:blob 12s infinite ease-in-out}
        .animation-delay-2000{animation-delay:2s}
        .animation-delay-4000{animation-delay:4s}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .animate-marquee{animation:marquee 30s linear infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .animate-float{animation:float 4s ease-in-out infinite}
        .animate-float-2{animation:float 5s ease-in-out infinite 1s}
        .animate-float-3{animation:float 6s ease-in-out infinite 2s}
        font-poppins{font-family:'Poppins',sans-serif}
      `}</style>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-8"
      >
        <Sparkles className="w-3 h-3" /> Premium Web Development Agency
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-poppins leading-[1.05] tracking-tight text-center max-w-5xl mb-6"
      >
        <span className="text-foreground">Build Websites</span>{" "}
        <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400">
          That Grow
        </span>{" "}
        <span className="text-foreground">Your Business</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center leading-relaxed mb-10"
      >
        We design beautiful, fast, responsive, SEO-friendly websites that convert visitors into customers — built with React and powered by modern technology.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mb-16"
      >
        <motion.a
          href={WA_LINK} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59,130,246,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 transition-shadow"
        >
          <Rocket className="w-4 h-4" /> Start Project
        </motion.a>
        <motion.button
          onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          className="px-8 py-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-foreground font-semibold text-base flex items-center justify-center gap-2 hover:bg-muted/50 transition-all"
        >
          <Play className="w-4 h-4" /> View Portfolio
        </motion.button>
      </motion.div>

      {/* Hero Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
        className="relative w-full max-w-4xl mx-auto"
      >
        {/* Laptop frame */}
        <div className="relative mx-auto" style={{ maxWidth: 700 }}>
          {/* Floating cards */}
          <motion.div style={{ x: springX, y: springY }} className="absolute -left-6 top-8 z-10">
            <div className="animate-float bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl w-48">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-muted-foreground font-medium">Live Traffic</span>
              </div>
              <div className="text-2xl font-black text-foreground mb-1">+2,847</div>
              <div className="text-xs text-green-400">↑ 34% this week</div>
              <div className="mt-2 h-8 flex items-end gap-0.5">
                {[3,5,4,6,5,7,8,6,9,8,10,9].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/60 rounded-sm" style={{ height: `${h * 8}%` }} />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div style={{ x: springX, y: springY }} className="absolute -right-4 top-12 z-10">
            <div className="animate-float-2 bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl w-44">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-foreground">Rating</span>
              </div>
              <div className="text-3xl font-black text-foreground">4.9</div>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">120+ reviews</div>
            </div>
          </motion.div>

          <motion.div style={{ x: springX, y: springY }} className="absolute -right-2 bottom-8 z-10">
            <div className="animate-float-3 bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl w-52">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-foreground">Project Delivered</span>
              </div>
              <div className="text-sm text-muted-foreground mb-1">Startup Landing Page</div>
              <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full w-full" />
              </div>
              <div className="text-xs text-green-400">100% Complete ✓</div>
            </div>
          </motion.div>

          {/* Laptop */}
          <div className="relative rounded-t-2xl overflow-hidden border-2 border-border bg-card shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/30">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-5 rounded-full bg-muted/50 flex items-center px-3">
                <span className="text-[10px] text-muted-foreground">https://skylink.agency.vercel.app</span>
              </div>
            </div>
            <div className="aspect-[16/9] bg-gradient-to-br from-[#0B0F19] to-[#111827] overflow-hidden relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="absolute top-8 left-8 right-8">
                <div className="h-3 w-32 rounded-full bg-blue-500/40 mb-3" />
                <div className="h-2 w-48 rounded-full bg-white/10 mb-2" />
                <div className="h-2 w-40 rounded-full bg-white/10 mb-6" />
                <div className="flex gap-3 mb-6">
                  <div className="h-8 w-24 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600" />
                  <div className="h-8 w-24 rounded-lg border border-white/20" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-white/5 border border-white/10" />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-4 right-8 w-32 h-20 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-blue-400 opacity-60" />
              </div>
            </div>
          </div>
          <div className="h-3 bg-muted/50 rounded-b-sm mx-8" />
          <div className="h-1.5 bg-muted/30 rounded-b-xl mx-16" />
        </div>
      </motion.div>
    </section>
  );
}

/* ─── STATS ──────────────────────────────────────────────── */
function StatsSection() {
  return (
    <section className="py-20 px-6 border-y border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map(stat => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── MARQUEE ────────────────────────────────────────────── */
function CompaniesMarquee() {
  const doubled = [...COMPANIES, ...COMPANIES];
  return (
    <section className="py-14 px-6 overflow-hidden border-b border-border">
      <div className="max-w-7xl mx-auto mb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Trusted by teams at world-class companies</p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
          {doubled.map((c, i) => (
            <span key={i} className="text-muted-foreground/50 font-bold font-poppins text-lg hover:text-muted-foreground transition-colors cursor-default select-none flex-shrink-0">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICES / PRICING ─────────────────────────────────── */
function ServicesSection() {
  const plans = [
    {
      name: "Starter", price: "$299", delivery: "5 Days", popular: false,
      features: ["5 Pages","Responsive Design","Basic SEO","Contact Form","WhatsApp Integration","Fast Loading","Modern UI","1 Revision Round"],
      cta: "Choose Plan", color: "from-blue-500/10 to-cyan-500/10", border: "border-blue-500/20",
    },
    {
      name: "Professional", price: "$699", delivery: "10 Days", popular: true,
      features: ["12 Pages","Advanced SEO","Blog + CMS","Animations","Premium Design","Google Analytics","Performance Optimization","Speed Score 95+","3 Revision Rounds"],
      cta: "Most Popular", color: "from-blue-500 to-purple-600", border: "border-blue-400",
    },
    {
      name: "Enterprise", price: "$1199", delivery: "15 Days", popular: false,
      features: ["Unlimited Pages","Custom Dashboard","API Integration","Authentication","Database","Payment Gateway","Premium Animations","Advanced SEO","Admin Panel","Maintenance","Priority Support"],
      cta: "Get Started", color: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/20",
    },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Services & Pricing" title="Simple, Transparent Pricing" subtitle="No hidden fees. No surprises. Pick the plan that fits your business and let us build something extraordinary." />

        <div ref={ref} className="grid md:grid-cols-3 gap-6 md:gap-4 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: plan.popular ? -6 : -4, transition: { duration: 0.2 } }}
              className={cn(
                "relative rounded-3xl border p-8 transition-all duration-300",
                plan.popular
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 border-transparent shadow-2xl shadow-blue-500/30 scale-105"
                  : "bg-card border-border hover:border-blue-500/30 hover:shadow-xl"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-white text-blue-600 text-xs font-black shadow-lg">⭐ MOST POPULAR</span>
                </div>
              )}

              <div className={cn("text-sm font-semibold mb-1", plan.popular ? "text-blue-100" : "text-muted-foreground")}>{plan.name} Website</div>
              <div className={cn("text-5xl font-black font-poppins mb-1", plan.popular ? "text-white" : "text-foreground")}>
                {plan.price}
              </div>
              <div className={cn("text-sm mb-6 flex items-center gap-1.5", plan.popular ? "text-blue-100" : "text-muted-foreground")}>
                <Clock className="w-3.5 h-3.5" /> Delivery in {plan.delivery}
              </div>

              <div className="space-y-2.5 mb-8">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0 mt-0.5", plan.popular ? "text-blue-200" : "text-blue-400")} />
                    <span className={cn("text-sm", plan.popular ? "text-blue-50" : "text-muted-foreground")}>{f}</span>
                  </div>
                ))}
              </div>

              <motion.a
                href={WA_LINK} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={cn(
                  "block w-full py-3.5 rounded-2xl font-semibold text-sm text-center transition-all",
                  plan.popular
                    ? "bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25"
                )}
              >
                {plan.cta} →
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY CHOOSE ─────────────────────────────────────────── */
function WhyChooseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="about-features" className="py-32 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Why SkyLink" title="Built Different. Built Better." subtitle="12 reasons why startups and businesses trust SkyLink to build their digital presence." />
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {WHY_CHOOSE.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative bg-card border border-border rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                <item.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1.5 font-poppins">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROCESS ────────────────────────────────────────────── */
function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader badge="Our Process" title="How We Build Excellence" subtitle="A battle-tested 6-step process that delivers projects on time, on budget, and beyond expectations." />
        <div ref={ref} className="relative">
          {/* Line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 hidden md:block" />
          <div className="space-y-6">
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="flex gap-6 items-start"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 z-10 relative">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-md" />
                </div>
                <div className="flex-1 bg-card border border-border rounded-2xl p-6 hover:border-blue-500/20 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Step {step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold font-poppins text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PORTFOLIO ──────────────────────────────────────────── */
function PortfolioSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="portfolio" className="py-32 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Portfolio" title="Work We're Proud Of" subtitle="12 real-world projects across industries — each built with precision, passion, and pixel-perfect care." />
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTFOLIO.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-blue-500/20"
            >
              {/* Preview */}
              <div className={cn("relative h-44 bg-gradient-to-br overflow-hidden", item.gradient)}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{item.emoji}</span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.a
                    href={WA_LINK} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </motion.a>
                </div>
                {/* Browser bar */}
                <div className="absolute top-3 left-3 right-3 h-6 rounded-lg bg-black/30 backdrop-blur-sm flex items-center px-2 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400/70" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
                  <div className="w-2 h-2 rounded-full bg-green-400/70" />
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-blue-400 font-semibold mb-1.5">{item.category}</div>
                <h3 className="font-bold text-base font-poppins text-foreground mb-3">{item.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.tech.map(t => (
                    <span key={t} className="px-2.5 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────── */
function TestimonialCard({ data, isTop }: { data: Testimonial; isTop: boolean }) {
  return (
    <div className={cn(
      "w-full rounded-3xl p-6 border backdrop-blur-xl shadow-2xl",
      "bg-card/80 border-border",
      isTop && "ring-1 ring-blue-500/20"
    )}>
      {/* Quote + verified */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Quote className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <BadgeCheck className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs text-green-400 font-medium">Verified</span>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[1,2,3,4,5].map(s => (
          <Star key={s} className={cn("w-4 h-4", s <= data.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30")} />
        ))}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">&ldquo;{data.review}&rdquo;</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold flex-shrink-0", data.color)}>
          {data.initials}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-foreground font-poppins">{data.name}</div>
          <div className="text-xs text-muted-foreground truncate">{data.title} · {data.company} {data.flag}</div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hovering, setHovering] = useState(false);
  const STACK = 4;

  const next = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      setCurrentIdx(i => (i + 1) % TESTIMONIALS.length);
      setExiting(false);
    }, 600);
  }, [exiting]);

  useEffect(() => {
    if (hovering) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, hovering]);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Testimonials" title="Loved by 60+ Clients Worldwide" subtitle="Real feedback from real businesses who trusted SkyLink to build their dream websites." />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Stack */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-md"
            style={{ height: 340 }}
          >
            {Array.from({ length: STACK }, (_, depth) => {
              const cardIdx = (currentIdx + depth) % TESTIMONIALS.length;
              const isTop = depth === 0;
              const invDepth = STACK - 1 - depth;

              return (
                <motion.div
                  key={`${currentIdx}-${depth}`}
                  className="absolute inset-x-0 cursor-pointer"
                  style={{ zIndex: STACK - depth }}
                  animate={
                    isTop && exiting
                      ? { y: -500, opacity: 0, rotate: -6, scale: 0.9 }
                      : {
                          y: invDepth * 16,
                          scale: 1 - invDepth * 0.04,
                          rotate: invDepth % 2 === 0 ? invDepth * -2 : invDepth * 2,
                          opacity: 1 - invDepth * 0.12,
                        }
                  }
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  onHoverStart={isTop ? () => setHovering(true) : undefined}
                  onHoverEnd={isTop ? () => { setHovering(false); next(); } : undefined}
                  whileHover={isTop && !exiting ? { y: -12, scale: 1.01, transition: { type: "spring", stiffness: 400 } } : {}}
                >
                  <TestimonialCard data={TESTIMONIALS[cardIdx]} isTop={isTop} />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Testimonial grid - scrolling */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4 max-h-[600px] overflow-y-auto pr-2"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="text-sm text-muted-foreground mb-4 font-medium">All {TESTIMONIALS.length} reviews — hover the stack to browse</div>
            {TESTIMONIALS.slice(0, 20).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.04 + 0.3 }}
                onClick={() => setCurrentIdx(i)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:border-blue-500/30 hover:shadow-md",
                  currentIdx === i ? "border-blue-500/40 bg-blue-500/5" : "border-border bg-card"
                )}
              >
                <div className={cn("w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0", t.color)}>
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-xs text-foreground">{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.flag}</span>
                    <div className="flex gap-0.5 ml-auto">
                      {[...Array(t.rating)].map((_, si) => <Star key={si} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.review}</p>
                </div>
              </motion.div>
            ))}
            {TESTIMONIALS.length > 20 && (
              <div className="text-center py-4 text-xs text-muted-foreground">
                + {TESTIMONIALS.length - 20} more verified reviews
              </div>
            )}
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="flex justify-center mt-12 gap-1.5">
          {Array.from({ length: Math.min(TESTIMONIALS.length, 15) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={cn("h-1.5 rounded-full transition-all duration-300", i === currentIdx % 15 ? "w-6 bg-blue-500" : "w-1.5 bg-muted-foreground/30")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────── */
function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const values = [
    { icon: Star, title: "Mission", desc: "To help startups and businesses build high-performance websites that increase conversions, drive growth, and elevate their online presence." },
    { icon: Globe, title: "Vision", desc: "To become the world's most trusted web development agency — known for craft, speed, and measurable impact." },
    { icon: Sparkles, title: "Core Values", desc: "Quality over quantity. Transparency always. Continuous innovation. Client success is our success." },
  ];

  return (
    <section id="about" className="py-32 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="About SkyLink" title="Who We Are" subtitle="A premium web development agency crafting digital experiences that convert, engage, and scale." />

        <div ref={ref} className="grid md:grid-cols-3 gap-6 mb-16">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-card border border-border rounded-3xl p-8 hover:border-blue-500/20 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                <v.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold font-poppins text-foreground text-center mb-8">Our Technology Stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.04 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className={cn("px-4 py-2 rounded-xl border border-border text-sm font-semibold cursor-default transition-all", tech.bg, tech.color, "hover:border-current/30")}
              >
                {tech.name}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────── */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeader badge="FAQ" title="Questions? We Have Answers." subtitle="Everything you need to know about working with SkyLink." />
        <div ref={ref} className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border border-border rounded-2xl overflow-hidden bg-card hover:border-blue-500/20 transition-all"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-sm text-foreground pr-4">{item.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────── */
function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6">
          <Sparkles className="w-3 h-3" /> Let&apos;s Work Together
        </div>
        <h2 className="text-4xl md:text-6xl font-black font-poppins text-foreground mb-6 leading-tight">
          Ready to Build Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Dream Website?
          </span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Join 60+ businesses that chose SkyLink to build their digital presence. Your perfect website is one conversation away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href={WA_LINK} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(59,130,246,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30"
          >
            <MessageCircle className="w-4 h-4" /> Let&apos;s Talk on WhatsApp
          </motion.a>
          <motion.a
            href={`mailto:skylinkweb.agency@gmail.com`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-foreground font-semibold text-base flex items-center justify-center gap-2 hover:border-blue-500/30 transition-all"
          >
            <Mail className="w-4 h-4" /> Send an Email
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────── */
function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const contacts = [
    { icon: MessageCircle, title: "WhatsApp", value: "+91 96532 49734", sub: "Fastest response — usually within minutes", href: WA_LINK, color: "from-green-500 to-emerald-600", shadow: "shadow-green-500/25" },
    { icon: Mail, title: "Email", value: "skylinkweb.agency@gmail.com", sub: "For detailed project inquiries and briefs", href: "mailto:skylinkweb.agency@gmail.com", color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/25" },
    { icon: MapPin, title: "Location", value: "India · Global Remote", sub: "We work with clients in 30+ countries", href: "#", color: "from-purple-500 to-pink-600", shadow: "shadow-purple-500/25" },
    { icon: Clock, title: "Working Hours", value: "24/7 Available", sub: "Support across all time zones, always", href: WA_LINK, color: "from-orange-500 to-red-600", shadow: "shadow-orange-500/25" },
  ];

  return (
    <section id="contact" className="py-32 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Contact Us" title="Get in Touch" subtitle="No contact forms. No waiting. Just a direct conversation to understand your project." />
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contacts.map((c, i) => (
            <motion.a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative bg-card border border-border rounded-3xl p-6 hover:border-blue-500/20 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg", c.color, c.shadow)}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{c.title}</div>
              <div className="font-bold text-sm text-foreground mb-1.5 font-poppins">{c.value}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{c.sub}</div>
              <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-muted-foreground/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-black font-poppins text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Sky</span>
              <span className="text-foreground -ml-2">Link</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              A premium web development agency helping startups and businesses build high-performance websites that convert and scale.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Github, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i} href={href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-500/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold text-sm text-foreground mb-4 font-poppins">Quick Links</div>
            <div className="space-y-2.5">
              {["Home","Services","Portfolio","About","Contact"].map(link => (
                <button
                  key={link}
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold text-sm text-foreground mb-4 font-poppins">Services</div>
            <div className="space-y-2.5">
              {["Starter Website","Professional Website","Enterprise Website","SEO Optimization","Web Redesign","CMS Integration"].map(s => (
                <div key={s} className="text-sm text-muted-foreground">{s}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="text-sm text-muted-foreground">
            © 2025 SkyLink Agency. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <span className="text-red-400 mx-1">❤️</span> by <span className="font-semibold text-foreground ml-1">SkyLink</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── LOADING ────────────────────────────────────────────── */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[999] bg-background flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-blue-500/30 blur-xl animate-pulse" />
        </div>
        <div className="text-2xl font-black font-poppins">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Sky</span>
          <span className="text-foreground">Link</span>
        </div>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        </div>
        <div className="text-xs text-muted-foreground">Crafting your experience…</div>
      </motion.div>
    </motion.div>
  );
}

/* ─── APP ────────────────────────────────────────────────── */
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.body.style.fontFamily = "'Inter', sans-serif";
    const heads = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
    heads.forEach(h => ((h as HTMLElement).style.fontFamily = "'Poppins', sans-serif"));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence>{!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}</AnimatePresence>

      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main>
            <HeroSection />
            <StatsSection />
            {/* <CompaniesMarquee /> */}
            <ServicesSection />
            <WhyChooseSection />
            <ProcessSection />
            {/* <PortfolioSection /> */}
            <TestimonialsSection />
            <AboutSection />
            <FAQSection />
            <CTASection />
            <ContactSection />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
