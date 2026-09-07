import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Job = {
  id: string;
  label: string;
  status: "running" | "queued" | "done" | "failed";
  progress: number;
  detail: string;
};

const initialJobs: Job[] = [];

export type MediaMeta = {
  container: string;
  duration: string;
  size: string;
  resolution?: string;
  fps?: string;
  videoCodec?: string;
  bitrate?: string;
  audioCodec?: string;
  channels?: string;
  sampleRate?: string;
};

export type FileNode = {
  id: string;
  name: string;
  kind: "folder" | "video" | "audio" | "image" | "subtitle" | "other";
  children?: FileNode[];
  meta?: MediaMeta;
};
export type Plan = {
  tool: "ffmpeg" | "ffprobe";
  command: string;
  explanation: string;
  steps: string[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  plan?: Plan;
};

export type TerminalLine = { id: string; kind: "in" | "out" | "err" | "info"; text: string };

const ALLOWED = ["ffmpeg", "ffprobe", "mkdir", "cp", "ls"];

export function isAllowedCommand(raw: string) {
  const bin = raw.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return ALLOWED.includes(bin);
}

/** Índice plano da árvore, útil para procurar por id. */
function flatten(nodes: FileNode[], acc: Record<string, FileNode> = {}) {
  for (const n of nodes) {
    acc[n.id] = n;
    if (n.children) flatten(n.children, acc);
  }
  return acc;
}

type Ctx = {
  nodesById: Record<string, FileNode>;
  addNodes: (nodes: FileNode[]) => void;
  selected: string[];
  toggleSelect: (id: string, additive?: boolean) => void;
  setSelected: (ids: string[]) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  outputFolder: string;
  messages: ChatMessage[];
  pushMessage: (m: ChatMessage) => void;
  resetChat: () => void;
  plan: Plan | null;
  setPlan: (p: Plan | null) => void;
  jobs: Job[];
  addJob: (label: string) => void;
  cancelJob: (id: string) => void;
  terminal: TerminalLine[];
  pushTerminal: (l: Omit<TerminalLine, "id">) => void;
  clearTerminal: () => void;
  draftCommand: string;
  setDraftCommand: (v: string) => void;
};

const WorkbenchContext = createContext<Ctx | null>(null);

let seq = 0;
const uid = () => `x${++seq}${Math.random().toString(36).slice(2, 7)}`;

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [nodesById, setNodesById] = useState<Record<string, FileNode>>({});
  
  const addNodes = useCallback((nodes: FileNode[]) => {
    setNodesById((prev) => {
      const next = { ...prev };
      for (const n of nodes) next[n.id] = n;
      return next;
    });
  }, []);

  const [selected, setSelected] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "agent",
      text: "Olá. Escolha ficheiros no explorador e diga-me em português o que quer fazer. Eu escrevo o comando, explico cada parte e só executo depois de autorizar.",
    },
  ]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [draftCommand, setDraftCommand] = useState("");
  const [terminal, setTerminal] = useState<TerminalLine[]>([
    { id: "t0", kind: "info", text: "ffmpeg version 7.1 · ffprobe 7.1 · motor local incorporado" },
    { id: "t1", kind: "info", text: 'Escreva "ffprobe -i ficheiro.mkv" ou autorize um comando do agente.' },
  ]);

  const toggleSelect = useCallback((id: string, additive = false) => {
    setActiveId(id);
    setSelected((prev) => {
      if (!additive) return [id];
      return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, []);

  const pushMessage = useCallback((m: ChatMessage) => setMessages((p) => [...p, m]), []);
  const resetChat = useCallback(() => {
    setMessages([
      { id: uid(), role: "agent", text: "Nova conversa. Em que ficheiros quer trabalhar agora?" },
    ]);
    setPlan(null);
  }, []);

  const pushTerminal = useCallback(
    (l: Omit<TerminalLine, "id">) => setTerminal((p) => [...p.slice(-300), { ...l, id: uid() }]),
    [],
  );
  const clearTerminal = useCallback(() => setTerminal([]), []);

  const addJob = useCallback((label: string) => {
    setJobs((p) => [{ id: uid(), label, status: "running", progress: 2, detail: "a iniciar…" }, ...p]);
  }, []);

  const cancelJob = useCallback((id: string) => {
    setJobs((p) => p.map((j) => (j.id === id ? { ...j, status: "failed", detail: "cancelado" } : j)));
  }, []);

  useEffect(() => {
    let unlistenLine: any;
    let unlistenEnd: any;
    import("@tauri-apps/api/event").then(({ listen }) => {
      listen<{ id: string; line: string }>("job-line", (e) => {
        const { id, line } = e.payload;
        setJobs((prev) =>
          prev.map((j) => {
            if (j.id === id) {
              return { ...j, detail: line.slice(0, 50) + "..." };
            }
            return j;
          })
        );
      }).then((f) => (unlistenLine = f));

      listen<{ id: string; code: number }>("job-end", (e) => {
        setJobs((prev) =>
          prev.map((j) => {
            if (j.id === e.payload.id) {
              return {
                ...j,
                status: e.payload.code === 0 ? "done" : "failed",
                progress: 100,
                detail: e.payload.code === 0 ? "concluído" : `erro (${e.payload.code})`,
              };
            }
            return j;
          })
        );
      }).then((f) => (unlistenEnd = f));
    });

    return () => {
      if (unlistenLine) unlistenLine();
      if (unlistenEnd) unlistenEnd();
    };
  }, []);
  const value = useMemo<Ctx>(
    () => ({
      nodesById,
      addNodes,
      selected,
      toggleSelect,
      setSelected,
      activeId,
      setActiveId,
      outputFolder: "D:/saida-mediaforge",
      messages,
      pushMessage,
      resetChat,
      plan,
      setPlan,
      jobs,
      addJob,
      cancelJob,
      terminal,
      pushTerminal,
      clearTerminal,
      draftCommand,
      setDraftCommand,
    }),
    [
      nodesById,
      addNodes,
      selected,
      toggleSelect,
      activeId,
      messages,
      pushMessage,
      resetChat,
      plan,
      jobs,
      addJob,
      cancelJob,
      terminal,
      pushTerminal,
      clearTerminal,
      draftCommand,
    ],
  );

  return <WorkbenchContext.Provider value={value}>{children}</WorkbenchContext.Provider>;
}

export function useWorkbench() {
  const ctx = useContext(WorkbenchContext);
  if (!ctx) throw new Error("useWorkbench deve ser usado dentro de WorkbenchProvider");
  return ctx;
}
