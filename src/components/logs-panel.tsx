import { ScrollArea } from "@/components/ui/scroll-area"
import { useLogStore, type LogEntry } from "@/store/log-store"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

export function LogsPanel() {
    const logs = useLogStore((state) => state.logs)
    const clearLogs = useLogStore((state) => state.clearLogs)

    const logColorMap: Record<LogEntry['type'], string> = {
        connect: "text-green-400",
        disconnect: "text-red-400",
        error: "text-red-600 font-bold",
        heartbeat: "text-blue-400",
        info: "text-gray-400",
        turned_on: "text-green-400",
        turned_off: "text-red-400",
        send_packet: "text-yellow-400",
        recieve_packet: "text-yellow-400",
        drop_packet: "text-red-600 font-bold",
        update_graph: "text-gray-400",
    }

    const bottomRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [logs])

    return (
        <div className="relative h-full w-full rounded-md border bg-black font-mono text-xs text-green-400">
            {/* Clear Button */}
            <Button
                size="icon"
                variant="destructive"
                className="absolute right-2 top-2 z-10 text-green-400 hover:bg-red-500/15 cursor-pointer"
                onClick={clearLogs}
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            {/* Logs */}

            <ScrollArea className="h-full w-full p-4 pt-10">
                <div className="space-y-1">
                    {logs.map((log, i) => (
                        <p key={i} className={logColorMap[log.type]}>
                            {log.message}
                        </p>
                    ))}
                </div>

                <div ref={bottomRef} />
            </ScrollArea>
        </div>
    )
}
