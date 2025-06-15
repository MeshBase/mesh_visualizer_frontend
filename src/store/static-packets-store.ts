import { create } from 'zustand'

type StaticPacket = {
    id: string;
    node_id: string;
    type: STATIC_PACKET_TYPE;
};

interface StaticPacketStore {
    packets: StaticPacket[];
    addPacket: (packet: StaticPacket) => void;
}

export type STATIC_PACKET_TYPE = "drop_packet" | "recieve_packet" | "default";

const PACKET_TYPE_COLOR: Record<STATIC_PACKET_TYPE, string> = {
    drop_packet: "#ff0b00",
    recieve_packet: "#00ffb0",
    default: "#ff0073",
};

export function getStaticPacketColor(type: STATIC_PACKET_TYPE) {
    return PACKET_TYPE_COLOR[type] || PACKET_TYPE_COLOR.default;
}

const PACKET_TYPE_ICON: Record<STATIC_PACKET_TYPE, string> = {
    drop_packet: "❌",
    recieve_packet: "📥",
    default: "📦",
};

export function getStaticPacketIcon(type: STATIC_PACKET_TYPE) {
    return PACKET_TYPE_ICON[type] || PACKET_TYPE_ICON.default;
}


export function extractStaticPacketInformation(raw_event: any): StaticPacket | null {
    const parsed_event = JSON.parse(raw_event);

    console.log('Parsed event in extractStaticPacketInformation:', parsed_event);

    switch (parsed_event.event_type) {
        case 'drop_packet':
            return {
                id: parsed_event.packet_id,
                node_id: parsed_event.node_id,
                type: "drop_packet",
            };
        case 'recieve_packet':
            return {
                id: parsed_event.packet_id,
                node_id: parsed_event.node_id,
                type: "recieve_packet",
            };
        default:
            return null;
    }
}

export const useStaticPacketStore = create<StaticPacketStore>((set, _) => ({
    packets: [],
    addPacket: (packet) => {
        console.log('Adding static packet:', packet);
        set((state) => ({ packets: [...state.packets, packet] }));

        setTimeout(() => {
            console.log(`Static Packet ${packet.id} removed after 1 second`);
            set((state) => ({
                packets: state.packets.filter((p) => p.id !== packet.id),
            }));
        }, 1000);
    },
}));
