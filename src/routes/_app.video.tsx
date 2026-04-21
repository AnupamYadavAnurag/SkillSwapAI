import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/video")({
  component: VideoPage,
});

function VideoPage() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const nav = useNavigate();

  const Tile = ({ name, seed, you = false, camOn = true }: { name: string; seed: string; you?: boolean; camOn?: boolean }) => (
    <Card className="relative aspect-video overflow-hidden border-0 bg-gradient-soft">
      <div className="absolute inset-0 grid place-items-center">
        {camOn ? (
          <Avatar className="h-32 w-32 shadow-elegant ring-4 ring-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="grid h-32 w-32 place-items-center rounded-full bg-muted text-3xl font-bold text-muted-foreground">
            {name[0]}
          </div>
        )}
      </div>
      <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        {name} {you && "(you)"}
      </div>
    </Card>
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Live with Maya Chen</h1>
          <p className="text-sm text-muted-foreground">Spanish practice · 12:34</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" /> LIVE
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Tile name="Maya Chen" seed="Maya" />
        <Tile name="You" seed="Alex" you camOn={cam} />
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-6 flex items-center justify-center gap-3 rounded-full border bg-card/80 p-2 backdrop-blur shadow-elegant mx-auto"
      >
        <Button variant={mic ? "secondary" : "destructive"} size="icon" className="rounded-full" onClick={() => setMic(!mic)}>
          {mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button variant={cam ? "secondary" : "destructive"} size="icon" className="rounded-full" onClick={() => setCam(!cam)}>
          {cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full" onClick={() => toast("Screen sharing started")}>
          <MonitorUp className="h-5 w-5" />
        </Button>
        <Button variant="destructive" className="rounded-full" onClick={() => { toast.success("Call ended"); nav({ to: "/dashboard" }); }}>
          <PhoneOff className="mr-1 h-4 w-4" /> End call
        </Button>
      </motion.div>
    </div>
  );
}
