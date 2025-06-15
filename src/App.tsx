import { ThemeProvider } from "@/components/theme-provider"
import { Card } from "@/components/ui/card"
import { GraphCanvas } from "./components/graph-canvas"
import { LogsPanel } from "./components/logs-panel"
import { SidebarPanel } from "./components/sidebar-panel"
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle
} from "./components/ui/resizable"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="visualizer-ui-theme">
      <div className="h-screen w-screen">
        <ResizablePanelGroup direction="vertical" className="h-full w-full" >
          <ResizablePanel >
            <Card className="h-full p-4 flex flex-row gap-4">
              <GraphCanvas />
              <SidebarPanel />
            </Card>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={30} minSize={20} >
            <Card className="h-full overflow-hidden p-4">
              <LogsPanel />
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ThemeProvider>
  )
}
