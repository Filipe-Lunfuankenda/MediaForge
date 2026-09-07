import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * i18n minimalista (sem dependências) — pronto para adicionar idiomas:
 * basta criar um novo dicionário com as mesmas chaves e registá-lo em `dictionaries`.
 */

export const pt = {
  "app.name": "MediaForge",
  "app.tagline": "Agente local de media",
  "app.offline": "Offline",
  "app.engineReady": "Motor pronto",

  "menu.project": "Projeto",
  "menu.openFolder": "Abrir pasta…",
  "menu.newOutput": "Nova pasta de saída",
  "menu.settings": "Preferências",
  "menu.help": "Ajuda",

  "lang.label": "Idioma",
  "lang.pt": "Português",
  "lang.en": "English",

  "explorer.title": "Explorador",
  "explorer.open": "Abrir explorador",
  "explorer.close": "Fechar explorador",
  "explorer.places": "Locais",
  "explorer.tree": "Pastas e ficheiros",
  "explorer.search": "Filtrar ficheiros…",
  "explorer.selected": "{n} selecionados",
  "explorer.grant": "Autorizar acesso a esta pasta",
  "explorer.granted": "Acesso autorizado",
  "explorer.empty": "Nenhum ficheiro corresponde ao filtro.",
  "explorer.addFolder": "Adicionar pasta",
  "explorer.dropHint": "Arraste uma pasta para aqui",
  "explorer.selectAll": "Selecionar tudo",
  "explorer.clear": "Limpar seleção",
  "explorer.view.tree": "Árvore",
  "explorer.view.grid": "Grelha",

  "chat.title": "Chat de intenções",
  "chat.placeholder": "Descreva o que quer fazer com os ficheiros selecionados…",
  "chat.send": "Enviar",
  "chat.thinking": "A preparar o comando…",
  "chat.you": "Você",
  "chat.agent": "Agente",
  "chat.suggestions": "Sugestões rápidas",
  "chat.newSession": "Nova conversa",
  "chat.context": "Contexto: {n} ficheiro(s)",
  "chat.explain": "O que este comando faz",
  "chat.reviewPlan": "Plano proposto",
  "chat.attachSelection": "Anexar seleção",

  "command.title": "Comando proposto",
  "command.tool": "Ferramenta",
  "command.copy": "Copiar",
  "command.copied": "Comando copiado",
  "command.edit": "Editar à mão",
  "command.authorize": "Autorizar execução",
  "command.cancel": "Descartar",
  "command.safe": "Verificado pelo guardrail",
  "command.blocked": "Bloqueado pelo guardrail",
  "command.dryRun": "Simular",

  "terminal.title": "Terminal transparente",
  "terminal.hint": "Pode escrever comandos ffmpeg/ffprobe e premir Enter",
  "terminal.clear": "Limpar",
  "terminal.blocked": "Só são permitidos ffmpeg, ffprobe, mkdir, cp e ls.",
  "terminal.simulated": "Sem motor ligado: saída simulada.",

  "inspector.title": "Inspetor",
  "inspector.tab.media": "Media",
  "inspector.tab.presets": "Predefinições",
  "inspector.tab.glossary": "Glossário",
  "inspector.noSelection": "Selecione um ficheiro para ver os metadados.",
  "inspector.general": "Geral",
  "inspector.video": "Vídeo",
  "inspector.audio": "Áudio",
  "inspector.duration": "Duração",
  "inspector.size": "Tamanho",
  "inspector.container": "Contentor",
  "inspector.resolution": "Resolução",
  "inspector.fps": "Taxa de frames",
  "inspector.videoCodec": "Codec de vídeo",
  "inspector.bitrate": "Bitrate",
  "inspector.audioCodec": "Codec de áudio",
  "inspector.channels": "Canais",
  "inspector.sampleRate": "Amostragem",
  "inspector.applyPreset": "Aplicar",
  "inspector.presetsHint": "Receitas prontas que preenchem o comando.",

  "queue.title": "Fila de tarefas",
  "queue.empty": "Sem tarefas. Autorize um comando para começar.",
  "queue.status.running": "A processar",
  "queue.status.done": "Concluído",
  "queue.status.queued": "Em espera",
  "queue.status.failed": "Falhou",
  "queue.cancel": "Cancelar tarefa",
  "queue.openOutput": "Abrir pasta de saída",

  "status.selection": "Seleção",
  "status.output": "Saída",
  "status.model": "Modelo",
  "status.ffmpeg": "FFmpeg",
  "status.noBackend": "Interface em modo de demonstração",

  "a11y.mainRegion": "Área de trabalho do agente de media",
} as const;

export type Dict = Record<keyof typeof pt, string>;

const en: Dict = {
  ...pt,
  "explorer.title": "Explorer",
  "chat.title": "Intent chat",
  "terminal.title": "Transparent terminal",
  "inspector.title": "Inspector",
  "queue.title": "Job queue",
};

export const dictionaries = { pt, en } as Record<Locale, Dict>;
export type Locale = "pt" | "en";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof Dict, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  const t = useCallback(
    (key: keyof Dict, vars?: Record<string, string | number>) => {
      const raw = dictionaries[locale][key] ?? dictionaries.pt[key] ?? String(key);
      if (!vars) return raw;
      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
        raw,
      );
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n deve ser usado dentro de I18nProvider");
  return ctx;
}
