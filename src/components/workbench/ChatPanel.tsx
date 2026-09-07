import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Check, Copy, MessagesSquare, Paperclip, Play, ShieldCheck, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n";
import { useWorkbench, type Plan } from "./store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";

export const quickPrompts = [
  "Converter os vídeos selecionados para MP4 sem perder qualidade",
  "Cortar os primeiros 5 segundos e guardar numa pasta nova",
  "Extrair o áudio em MP3 de todos os ficheiros da pasta",
  "Criar uma versão 720p mais leve para enviar por email",
];

function PlanCard({ plan }: { plan: Plan }) {
  const { t } = useI18n();
  const { addJob, pushTerminal, setDraftCommand, setPlan } = useWorkbench();
  const [copied, setCopied] = useState(false);

  const full = `${plan.command}`;

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border-strong bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <ShieldCheck className="size-3.5 text-success" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t("command.title")}
        </span>
        <span className="ml-auto rounded border border-border bg-panel px-1.5 py-0.5 font-mono text-[10px] text-primary">
          {plan.tool}
        </span>
      </div>

      <pre className="max-h-40 overflow-auto bg-terminal px-3 py-2.5 font-mono text-[12px] leading-relaxed text-terminal-foreground">
        {full}
      </pre>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-border bg-panel px-2.5 py-2">
        <Button
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            const jobId = "j" + Date.now();
            addJob(plan.command.slice(0, 46));
            pushTerminal({ kind: "in", text: full });
            invoke("run_job", { id: jobId, tool: plan.tool, command: plan.command, cwd: "C:\\" }).catch(e => toast.error(e));
            setPlan(null);
            toast.success(t("command.authorize"));
          }}
        >
          <Play className="size-3.5" />
          {t("command.authorize")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            setDraftCommand(full);
            toast.info(t("command.edit"));
          }}
        >
          {t("command.edit")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-muted-foreground"
          onClick={() => {
            navigator.clipboard?.writeText(full);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
          {copied ? t("command.copied") : t("command.copy")}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("command.cancel")}
          className="ml-auto size-8 text-muted-foreground"
          onClick={() => setPlan(null)}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { t } = useI18n();
  const { messages, pushMessage, selected, nodesById, resetChat, setPlan } = useWorkbench();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  async function submit(text: string) {
    const prompt = text.trim();
    if (!prompt || busy) return;
    setValue("");
    pushMessage({ id: `u${Date.now()}`, role: "user", text: prompt });
    setBusy(true);
    const files = selected.map((id: string) => nodesById[id]?.id).filter(Boolean) as string[];
    
    try {
      const fullPrompt = `${prompt}. Os ficheiros alvo são: ${files.join(", ")}.`;
      const aiResponse: string = await invoke("ask_local_ai", { prompt: fullPrompt });
      
      let plan: Plan | undefined = undefined;
      const cleanResponse = aiResponse.replace(fullPrompt, "").trim();
      
      const cmdMatch = cleanResponse.match(/COMANDO:\s*(ffmpeg|ffprobe)(.*)/i);
      if (cmdMatch) {
         plan = {
           tool: cmdMatch[1]!.toLowerCase() as "ffmpeg" | "ffprobe",
           command: cmdMatch[1]! + cmdMatch[2]!,
           explanation: cleanResponse.split(/COMANDO:/i)[0]!.trim(),
           steps: ["Analisar", "Executar comando local"],
         };
      }

      const msg = { id: `a${Date.now()}`, role: "agent" as const, text: plan ? plan.explanation : cleanResponse };
      if (plan) {
         (msg as any).plan = plan;
      }
      pushMessage(msg);
      if (plan) setPlan(plan);
    } catch(e: any) {
      toast.error("Ocorreu um erro no IA: " + e.toString());
      pushMessage({ id: `a${Date.now()}`, role: "agent", text: "Tive um problema ao contactar o modelo local: " + e.toString() });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel-shell" aria-label={t("chat.title")}>
      <div className="panel-header">
        <MessagesSquare className="size-3.5" />
        <span>{t("chat.title")}</span>
        <span className="ml-auto normal-case tracking-normal text-[11px] text-muted-foreground">
          {t("chat.context", { n: selected.length })}
        </span>
        <Button variant="ghost" size="sm" className="h-7 text-[11px] text-muted-foreground" onClick={resetChat}>
          {t("chat.newSession")}
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto max-w-3xl space-y-5 p-3 sm:p-4">
          {messages.map((m) => (
            <article key={m.id} className="flex gap-2.5">
              <span
                className={cn(
                  "mt-0.5 grid size-7 flex-none place-items-center rounded-md border border-border",
                  m.role === "agent" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
                )}
              >
                {m.role === "agent" ? <Bot className="size-4" /> : <User className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {m.role === "agent" ? t("chat.agent") : t("chat.you")}
                </p>
                <p className="text-[13.5px] leading-relaxed text-foreground/90 whitespace-pre-wrap">{m.text}</p>
                {m.plan ? <PlanCard plan={m.plan} /> : null}
              </div>
            </article>
          ))}
          {busy ? (
            <p className="flex items-center gap-2 pl-10 text-[12px] text-muted-foreground">
              <Sparkles className="size-3.5 animate-pulse text-primary" />
              {t("chat.thinking")}
            </p>
          ) : null}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <div className="flex-none hairline-t bg-surface p-2 sm:p-3">
        <div className="mx-auto max-w-3xl space-y-2">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {quickPrompts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => submit(q)}
                className="flex-none rounded-full border border-border bg-panel px-3 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
            className="rounded-lg border border-border-strong bg-panel p-1.5 focus-within:border-primary/50"
          >
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(value);
                }
              }}
              rows={2}
              placeholder={t("chat.placeholder")}
              aria-label={t("chat.placeholder")}
              className="max-h-40 min-h-[2.75rem] resize-none border-0 bg-transparent px-2 py-1.5 text-[13.5px] shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1.5 px-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-[11.5px] text-muted-foreground"
                onClick={() => toast.info(t("chat.attachSelection"))}
              >
                <Paperclip className="size-3.5" />
                {t("chat.attachSelection")}
              </Button>
              <Button type="submit" size="icon" className="ml-auto size-8" aria-label={t("chat.send")} disabled={busy}>
                <ArrowUp className="size-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
