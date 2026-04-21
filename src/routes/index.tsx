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
          <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
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
            <Globe2 className="h-3.5 w-3.5 text-primary" />
            A global peer-to-peer learning network
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Learn, Teach,{" "}
            <span className="text-gradient-primary">Earn</span>,
            <br /> and Grow.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Trade skills with people across the world, earn coins for what you teach, and convert
            them into real money. Practice with AI anytime.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
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
          <Suspense fallback={<div className="h-[420px] w-full animate-pulse rounded-3xl bg-muted/40 md:h-[520px]" />}>
            <Globe />
          </Suspense>
        </motion.div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SkillSwapAI · Built for learners and teachers everywhere.
      </footer>
    </div>
  );
}
