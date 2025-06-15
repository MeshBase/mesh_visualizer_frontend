import { useConnectionStatusStore } from "@/store/connection-status-store"
import { formatEventLog, useLogStore, type MeshEvent } from "@/store/log-store"
import { extractPacketInformation, usePacketStore } from "@/store/moving-packets-store"
import { extractGraph, useGraphStore } from "@/store/raw-graph-store"
import { useStaticPacketStore, extractStaticPacketInformation } from "@/store/static-packets-store"

export function setupWebSocket(url: string) {
    const addLog = useLogStore.getState().addLog
    const addPacket = usePacketStore.getState().addPacket
    const setStatus = useConnectionStatusStore.getState().setStatus
    const updateGraph = useGraphStore.getState().updateGraph
    const addStaticPacket = useStaticPacketStore.getState().addPacket

    let ws: WebSocket | null = null

    const connect = () => {
        setStatus('connecting')

        addLog({
            type: 'connect',
            message: `[${new Date().toLocaleTimeString()}] Connecting to ${url}...`
        })

        ws = new WebSocket(url)

        ws.onopen = () => {
            setStatus('connected')
            addLog({
                type: 'connect',
                message: `[${new Date().toLocaleTimeString()}] Connected to ${url}`
            })
        }

        ws.onmessage = (msg) => {
            const event = JSON.parse(msg.data) as MeshEvent
            console.log('Received event:', event)

            addLog(formatEventLog(event))

            const graph = extractGraph(event)
            if (graph) {
                updateGraph(graph)
            }

            const packet = extractPacketInformation(event)
            if (packet != null) {
                addPacket(packet);
            }

            const staticPacket = extractStaticPacketInformation(event)
            console.log('staticPacket is truthy:', staticPacket != null, staticPacket)
            if (staticPacket != null) {
                addStaticPacket(staticPacket);
            }
        }

        ws.onclose = () => {
            setStatus('disconnected')
            addLog({
                type: 'disconnect',
                message: `[${new Date().toLocaleTimeString()}] Disconnected from ${url}`
            });
            setTimeout(connect, 3000) // auto-reconnect
        }

        ws.onerror = () => {
            setStatus('disconnected')
            addLog({
                type: 'error',
                message: `[${new Date().toLocaleTimeString()}] WebSocket error`
            })
        }
    }

    connect()

    return {
        close: () => {
            ws?.close()
            setStatus('disconnected')
        }
    }
}
