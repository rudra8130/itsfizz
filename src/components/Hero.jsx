import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useMotionTemplate,
    useInView,
    useReducedMotion,
} from "motion/react";

const stats = [
    { value: 58, label: "Increase in pickup point use" },
    { value: 23, label: "Decrease in customer phone calls" },
    { value: 27, label: "Increase in on-time deliveries" },
    { value: 40, label: "Decrease in support tickets" },
];

const headline = "WELCOME ITZFIZZ".split("");
const ease = [0.22, 1, 0.36, 1];

/* ---------- GSAP count-up ---------- */
function Counter({ to, delay }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const obj = { v: 0 };
        const tween = gsap.to(obj, {
            v: to,
            duration: 2,
            delay,
            ease: "power3.out",
            onUpdate: () => {
                if (ref.current) ref.current.textContent = Math.round(obj.v);
            },
        });
        return () => tween.kill();
    }, [inView, to, delay]);

    return <span ref={ref}>0</span>;
}

/* ---------- Wheel: scroll ke saath ghoomta hai ---------- */
function Wheel({ cx, spin }) {
    return (
        <g>
            <circle cx={cx} cy={218} r={54} fill="#0a0a0a" />
            <circle cx={cx} cy={218} r={46} fill="#101110" />
            <motion.g style={{ rotate: spin }}>
                <circle cx={cx} cy={218} r={32} fill="url(#rim)" stroke="#2b2e2b" strokeWidth="2" />
                {[0, 72, 144, 216, 288].map((a) => (
                    <rect
                        key={a}
                        x={cx - 3.5}
                        y={218 - 29}
                        width="7"
                        height="22"
                        rx="3.5"
                        fill="#4a4e4a"
                        transform={`rotate(${a} ${cx} 218)`}
                    />
                ))}
                <circle cx={cx} cy={218} r={7} fill="#d6ff3f" />
            </motion.g>
        </g>
    );
}

/* ---------- Car: pure SVG, hamesha transparent ---------- */
function Car({ spin }) {
    return (
        <svg viewBox="0 0 810 268" className="block w-full overflow-visible" role="img" aria-label="Sports car">
            <defs>
                <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4a4e4a" />
                    <stop offset="0.45" stopColor="#262826" />
                    <stop offset="1" stopColor="#111211" />
                </linearGradient>
                <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#202a30" />
                    <stop offset="1" stopColor="#0c1013" />
                </linearGradient>
                <radialGradient id="rim" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#8a8f8a" />
                    <stop offset="1" stopColor="#2e312e" />
                </radialGradient>
            </defs>

            {/* body */}
            <path
                d="M30 214 C30 196 48 188 92 182 L228 164 C262 128 330 96 410 94 L520 94 C585 96 636 128 672 162 L736 174 C768 180 780 194 780 214 L780 236 L30 236 Z"
                fill="url(#body)"
            />
            {/* roof highlight */}
            <path
                d="M262 160 C292 126 340 108 410 106 L516 106 C566 108 606 130 636 160 Z"
                fill="url(#glass)"
            />
            <path d="M455 106 L455 160" stroke="#0b0b0a" strokeWidth="6" />
            <path d="M650 162 L674 160 L678 169 L652 171 Z" fill="#1a1c1a" />
            {/* character line + accent */}
            <path d="M92 190 C300 182 520 182 740 186" stroke="rgba(255,255,255,0.14)" strokeWidth="2" fill="none" />
            <path d="M52 208 L762 206" stroke="#d6ff3f" strokeWidth="2" opacity="0.85" />
            {/* lights */}
            <path d="M742 186 L774 193 L772 202 L740 197 Z" fill="#f4ffc8" />
            <path d="M32 198 L54 194 L54 206 L32 210 Z" fill="#ff3b30" />
            {/* sill */}
            <path d="M30 236 L780 236 L776 242 L36 242 Z" fill="#0a0a0a" />

            {/* arches + wheels */}
            <Wheel cx={190} spin={spin} />
            <Wheel cx={610} spin={spin} />
        </svg>
    );
}

export default function Hero() {
    const root = useRef(null);
    const reduce = useReducedMotion();

    /* ---------- scroll-linked ---------- */
    const { scrollYProgress } = useScroll({
        target: root,
        offset: ["start start", "end end"],
    });
    const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

    const carX = useTransform(p, [0, 1], reduce ? ["0vw", "0vw"] : ["-26vw", "26vw"]);
    const carScale = useTransform(p, [0, 1], [1, 1.18]);
    const wheelSpin = useTransform(p, [0, 1], [0, 900]);
    const shadowScale = useTransform(p, [0, 1], [1, 1.25]);
    const roadX = useTransform(p, [0, 1], [0, -640]); // 80px ka multiple

    const headY = useTransform(p, [0, 1], [0, -90]);
    const headOpacity = useTransform(p, [0, 0.8], [1, 0.2]);
    const ghostX = useTransform(p, [0, 1], ["4vw", "-10vw"]);
    const statsY = useTransform(p, [0, 1], [0, -16]);
    const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);

    /* ---------- mouse: halka spotlight + tilt ---------- */
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.4);
    const sx = useSpring(mx, { stiffness: 60, damping: 18 });
    const sy = useSpring(my, { stiffness: 60, damping: 18 });
    const rotY = useTransform(sx, [0, 1], [-4, 4]);
    const rotX = useTransform(sy, [0, 1], [3, -3]);
    const lightX = useTransform(sx, (v) => `${v * 100}%`);
    const lightY = useTransform(sy, (v) => `${v * 100}%`);
    const spotlight = useMotionTemplate`radial-gradient(600px circle at ${lightX} ${lightY}, rgba(214,255,63,0.06), transparent 70%)`;

    const onMove = (e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
    };

    return (
        <section ref={root} className="relative h-[260vh] bg-ink text-white">
            {/* progress bar */}
            <motion.div
                style={{ scaleX: p }}
                className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent"
            />

            {/* sticky stage: flex column, koi cheez overlap nahi hoti */}
            <div
                onMouseMove={onMove}
                className="sticky top-0 flex h-screen w-full flex-col overflow-hidden"
            >
                {/* background */}
                <motion.div style={{ background: spotlight }} className="absolute inset-0" />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                        maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
                    }}
                />

                {/* NAV */}
                <motion.header
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease }}
                    className="relative z-30 flex shrink-0 items-center justify-between px-6 py-5 md:px-16 md:py-7"
                >
                    <span className="font-mono text-xs tracking-[0.35em]">
                        ITZFIZZ<span className="text-accent">.</span>
                    </span>
                    <nav className="hidden items-center gap-10 text-sm text-white/55 md:flex">
                        {["Work", "Services", "About"].map((l) => (
                            <a key={l} href="#" className="transition-colors hover:text-white">
                                {l}
                            </a>
                        ))}
                    </nav>
                    <a
                        href="#"
                        className="rounded-full border border-white/20 px-5 py-2 text-xs tracking-wide transition-colors hover:border-accent hover:text-accent"
                    >
                        Get in touch
                    </a>
                </motion.header>

                {/* HEADLINE */}
                <motion.div
                    style={{ y: headY, opacity: headOpacity }}
                    className="relative z-10 shrink-0 px-4 pt-[3vh] text-center"
                >
                    <motion.h1
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.055, delayChildren: 0.25 } } }}
                        className="text-base font-light tracking-[0.5em] sm:text-3xl md:text-5xl lg:text-6xl"
                    >
                        {headline.map((ch, i) => (
                            <span key={i} className="inline-block overflow-hidden align-bottom">
                                <motion.span
                                    className="inline-block will-change-transform"
                                    variants={{
                                        hidden: { y: "110%", opacity: 0, filter: "blur(6px)" },
                                        show: {
                                            y: "0%",
                                            opacity: 1,
                                            filter: "blur(0px)",
                                            transition: { duration: 1.1, ease },
                                        },
                                    }}
                                >
                                    {ch === " " ? "\u00A0" : ch}
                                </motion.span>
                            </span>
                        ))}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1, ease }}
                        className="mt-4 text-xs tracking-wide text-white/45 md:text-sm"
                    >
                        Performance-driven mobility, measured in results.
                    </motion.p>
                </motion.div>

                {/* CAR AREA: flex-1, stats se kabhi overlap nahi */}
                <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-end pb-2">
                    {/* ghost text car ke peeche */}
                    <motion.div
                        style={{ x: ghostX, WebkitTextStroke: "1px rgba(255,255,255,0.09)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.6, delay: 0.5 }}
                        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-[60%] select-none whitespace-nowrap text-center text-[19vw] leading-none font-semibold text-transparent"
                    >
                        ITZFIZZ
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 70, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.5, delay: 0.9, ease }}
                        className="relative w-full"
                    >
                        <div className="relative mx-auto w-[78%] max-w-3xl">
                            {/* ground shadow */}
                            <motion.div
                                style={{ x: carX, scaleX: shadowScale }}
                                className="absolute inset-x-[8%] -bottom-1 h-5 rounded-[50%] bg-black/80 blur-xl will-change-transform"
                            />
                            {/* scroll layer */}
                            <motion.div
                                style={{ x: carX, scale: carScale }}
                                className="will-change-transform"
                            >
                                {/* mouse tilt layer */}
                                <motion.div
                                    style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
                                    className="will-change-transform"
                                >
                                    <Car spin={wheelSpin} />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* road */}
                        <div className="relative mt-0 h-px w-full overflow-hidden bg-white/15">
                            <motion.div
                                style={{ x: roadX }}
                                className="absolute inset-y-0 left-0 w-[200%] will-change-transform"
                            />
                        </div>
                        <div className="relative h-3 w-full overflow-hidden">
                            <motion.div
                                style={{
                                    x: roadX,
                                    backgroundImage:
                                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.28) 0 40px, transparent 40px 80px)",
                                }}
                                className="absolute top-2 left-0 h-px w-[200%] will-change-transform"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* STATS */}
                <motion.div
                    style={{ y: statsY }}
                    className="relative z-20 grid shrink-0 grid-cols-2 gap-x-6 gap-y-6 px-6 pt-4 pb-6 md:grid-cols-4 md:px-16 md:pb-10"
                >
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 1.5 + i * 0.16, ease }}
                            whileHover={{ y: -4 }}
                            className="group relative pt-4"
                        >
                            <motion.span
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.1, delay: 1.6 + i * 0.16, ease }}
                                className="absolute inset-x-0 top-0 h-px origin-left bg-white/20 transition-colors group-hover:bg-accent"
                            />
                            <span className="font-mono text-[10px] tracking-widest text-white/35">
                                0{i + 1}
                            </span>
                            <p className="mt-1 text-3xl font-semibold tabular-nums md:text-5xl">
                                <Counter to={s.value} delay={1.7 + i * 0.16} />
                                <span className="text-accent">%</span>
                            </p>
                            <p className="mt-2 max-w-[22ch] text-xs leading-snug text-white/50 md:text-sm">
                                {s.label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* scroll hint */}
                <motion.div
                    style={{ opacity: hintOpacity }}
                    className="absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
                >
                    <span className="font-mono text-[10px] tracking-[0.3em] text-white/35 [writing-mode:vertical-rl]">
                        SCROLL
                    </span>
                    <span className="relative h-14 w-px overflow-hidden bg-white/15">
                        <motion.span
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-accent"
                        />
                    </span>
                </motion.div>
            </div>
        </section>
    );
}