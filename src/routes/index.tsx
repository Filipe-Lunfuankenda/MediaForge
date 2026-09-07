import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/i18n";
import { Workbench } from "@/components/workbench/Workbench";

const title = "MediaForge — agente local para FFmpeg e ffprobe";
const description =
  "Descreva em português o que quer fazer com os seus vídeos e áudios: o agente escreve o comando FFmpeg, explica cada parte e só executa depois de autorizar.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <I18nProvider>
      <h1 className="sr-only">MediaForge — agente local de media com FFmpeg</h1>
      <Workbench />
      <Toaster position="bottom-right" />
    </I18nProvider>
  );
}
