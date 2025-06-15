import { create } from 'zustand'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected'

type ConnectionStatusStore = {
    status: ConnectionStatus
    setStatus: (status: ConnectionStatus) => void
}

export const useConnectionStatusStore = create<ConnectionStatusStore>((set) => ({
    status: 'disconnected',
    setStatus: (status) => set({ status }),
}))
