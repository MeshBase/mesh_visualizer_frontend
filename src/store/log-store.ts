import { create } from 'zustand'

export type MeshEvent =
    | { event_type: "connect"; node_id: string; neighbor_id: string; technology: string }
    | { event_type: "disconnect"; node_id: string; neighbor_id: string }
    | { event_type: "heartbeat"; packet_id: string; node_id: string; neighbor_id: string }
    | { event_type: "turned_on"; node_id: string }
    | { event_type: "turned_off"; node_id: string }
    | { event_type: "send_packet"; node_id: string; destination_id: string; packet_id: string; technology: string }
    | { event_type: "recieve_packet"; node_id: string; source_id: string; packet_id: string; technology: string }
    | { event_type: "drop_packet"; node_id: string; packet_id: string; reason?: string }
    | { event_type: "update_graph"; graph: Record<string, any> }


// Log type
export type LogEntry = {
    type: 'connect' | 'disconnect' | 'error' | 'heartbeat' | 'info' | 'turned_on' | 'turned_off' | 'send_packet' | 'recieve_packet' | 'drop_packet' | 'update_graph'
    message: string
}

type LogStore = {
    // logs: string[]
    logs: LogEntry[]
    addLog: (log: LogEntry) => void
    addEvent: (event: MeshEvent) => void
    clearLogs: () => void
}

export function formatEventLog(event: any): LogEntry {
    const time = `[${new Date().toLocaleTimeString()}]`
    const parsed_event = JSON.parse(event)

    switch (parsed_event.event_type) {
        case "connect":
            return { type: "connect", message: `${time} Node ${parsed_event.node_id} connected to ${parsed_event.neighbor_id} via ${parsed_event.technology}` }
        case "disconnect":
            return { type: "disconnect", message: `${time} Node ${parsed_event.node_id} disconnected from ${parsed_event.neighbor_id}` }
        case "heartbeat":
            return { type: "heartbeat", message: `${time} Heartbeat from ${parsed_event.node_id} (packet ${parsed_event.packet_id})` }
        case "turned_on":
            return { type: "connect", message: `${time} Node ${parsed_event.node_id} turned ON` }
        case "turned_off":
            return { type: "disconnect", message: `${time} Node ${parsed_event.node_id} turned OFF` }
        case "send_packet":
            return { type: "info", message: `${time} Node ${parsed_event.node_id} sent packet ${parsed_event.packet_id} to ${parsed_event.destination_id} via ${parsed_event.technology}` }
        case "recieve_packet":
            return { type: "info", message: `${time} Node ${parsed_event.node_id} received packet ${parsed_event.packet_id} from ${parsed_event.source_id} via ${parsed_event.technology}` }
        case "drop_packet":
            return { type: "error", message: `${time} Node ${parsed_event.node_id} dropped packet ${parsed_event.packet_id} ${parsed_event.reason ? `(${parsed_event.reason})` : ''}` }
        case "update_graph":
            return { type: "info", message: `${time} Graph updated` }
        default:
            return { type: "error", message: `${time} Unknown event type: ${JSON.stringify(parsed_event)}` }
    }
}

export const useLogStore = create<LogStore>((set) => ({
    logs: [],
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    addEvent: (event) => {
        const log = formatEventLog(event as MeshEvent)
        set((state) => ({ logs: [...state.logs, log] }))
    },
    clearLogs: () => set({ logs: [] }),
}))
