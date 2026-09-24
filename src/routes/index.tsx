import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Interview } from "@/components/vela/Interview";
import { Landing } from "@/components/vela/Landing";
import { Studio } from "@/components/vela/Studio";
import { VelaProvider, useVela } from "@/lib/vela/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <VelaProvider>
      <App />
    </VelaProvider>
  );
}

type Mode = "boot" | "land" | "interview" | "studio";

function App() {
  const vela = useVela();
  const [mode, setMode] = useState<Mode>("boot");

  useEffect(() => {
    if (!vela.ready) return;
    setMode((current) => (current === "boot" ? (vela.profile ? "studio" : "land") : current));
  }, [vela.ready, vela.profile]);

  if (mode === "boot" || mode === "land" || (mode === "studio" && !vela.profile)) {
    return (
      <Landing
        ready={vela.ready && mode !== "boot"}
        onStart={() => setMode("interview")}
        onSample={() => {
          vela.loadSample();
          setMode("studio");
        }}
      />
    );
  }

  if (mode === "interview") {
    return (
      <Interview
        initial={vela.profile}
        onBack={() => setMode(vela.profile ? "studio" : "land")}
        onDone={(profile) => {
          vela.saveProfile(profile);
          setMode("studio");
        }}
      />
    );
  }

  return (
    <Studio
      onRevise={() => setMode("interview")}
      onReset={() => {
        vela.reset();
        setMode("land");
      }}
    />
  );
}
