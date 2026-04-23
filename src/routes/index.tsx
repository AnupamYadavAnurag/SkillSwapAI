import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles, GraduationCap, Coins, Bot, ArrowRight, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Globe = lazy(() => import("@/components/three/Globe"));

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ================= DATA (ONLY CLEANING, NO FEATURE REMOVED) ================= */

const stats = [
  { icon: GraduationCap, label: "12k+ skills" },
  { icon: Coins, label: "$240k earned" },
  { icon: Bot, label: "24/7 AI tutor" },
];

const steps = [
  {
    title: "Learn Skills",
    desc: "Connect with people worldwide and learn any skill through live sessions or AI guidance.",
    icon: GraduationCap,
  },
  {
    title: "Teach & Earn",
    desc: "Share your knowledge, earn coins for every session, and grow your profile.",
    icon: Coins,
  },
  {
    title: "Convert to Cash",
    desc: "Turn your earned coins into real money and build your income stream.",
    icon: Sparkles,
  },
];

const earnings = [
  { label: "React Session", amount: "+₹500" },
  { label: "English Speaking", amount: "+₹300" },
  { label: "UI Design Basics", amount: "+₹700" },
];

const skills = [
  { name: "Web Development", icon: Globe2 },
  { name: "UI/UX Design", icon: Sparkles },
  { name: "English Speaking", icon: GraduationCap },
  { name: "DSA & Coding", icon: Bot },
  { name: "Stock Trading", icon: Coins },
  { name: "Fitness Training", icon: Sparkles },
  { name: "Video Editing", icon: Globe2 },
  { name: "Interview Prep", icon: GraduationCap },
];

const developers = [
  {
    name: "Anupam Yadav",
    role: "Full Stack Developer & DevOps Engineer",
    img: "https://media.licdn.com/dms/image/v2/D5603AQG7Iheipy2BMQ/profile-displayphoto-crop_800_800/B56ZgtH_yBHkAI-/0/1753103729975",
  },
  {
    name: "Gargi Soni",
    role: "Web RTC Expert & Backend Developer",
    img: "https://avatars.githubusercontent.com/u/209323421?v=4",
  },
  {
    name: "Ayushi",
    role: "UI/UX Designer & Frontend Developer",
    img: "https://avatars.githubusercontent.com/u/195586771?v=4",
  },
  {
    name: "Prakhar Agrawal",
    role: "AI Integration Specialist",
    img: "https://avatars.githubusercontent.com/u/207049815?v=4",
  },
];

/* ================= COMPONENT ================= */

function Landing() {
  return (
    <div className="min-h-screen">

      {/* HEADER */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-8">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-extrabold">
            SkillSwap<span className="text-gradient-primary">AI</span>
          </span>
        </div>

        <nav className="flex items-center gap-3">
          <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Log in
          </Link>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Link to="/auth">Get started</Link>
          </Button>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:px-8 md:pb-24 md:pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Globe2 className="h-3.5 w-3.5 text-primary" />
            A global peer-to-peer learning network
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Learn, Teach, <span className="text-gradient-primary">Earn</span>,
            <br /> and Grow.
          </h1>

          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Trade skills with people across the world, earn coins for what you teach.
          </p>

          <div className="mt-7 flex gap-3">
            <Button asChild>
              <Link to="/auth">Start free</Link>
            </Button>
          </div>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {stats.map((s, i) => (
              <motion.div key={i} className="rounded-2xl border p-3 text-center">
                <s.icon className="mx-auto mb-1" />
                <div className="text-xs font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>

        </motion.div>

        <Suspense fallback={<div className="h-[420px]" />}>
          <Globe />
        </Suspense>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto py-20 grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.div key={i} className="p-6 border rounded-2xl">
            <step.icon />
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* SKILLS */}
      <section className="max-w-7xl mx-auto py-20 grid md:grid-cols-4 gap-6">
        {skills.map((skill, i) => (
          <motion.div key={i} className="p-5 border rounded-xl">
            <skill.icon />
            <h3>{skill.name}</h3>
          </motion.div>
        ))}
      </section>

      {/* TEAM */}
      <section className="max-w-7xl mx-auto py-20 grid md:grid-cols-4 gap-6">
        {developers.map((dev, i) => (
          <motion.div key={i} className="text-center">
            <img src={dev.img} className="w-20 h-20 mx-auto rounded-full" />
            <h3>{dev.name}</h3>
          </motion.div>
        ))}
      </section>

      <footer className="text-center py-6">
        © {new Date().getFullYear()} SkillSwapAI
      </footer>

    </div>
  );
}
