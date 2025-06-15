import { useConnectionStatusStore } from "@/store/connection-status-store"
import { formatEventLog, useLogStore, type MeshEvent } from "@/store/log-store"
import { extractGraph, useGraphStore } from "@/store/raw-graph-store"

export function setupWebSocket(url: string) {
    const addLog = useLogStore.getState().addLog
    const setStatus = useConnectionStatusStore.getState().setStatus
    const updateGraph = useGraphStore.getState().updateGraph

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
            console.log('Extracted graph:', graph)
            if (graph) {
                updateGraph(graph)
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
