import { Cpu, FolderOutput, Layers, ShieldAlert } from "lucide-react";
import { useI18n } from "@/i18n";
import { useWorkbench } from "./store";

export function StatusBar() {
  const { t } = useI18n();
  const { selected, outputFolder } = useWorkbench();

  return (
    <footer className="flex h-7 flex-none items-center gap-3 border-t border-border bg-surface px-2.5 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Layers className="size-3" />
        {t("status.selection")}: {selected.length}
      </span>
      <span className="hidden items-center gap-1.5 sm:inline-flex">
        <FolderOutput className="size-3" />
        <span className="truncate font-mono">{outputFolder}</span>
      </span>
      <span className="ml-auto inline-flex items-center gap-1.5">
        <Cpu className="size-3 text-success" />
        {t("status.ffmpeg")} 7.1
      </span>
      <span className="hidden items-center gap-1.5 md:inline-flex">
        <ShieldAlert className="size-3 text-warning" />
        {t("status.noBackend")}
      </span>
    </footer>
  );
}
