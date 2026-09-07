import { BookOpen, Gauge, Info, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const presets = [
  {
    id: "pr1",
    name: "MP4 web (H.264)",
    description: "Converte para MP4 compatível com todos os navegadores.",
    command: "-i {input} -c:v libx264 -crf 22 -preset medium -c:a aac -b:a 192k {output}.mp4",
    group: "Vídeo",
  },
  {
    id: "pr2",
    name: "Cortar 5 s iniciais",
    description: "Remove o início sem recodificar (rápido, sem perdas).",
    command: "-ss 00:00:05 -i {input} -c copy {output}.mp4",
    group: "Vídeo",
  },
  {
    id: "pr3",
    name: "Extrair áudio MP3",
    description: "Descarta o vídeo e guarda apenas o som.",
    command: "-i {input} -vn -c:a libmp3lame -q:a 2 {output}.mp3",
    group: "Áudio",
  },
  {
    id: "pr4",
    name: "Normalizar voz",
    description: "Aplica loudness EBU R128 para nivelar o volume.",
    command: "-i {input} -af loudnorm=I=-16:TP=-1.5:LRA=11 {output}.wav",
    group: "Áudio",
  },
  {
    id: "pr5",
    name: "Metadados completos",
    description: "Lê tudo com ffprobe e devolve JSON.",
    command: "-v quiet -print_format json -show_format -show_streams {input}",
    group: "Análise",
  },
];

const glossary = [
  { term: "Contentor", text: "A “caixa” do ficheiro (MP4, MKV, MOV). Guarda as faixas, não define a qualidade." },
  { term: "Codec", text: "O método de compressão do conteúdo (H.264, AAC, ProRes). É aqui que se ganha ou perde qualidade." },
  { term: "CRF", text: "Escala de qualidade do H.264/H.265: 18 é quase perfeito, 28 já é visível. Menor número = ficheiro maior." },
  { term: "-c copy", text: "Copia as faixas sem recodificar. Instantâneo e sem perdas, ideal para cortes." },
  { term: "Bitrate", text: "Dados por segundo. Mais bitrate, mais detalhe e mais peso." },
  { term: "ffprobe", text: "Ferramenta de análise: não altera nada, apenas lê e descreve o ficheiro." },
];
import { useI18n, type Dict } from "@/i18n";
import { useWorkbench } from "./store";

function Row({ label, value }: { label: string; value?: string | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-1.5 text-[12.5px]">
      <span className="w-28 flex-none text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 break-words font-mono text-foreground/90">{value}</span>
    </div>
  );
}

function GroupTitle({ children }: { children: string }) {
  return (
    <p className="mt-3 mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

export function InspectorPanel() {
  const { t } = useI18n();
  const { activeId, nodesById, setDraftCommand } = useWorkbench();
  const node = activeId ? nodesById[activeId] : null;
  const meta = node?.meta;

  const label = (k: keyof Dict) => t(k);

  return (
    <section className="panel-shell" aria-label={t("inspector.title")}>
      <div className="panel-header">
        <Info className="size-3.5" />
        <span className="truncate">{t("inspector.title")}</span>
      </div>

      <Tabs defaultValue="media" className="flex min-h-0 flex-1 flex-col gap-0">
        <TabsList className="m-2 grid w-auto grid-cols-3 bg-surface">
          <TabsTrigger value="media" className="text-[11.5px]">
            <Gauge className="size-3.5" /> {t("inspector.tab.media")}
          </TabsTrigger>
          <TabsTrigger value="presets" className="text-[11.5px]">
            <SlidersHorizontal className="size-3.5" /> {t("inspector.tab.presets")}
          </TabsTrigger>
          <TabsTrigger value="glossary" className="text-[11.5px]">
            <BookOpen className="size-3.5" /> {t("inspector.tab.glossary")}
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="min-h-0 flex-1">
          <TabsContent value="media" className="mt-0 px-3 pb-4">
            {!meta || !node ? (
              <p className="py-6 text-center text-[12.5px] text-muted-foreground">
                {t("inspector.noSelection")}
              </p>
            ) : (
              <>
                <p className="truncate pt-1 font-mono text-[13px] text-primary">{node.name}</p>
                <GroupTitle>{label("inspector.general")}</GroupTitle>
                <Row label={label("inspector.container")} value={meta.container} />
                <Row label={label("inspector.duration")} value={meta.duration} />
                <Row label={label("inspector.size")} value={meta.size} />
                {meta.resolution || meta.videoCodec ? (
                  <>
                    <GroupTitle>{label("inspector.video")}</GroupTitle>
                    <Row label={label("inspector.resolution")} value={meta.resolution} />
                    <Row label={label("inspector.fps")} value={meta.fps} />
                    <Row label={label("inspector.videoCodec")} value={meta.videoCodec} />
                    <Row label={label("inspector.bitrate")} value={meta.bitrate} />
                  </>
                ) : null}
                {meta.audioCodec ? (
                  <>
                    <GroupTitle>{label("inspector.audio")}</GroupTitle>
                    <Row label={label("inspector.audioCodec")} value={meta.audioCodec} />
                    <Row label={label("inspector.channels")} value={meta.channels} />
                    <Row label={label("inspector.sampleRate")} value={meta.sampleRate} />
                  </>
                ) : null}
              </>
            )}
          </TabsContent>

          <TabsContent value="presets" className="mt-0 px-3 pb-4">
            <p className="pb-2 text-[12px] text-muted-foreground">{t("inspector.presetsHint")}</p>
            <div className="space-y-2">
              {presets.map((p) => (
                <div key={p.id} className="rounded-lg border border-border bg-surface p-2.5">
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">{p.name}</p>
                    <span className="flex-none rounded border border-border bg-panel px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {p.group}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{p.description}</p>
                  <pre className="mt-2 overflow-auto rounded bg-terminal px-2 py-1.5 font-mono text-[11px] text-terminal-foreground">
                    {p.command}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-7 w-full text-[11.5px]"
                    onClick={() => {
                      const input = node?.name ?? "input.mkv";
                      const base = input.replace(/\.[^.]+$/, "");
                      const bin = p.group === "Análise" ? "ffprobe" : "ffmpeg";
                      setDraftCommand(
                        `${bin} ${p.command.replaceAll("{input}", `"${input}"`).replaceAll("{output}", `"saida/${base}"`)}`,
                      );
                    }}
                  >
                    {t("inspector.applyPreset")}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="glossary" className="mt-0 px-3 pb-4">
            <dl className="space-y-2.5">
              {glossary.map((g) => (
                <div key={g.term} className="rounded-lg border border-border bg-surface p-2.5">
                  <dt className="font-mono text-[12.5px] text-primary">{g.term}</dt>
                  <dd className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{g.text}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </section>
  );
}
