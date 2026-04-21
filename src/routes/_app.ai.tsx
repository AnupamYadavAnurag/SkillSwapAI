import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

type Msg = { role: "user" | "assistant"; content: string };

const PRESETS = [
  "Correct my grammar: 'I has went to store yesterday.'",
  "Suggest 5 ways to say 'I'm tired' more vividly.",
  "Help me practice a job interview opener.",
];

export const Route = createFileRoute("/_app/ai")({
  component: AIPage,
});

function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your **AI language coach** ✨\n\nAsk me to fix your grammar, suggest better phrasings, or roleplay any conversation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (resp.status === 429) {
        toast.error("Rate limit hit. Please wait a moment.");
        setLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast.error("AI credits exhausted. Add funds in workspace settings.");
        setLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        toast.error("AI request failed.");
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistant = "";
      let started = false;
      let done = false;

      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistant += delta;
              if (!started) {
                started = true;
                setMessages((m) => [...m, { role: "assistant", content: assistant }]);
              } else {
                setMessages((m) => m.map((msg, i) => (i === m.length - 1 ? { ...msg, content: assistant } : msg)));
              }
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Connection lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="AI Chatbot" subtitle="Your 24/7 language coach. Powered by Lovable AI." />

      <Card className="flex h-[72vh] flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <Avatar className="h-8 w-8 shrink-0 bg-gradient-primary text-primary-foreground">
                  <AvatarFallback className="bg-transparent"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`prose prose-sm max-w-[80%] rounded-2xl px-4 py-2.5 shadow-soft dark:prose-invert prose-p:my-1 prose-ul:my-1 ${
                  m.role === "user"
                    ? "rounded-br-md bg-gradient-primary text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground"
                    : "rounded-bl-md bg-card"
                }`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              {m.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0 bg-secondary">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 bg-gradient-primary text-primary-foreground">
                <AvatarFallback className="bg-transparent"><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-card px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0.15s" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t bg-card/50 px-4 py-3">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Sparkles className="h-3 w-3 text-primary" /> {p}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 border-t bg-card p-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything…"
            disabled={loading}
            className="flex-1"
          />
          <Button onClick={() => send()} disabled={loading} className="bg-gradient-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
