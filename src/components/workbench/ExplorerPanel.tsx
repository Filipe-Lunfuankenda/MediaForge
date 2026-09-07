import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  ChevronRight,
  Download,
  FileText,
  FolderOpen,
  Folder,
  HardDrive,
  Home,
  Image as ImageIcon,
  Music,
  Search,
  ShieldCheck,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n";
import { useWorkbench, type FileNode } from "./store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Place = { id: string; name: string; path: string; icon: any };

function kindIcon(kind: FileNode["kind"]) {
  switch (kind) {
    case "video":
      return Video;
    case "audio":
      return Music;
    case "image":
      return ImageIcon;
    case "subtitle":
      return FileText;
    default:
      return FileText;
  }
}

function toNode(n: { path: string; is_dir: boolean; size: number }): FileNode {
  const name = n.path.split(/[/\\]/).pop() || n.path;
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  let kind: FileNode["kind"] = "other";
  if (n.is_dir) kind = "folder";
  else if (["mp4", "mkv", "mov", "avi", "webm"].includes(ext)) kind = "video";
  else if (["mp3", "wav", "aac", "flac"].includes(ext)) kind = "audio";
  else if (["png", "jpg", "jpeg", "gif"].includes(ext)) kind = "image";
  else if (["srt", "vtt", "ass"].includes(ext)) kind = "subtitle";

  return { id: n.path, name: name || n.path, kind };
}

function TreeRow({ node, depth }: { node: FileNode; depth: number }) {
  const { selected, toggleSelect, activeId, addNodes } = useWorkbench();
  const [open, setOpen] = useState(false);
  const [kids, setKids] = useState<FileNode[] | null>(null);
  const isFolder = node.kind === "folder";
  const Icon = isFolder ? (open ? FolderOpen : Folder) : kindIcon(node.kind);
  const isSelected = selected.includes(node.id);

  async function handleToggle() {
    if (!isFolder) return;
    if (!open && !kids) {
      try {
        const res: any[] = await invoke("list_dir", { path: node.id });
        const mapped = res.map(toNode).sort((a, b) => {
          if (a.kind === "folder" && b.kind !== "folder") return -1;
          if (a.kind !== "folder" && b.kind === "folder") return 1;
          return a.name.localeCompare(b.name);
        });
        setKids(mapped);
        addNodes(mapped);
      } catch (e: any) {
        toast.error("Erro a ler pasta: " + e.toString());
      }
    }
    setOpen(!open);
  }

  return (
    <div>
      <button
        type="button"
        onClick={(e) =>
          isFolder ? handleToggle() : toggleSelect(node.id, e.metaKey || e.ctrlKey || e.shiftKey)
        }
        aria-expanded={isFolder ? open : undefined}
        className={cn(
          "group flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-[13px] transition-colors",
          "hover:bg-secondary/70",
          isSelected && "bg-primary/15 text-foreground",
          activeId === node.id && !isFolder && "ring-1 ring-inset ring-primary/40"
        )}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isFolder ? (
          <ChevronRight
            className={cn("size-3.5 flex-none text-muted-foreground transition-transform", open && "rotate-90")}
          />
        ) : (
          <span className="size-3.5 flex-none" />
        )}
        <Icon className={cn("size-4 flex-none", isFolder ? "text-primary/80" : "text-accent/80")} />
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && open && kids ? (
        <div>
          {kids.map((c) => (
            <TreeRow key={c.id} node={c} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ExplorerPanel({ onClose }: { onClose?: () => void }) {
  const { t } = useI18n();
  const { selected, setSelected, addNodes } = useWorkbench();
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [activePlace, setActivePlace] = useState<string | null>(null);
  const [rootNodes, setRootNodes] = useState<FileNode[]>([]);

  useEffect(() => {
    async function loadDrives() {
      try {
        const drives: any[] = await invoke("get_drives");
        const loadedPlaces = drives.map((d) => ({
          id: d.path,
          name: d.path,
          path: d.path,
          icon: HardDrive,
        }));
        setPlaces(loadedPlaces);
        if (loadedPlaces.length > 0) {
          setActivePlace(loadedPlaces[0]!.id);
        }
      } catch (e: any) {
        toast.error("Erro ao carregar discos: " + e.toString());
      }
    }
    loadDrives();
  }, []);

  useEffect(() => {
    if (!activePlace) return;
    async function loadRoot() {
      try {
        const res: any[] = await invoke("list_dir", { path: activePlace! });
        const mapped = res.map(toNode).sort((a, b) => {
          if (a.kind === "folder" && b.kind !== "folder") return -1;
          if (a.kind !== "folder" && b.kind === "folder") return 1;
          return a.name.localeCompare(b.name);
        });
        setRootNodes(mapped);
        addNodes(mapped);
      } catch (e: any) {
        toast.error("Erro a ler raiz: " + e.toString());
      }
    }
    loadRoot();
  }, [activePlace, addNodes]);

  const filtered = useMemo(() => {
    if (!query) return rootNodes;
    const q = query.toLowerCase();
    return rootNodes.filter((n) => n.name.toLowerCase().includes(q));
  }, [rootNodes, query]);

  return (
    <aside className="panel-shell" aria-label={t("explorer.title")}>
      <div className="panel-header">
        <FolderOpen className="size-3.5" />
        <span>{t("explorer.title")}</span>
        {onClose ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("explorer.close")}
            className="ml-auto size-7"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex-none space-y-2 p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("explorer.search")}
            aria-label={t("explorer.search")}
            className="h-8 bg-background pl-8 text-[13px] placeholder:text-muted-foreground"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 border-dashed text-[12px] text-muted-foreground"
          onClick={() => toast.success("Acesso total aos discos locais ativo.")}
        >
          <ShieldCheck className="size-3.5 text-success" />
          Acesso Total Permitido
        </Button>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-2">
          <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {t("explorer.places")}
          </p>
          <div className="space-y-0.5">
            {places.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePlace(p.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-secondary/70",
                    activePlace === p.id && "bg-secondary text-foreground"
                  )}
                >
                  <Icon className="size-4 flex-none text-muted-foreground" />
                  <span className="truncate">{p.name}</span>
                </button>
              );
            })}
          </div>

          <p className="px-1 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {t("explorer.tree")}
          </p>
          {filtered.length ? (
            filtered.map((n) => <TreeRow key={n.id} node={n} depth={0} />)
          ) : (
            <p className="px-2 py-6 text-center text-[12px] text-muted-foreground">{t("explorer.empty")}</p>
          )}
        </div>
      </ScrollArea>

      <div className="flex-none hairline-t bg-surface px-2 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] text-muted-foreground">
            {t("explorer.selected", { n: selected.length })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-muted-foreground"
            onClick={() => setSelected([])}
          >
            {t("explorer.clear")}
          </Button>
        </div>
      </div>
    </aside>
  );
}
