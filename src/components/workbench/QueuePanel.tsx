import { CheckCircle2, Clock, FolderOpen, ListChecks, Loader2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/i18n";
import { useWorkbench } from "./store";
import type { Job } from "./store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusMeta: Record<Job["status"], { icon: typeof Clock; className: string; key: string }> = {
  running: { icon: Loader2, className: "text-primary", key: "queue.status.running" },
  queued: { icon: Clock, className: "text-muted-foreground", key: "queue.status.queued" },
  done: { icon: CheckCircle2, className: "text-success", key: "queue.status.done" },
  failed: { icon: XCircle, className: "text-destructive", key: "queue.status.failed" },
};

export function QueuePanel() {
  const { t } = useI18n();
  const { jobs, cancelJob, outputFolder } = useWorkbench();

  return (
    <section className="panel-shell" aria-label={t("queue.title")}>
      <div className="panel-header">
        <ListChecks className="size-3.5" />
        <span className="truncate">{t("queue.title")}</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-7 gap-1.5 text-[11px] text-muted-foreground"
          onClick={() => toast.info(`${t("queue.openOutput")}: ${outputFolder}`)}
        >
          <FolderOpen className="size-3.5" />
          <span className="hidden sm:inline">{t("queue.openOutput")}</span>
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-2 p-2.5">
          {jobs.length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-muted-foreground">{t("queue.empty")}</p>
          ) : null}
          {jobs.map((j) => {
            const m = statusMeta[j.status];
            const Icon = m.icon;
            return (
              <div key={j.id} className="rounded-lg border border-border bg-surface p-2.5">
                <div className="flex items-center gap-2">
                  <Icon className={cn("size-3.5 flex-none", m.className, j.status === "running" && "animate-spin")} />
                  <p className="min-w-0 flex-1 truncate font-mono text-[12px]">{j.label}</p>
                  {j.status === "running" || j.status === "queued" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("queue.cancel")}
                      className="size-7 flex-none text-muted-foreground"
                      onClick={() => cancelJob(j.id)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  ) : null}
                </div>
                <Progress value={j.progress} className="mt-2 h-1.5" />
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className={m.className}>{t(m.key as never)}</span>
                  <span className="ml-auto truncate font-mono">{j.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </section>
  );
}
