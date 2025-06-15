import { useCallback, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader, OctagonX, Cable } from "lucide-react"
import { useConnectionStatusStore } from "@/store/connection-status-store"
import { setupWebSocket } from "@/lib/web-socket-util"

export function SidebarPanel() {
    const [wsUrl, setWsUrl] = useState("ws://localhost:8000/ws");
    const connectionStatus = useConnectionStatusStore((state) => state.status);
    const closeSocketRef = useRef<() => void>(() => { })

    const statusColorMap: Record<string, string> = {
        disconnected: "bg-red-500",
        connecting: "bg-yellow-400",
        connected: "bg-green-500",
    }

    const handleConnect = useCallback(() => {
        const result = setupWebSocket(wsUrl);
        console.log("WebSocket setup result:", result);
        closeSocketRef.current = result.close;
    }, [wsUrl]);

    return (
        <Card className="w-72 h-full">
            <CardHeader>
                <CardTitle className="text-lg">Control Panel</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* WebSocket Input */}
                <div className="space-y-2">
                    <Label htmlFor="ws-url" className="text-sm">WebSocket URL</Label>
                    <div className="flex gap-2">
                        <Input
                            id="ws-url"
                            value={wsUrl}
                            onChange={(e) => setWsUrl(e.target.value)}
                            placeholder="ws://localhost:8000"
                            disabled={connectionStatus === "connected" || connectionStatus === "connecting"}
                        />

                        {wsUrl && connectionStatus === "disconnected" && (
                            <Button onClick={handleConnect} variant="outline">
                                <Cable />
                            </Button>
                        )}

                        {wsUrl && connectionStatus === "connecting" && (
                            <Button onClick={
                                () => {
                                    closeSocketRef.current();
                                }
                            } variant="outline">
                                <Loader />
                            </Button>
                        )}

                        {wsUrl && connectionStatus === "connected" && (
                            <Button onClick={
                                () => {
                                    console.log("Closing WebSocket connection")
                                    closeSocketRef.current();
                                }
                            } variant="outline">
                                <OctagonX />
                            </Button>
                        )}

                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", statusColorMap[connectionStatus])} />
                    <span className="text-sm capitalize text-muted-foreground">
                        {connectionStatus}
                    </span>
                </div>

                {/* Packet Legend */}
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-cyan-400">Packet Legend</h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <LegendItem color="bg-green-400" label="Data Packet" />
                        <LegendItem color="bg-blue-400" label="Heartbeat" />
                        <LegendItem color="bg-yellow-400" label="Handshake" />
                        <LegendItem color="bg-red-400" label="Dropped Packet" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className={cn("h-3 w-3 rounded-full", color)} />
            <span>{label}</span>
        </div>
    )
}
