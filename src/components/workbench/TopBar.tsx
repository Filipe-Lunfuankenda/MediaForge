import { FolderOpen, Languages, PanelLeft, Settings, Waves, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useI18n, type Locale } from "@/i18n";
import { toast } from "sonner";

export function TopBar({ onToggleExplorer }: { onToggleExplorer: () => void }) {
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="flex h-12 flex-none items-center gap-2 border-b border-border bg-surface px-2 sm:px-3">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden min-h-11 min-w-11"
        aria-label={t("explorer.open")}
        onClick={onToggleExplorer}
      >
        <PanelLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-2 pl-1">
        <span className="grid size-7 place-items-center rounded-md bg-primary/15 text-primary">
          <Waves className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">{t("app.name")}</p>
          <p className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
            {t("app.tagline")}
          </p>
        </div>
      </div>

      <Separator orientation="vertical" className="mx-1 hidden h-6 sm:block" />

      <nav className="hidden items-center gap-1 md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              {t("menu.project")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onSelect={() => toast.info(t("menu.openFolder"))}>
              <FolderOpen className="size-4" /> {t("menu.openFolder")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast.info(t("menu.newOutput"))}>
              {t("menu.newOutput")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast.info(t("menu.settings"))}>
              <Settings className="size-4" /> {t("menu.settings")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => toast.info(t("menu.help"))}>
          {t("menu.help")}
        </Button>
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-panel px-2.5 py-1 text-[11px] text-muted-foreground sm:inline-flex">
          <WifiOff className="size-3 text-success" />
          {t("app.offline")}
        </span>
        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-panel px-2.5 py-1 text-[11px] text-muted-foreground xl:inline-flex">
          <Wifi className="size-3 text-primary" />
          {t("app.engineReady")}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t("lang.label")} className="min-h-11 min-w-11">
              <Languages className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("lang.label")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(["pt", "en"] as Locale[]).map((l) => (
              <DropdownMenuItem key={l} onSelect={() => setLocale(l)} className={locale === l ? "text-primary" : ""}>
                {t(l === "pt" ? "lang.pt" : "lang.en")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
