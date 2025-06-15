import { useConnectionStatusStore } from "@/store/connection-status-store"
import { formatEventLog, useLogStore, type MeshEvent } from "@/store/log-store"

export function setupWebSocket(url: string) {
    const setStatus = useConnectionStatusStore.getState().setStatus
    const addLog = useLogStore.getState().addLog

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
            addLog(formatEventLog(event))
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
