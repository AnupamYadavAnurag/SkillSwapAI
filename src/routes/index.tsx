import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles, GraduationCap, Coins, Bot, ArrowRight, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";


const Globe = lazy(() => import("@/components/three/Globe"));

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
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
          <Link
            to="/auth"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Log in
          </Link>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Link to="/auth">Get started</Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:px-8 md:pb-24 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Globe2 className="h-3.5 w-3.5 text-primary" />A global peer-to-peer learning network
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Learn, Teach, <span className="text-gradient-primary">Earn</span>,
            <br /> and Grow.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Trade skills with people across the world, earn coins for what you teach, and convert
            them into real money. Practice with AI anytime.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              asChild
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              <Link to="/auth">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Browse teachers</Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { icon: GraduationCap, label: "12k+ skills" },
              { icon: Coins, label: "$240k earned" },
              { icon: Bot, label: "24/7 AI tutor" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-2xl border bg-card/60 p-3 text-center backdrop-blur"
              >
                <s.icon className="mx-auto mb-1 h-4 w-4 text-primary" />
                <div className="text-xs font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-primary opacity-20 blur-3xl" />
          <Suspense
            fallback={
              <div className="h-[420px] w-full animate-pulse rounded-3xl bg-muted/40 md:h-[520px]" />
            }
          >
            <Globe />
          </Suspense>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            How SkillSwapAI Works
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Learn new skills, teach what you know, and earn rewards — all in one platform.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
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
          ].map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl border bg-card/60 p-6 backdrop-blur transition hover:shadow-glow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <step.icon className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>

              <div className="absolute right-4 top-4 text-xs font-bold text-muted-foreground">
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">
              Turn Your Skills Into <span className="text-gradient-primary">Real Income</span>
            </h2>

            <p className="mt-4 text-muted-foreground max-w-md">
              Teach what you already know. Earn coins for every session and convert them into real
              money. No degree required — just skills.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                Earn coins for every teaching session
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Get discovered by global learners
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Convert coins into real cash anytime
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <div className="rounded-2xl border bg-card/60 p-4 text-center backdrop-blur">
                <div className="text-xl font-bold">₹500+</div>
                <div className="text-xs text-muted-foreground">Per Day</div>
              </div>
              <div className="rounded-2xl border bg-card/60 p-4 text-center backdrop-blur">
                <div className="text-xl font-bold">₹15K+</div>
                <div className="text-xs text-muted-foreground">Per Month</div>
              </div>
            </div>

            <Button className="mt-8 bg-gradient-primary text-primary-foreground shadow-glow">
              Start Earning
            </Button>
          </motion.div>

          {/* RIGHT MOCK CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-primary opacity-20 blur-3xl" />

            <div className="rounded-3xl border bg-card/60 p-6 backdrop-blur shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Earnings Dashboard
                </span>
                <Coins className="h-5 w-5 text-primary" />
              </div>

              <div className="text-3xl font-extrabold mb-2">₹12,450</div>
              <div className="text-xs text-muted-foreground mb-6">Total Earnings This Month</div>

              <div className="space-y-3">
                {[
                  { label: "React Session", amount: "+₹500" },
                  { label: "English Speaking", amount: "+₹300" },
                  { label: "UI Design Basics", amount: "+₹700" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"
                  >
                    <span>{item.label}</span>
                    <span className="font-medium text-primary">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">
              Your 24/7 <span className="text-gradient-primary">AI Tutor</span>
            </h2>

            <p className="mt-4 text-muted-foreground max-w-md">
              Stuck while learning? Ask anything and get instant, structured help — just like a
              personal mentor, anytime.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                Instant answers to any topic
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Step-by-step explanations
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Practice anytime, anywhere
              </li>
            </ul>
          </motion.div>

          {/* RIGHT CHAT UI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-primary opacity-20 blur-3xl" />

            <div className="rounded-3xl border bg-card/60 p-5 backdrop-blur shadow-glow max-w-md mx-auto">
              {/* Chat Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="text-sm font-medium">AI Tutor</div>
              </div>

              {/* Messages */}
              <div className="space-y-3 text-sm">
                {/* User Message */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="ml-auto max-w-[80%] rounded-xl bg-primary text-primary-foreground px-3 py-2"
                >
                  Explain React hooks in simple terms
                </motion.div>

                {/* AI Message */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="max-w-[80%] rounded-xl bg-muted px-3 py-2"
                >
                  React hooks let you use state and lifecycle features in functional components.
                  <br />
                  <br />
                  👉 <strong>useState</strong> → manage data 👉 <strong>useEffect</strong> → handle
                  side effects
                </motion.div>
              </div>

              {/* Input */}
              <div className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs text-muted-foreground">
                Ask anything...
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Explore Popular Skills
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Learn or teach from a wide range of in-demand skills across different domains.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "Web Development", icon: Globe2 },
            { name: "UI/UX Design", icon: Sparkles },
            { name: "English Speaking", icon: GraduationCap },
            { name: "DSA & Coding", icon: Bot },
            { name: "Stock Trading", icon: Coins },
            { name: "Fitness Training", icon: Sparkles },
            { name: "Video Editing", icon: Globe2 },
            { name: "Interview Prep", icon: GraduationCap },
          ].map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group rounded-2xl border bg-card/60 p-5 backdrop-blur transition hover:shadow-glow cursor-pointer"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <skill.icon className="h-5 w-5" />
              </div>

              <h3 className="text-sm font-semibold">{skill.name}</h3>

              <p className="mt-1 text-xs text-muted-foreground">Learn & teach</p>

              {/* Hover Arrow */}
              <div className="mt-3 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Explore →
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* ================= TEAM SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          👨‍💻 Meet the Developers
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              name: "Anupam Yadav",
              role: "Full Stack Developer & DevOps Engineer",
              img: "https://media.licdn.com/dms/image/v2/D5603AQG7Iheipy2BMQ/profile-displayphoto-crop_800_800/B56ZgtH_yBHkAI-/0/1753103729975?e=1778716800&v=beta&t=rPPDwMRyVZRDWoALaq0p_AI68wrIwnbHrLkbvOXqPhk",
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
          ].map((dev, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.05 }}
              className="text-center p-6 rounded-2xl border bg-card shadow-md"
            >
              <img
                src={dev.img}
                alt={dev.name}
                className="w-20 h-20 mx-auto rounded-full mb-4"
              />
              <h3 className="font-bold">{dev.name}</h3>
              <p className="text-sm text-muted-foreground">{dev.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SkillSwapAI · Built for learners and teachers everywhere.
      </footer>
    </div>

    
    
  );
}
