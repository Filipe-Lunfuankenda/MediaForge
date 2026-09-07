import { useEffect, useRef, useState } from "react";
import { Eraser, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/i18n";
import { isAllowedCommand, useWorkbench } from "./store";
import { cn } from "@/lib/utils";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

export function TerminalPanel() {
  const { t } = useI18n();
  const { terminal, pushTerminal, clearTerminal, draftCommand, setDraftCommand } = useWorkbench();
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (draftCommand) {
      setValue(draftCommand);
      setDraftCommand("");
      inputRef.current?.focus();
    }
  }, [draftCommand, setDraftCommand]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [terminal]);

  useEffect(() => {
    const unlisten = listen<{ id: string; line: string }>("job-line", (e) => {
       pushTerminal({ kind: "out", text: e.payload.line });
    });
    return () => {
       unlisten.then(f => f());
    };
  }, [pushTerminal]);

  async function run() {
    const cmd = value.trim();
    if (!cmd) return;
    setValue("");
    pushTerminal({ kind: "in", text: cmd });
    if (!isAllowedCommand(cmd)) {
      pushTerminal({ kind: "err", text: t("terminal.blocked") });
      return;
    }
    
    const tool = cmd.split(/\s+/)[0]?.toLowerCase();
    
    try {
      if (tool === "ffmpeg" || tool === "ffprobe" || tool === "ffplay") {
          const jobId = "t" + Date.now();
          await invoke("run_job", { id: jobId, tool, command: cmd, cwd: "C:\\" });
      } else {
          const res = await invoke("run_safe_shell", { command: cmd });
          pushTerminal({ kind: "out", text: res as string });
      }
    } catch(e: any) {
      pushTerminal({ kind: "err", text: String(e) });
    }
  }

  return (
    <section className="panel-shell" aria-label={t("terminal.title")}>
      <div className="panel-header">
        <TerminalSquare className="size-3.5" />
        <span className="truncate">{t("terminal.title")}</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-7 gap-1.5 text-[11px] text-muted-foreground"
          onClick={clearTerminal}
        >
          <Eraser className="size-3.5" />
          {t("terminal.clear")}
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1 bg-terminal">
        <div className="space-y-0.5 p-2.5 font-mono text-[12px] leading-relaxed">
          {terminal.map((l) => (
            <p
              key={l.id}
              className={cn(
                "whitespace-pre-wrap break-words",
                l.kind === "in" && "text-primary",
                l.kind === "out" && "text-terminal-foreground",
                l.kind === "err" && "text-destructive",
                l.kind === "info" && "text-muted-foreground",
              )}
            >
              {l.kind === "in" ? "› " : ""}
              {l.text}
            </p>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="flex flex-none items-center gap-2 hairline-t bg-terminal px-2.5 py-2"
      >
        <span className="font-mono text-[12px] text-primary">›</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("terminal.hint")}
          aria-label={t("terminal.hint")}
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-terminal-foreground outline-none placeholder:text-muted-foreground"
        />
      </form>
    </section>
  );
}
