import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useI18n } from "@/i18n";
import { ChatPanel } from "./ChatPanel";
import { ExplorerPanel } from "./ExplorerPanel";
import { InspectorPanel } from "./InspectorPanel";
import { QueuePanel } from "./QueuePanel";
import { StatusBar } from "./StatusBar";
import { TerminalPanel } from "./TerminalPanel";
import { TopBar } from "./TopBar";
import { WorkbenchProvider } from "./store";

function RightColumn() {
  return (
    <ResizablePanelGroup orientation="vertical">
      <ResizablePanel defaultSize="62" minSize="25">
        <InspectorPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="38" minSize="20">
        <QueuePanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function DesktopLayout() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
      <ResizablePanel defaultSize="20" minSize="14" maxSize="32" className="hidden lg:block">
        <ExplorerPanel />
      </ResizablePanel>
      <ResizableHandle className="hidden lg:flex" />
      <ResizablePanel defaultSize="52" minSize="30">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="64" minSize="25">
            <ChatPanel />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="36" minSize="15">
            <TerminalPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="28" minSize="18" maxSize="40">
        <RightColumn />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MobileLayout() {
  const { t } = useI18n();
  return (
    <Tabs defaultValue="chat" className="flex min-h-0 flex-1 flex-col gap-0">
      <div className="min-h-0 flex-1">
        <TabsContent value="chat" className="mt-0 h-full data-[state=inactive]:hidden">
          <ChatPanel />
        </TabsContent>
        <TabsContent value="terminal" className="mt-0 h-full data-[state=inactive]:hidden">
          <TerminalPanel />
        </TabsContent>
        <TabsContent value="inspector" className="mt-0 h-full data-[state=inactive]:hidden">
          <InspectorPanel />
        </TabsContent>
        <TabsContent value="queue" className="mt-0 h-full data-[state=inactive]:hidden">
          <QueuePanel />
        </TabsContent>
      </div>
      <TabsList className="h-11 flex-none justify-stretch gap-1 rounded-none border-t border-border bg-surface p-1">
        <TabsTrigger value="chat" className="flex-1 text-[11.5px]">
          {t("chat.title")}
        </TabsTrigger>
        <TabsTrigger value="terminal" className="flex-1 text-[11.5px]">
          {t("terminal.title")}
        </TabsTrigger>
        <TabsTrigger value="inspector" className="flex-1 text-[11.5px]">
          {t("inspector.title")}
        </TabsTrigger>
        <TabsTrigger value="queue" className="flex-1 text-[11.5px]">
          {t("queue.title")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function Shell() {
  const { t } = useI18n();
  const [drawer, setDrawer] = useState(false);

  return (
    <main className="flex h-screen min-h-0 flex-col bg-background" aria-label={t("a11y.mainRegion")}>
      <TopBar onToggleExplorer={() => setDrawer(true)} />
      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        <MobileLayout />
      </div>
      <div className="hidden min-h-0 flex-1 md:flex md:flex-col">
        <DesktopLayout />
      </div>
      <StatusBar />

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-[86vw] max-w-sm gap-0 p-0">
          <SheetTitle className="sr-only">{t("explorer.title")}</SheetTitle>
          <ExplorerPanel />
        </SheetContent>
      </Sheet>
    </main>
  );
}

export function Workbench() {
  return (
    <WorkbenchProvider>
      <Shell />
    </WorkbenchProvider>
  );
}
