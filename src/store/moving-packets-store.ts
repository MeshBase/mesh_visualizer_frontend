import { create } from 'zustand'

type StaticPacket = {
    id: string;
    source: string;
    target: string;
    type: STILL_PACKET_TYPE;
    technology: string;
};

export type STILL_PACKET_TYPE = "data" | "heartbeat" | "default";

const PACKET_TYPE_COLOR: Record<STILL_PACKET_TYPE, string> = {
    data: "#00ff00",
    heartbeat: "#00bfff",
    default: "#ff0073",
};

export function getPacketColor(type: STILL_PACKET_TYPE) {
    return PACKET_TYPE_COLOR[type] || PACKET_TYPE_COLOR.default;
}

interface StaticPacketStore {
    packets: StaticPacket[];
    addPacket: (packet: StaticPacket) => void;
}

export function extractPacketInformation(raw_event: any): StaticPacket | null {
    const parsed_event = JSON.parse(raw_event);

    console.log('Parsed event in extractPacketInformation:', parsed_event);

    switch (parsed_event.event_type) {
        case 'send_packet':
            return {
                id: parsed_event.packet_id,
                source: parsed_event.node_id,
                target: parsed_event.destination_id,
                technology: parsed_event.technology,
                type: "data",
            };
        case 'heartbeat':
            return {
                id: parsed_event.packet_id,
                source: parsed_event.node_id,
                target: parsed_event.destination_id,
                technology: parsed_event.technology,
                type: "heartbeat",
            };
        default:
            return null;
    }
}

export const usePacketStore = create<StaticPacketStore>((set, _) => ({
    packets: [],
    addPacket: (packet: StaticPacket) => {
        console.log('Adding packet:', packet);
        set((state) => ({ packets: [...state.packets, packet] }));

        setTimeout(() => {
            console.log(`Packet ${packet.id} removed after 1 second`);
            set((state) => ({
                packets: state.packets.filter((p) => p.id !== packet.id),
            }));
        }, 1000);
    },
}));

