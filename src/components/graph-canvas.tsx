import { useGraphStore } from "@/store/raw-graph-store";
import { ReactFlow, type NodeChange, Background } from "@xyflow/react";
import { edgeTypes } from "./custom-edge-types";
import { usePacketStore, getPacketColor } from "@/store/moving-packets-store";
import { getStaticPacketColor, getStaticPacketIcon, useStaticPacketStore } from "@/store/static-packets-store";
import { nodeTypes } from "./custom-node-types";


export function GraphCanvas() {
    const { nodes, links } = useGraphStore((state) => state.graph)
    const positions = useGraphStore((state) => state.nodePositions)
    const packets = usePacketStore((state) => state.packets);
    const staticPackets = useStaticPacketStore((state) => state.packets);

    const setNodePosition = useGraphStore((state) => state.setNodePosition)

    function getEdgeColor(technology: string): string {
        const hash = Array.from(technology).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    }

    const graphNodes = [
        // Original nodes
        ...nodes.map((node) => ({
            id: node.id,
            data: { label: node.id },
            position: positions[node.id],
            type: "device"
        })),

        // Static packet nodes
        ...staticPackets.map((packet, idx) => ({
            id: `static-packet-${packet.node_id}-${idx}`,
            data: {
                label: packet.id,
                icon: getStaticPacketIcon(packet.type),
                color: getStaticPacketColor(packet.type),
            },
            position: positions[packet.node_id],
            type: "packet",
            draggable: false,
            selectable: false,
        })),
    ];

    const grouped = new Map<string, string[]>();

    const graphLinks = links.map((link) => {
        const key = `${link.source}-${link.target}`;
        const techList = grouped.get(key) ?? [];

        if (!techList.includes(link.technology)) {
            techList.push(link.technology);
        }

        grouped.set(key, techList);

        const matchingPacket = packets.find(
            (p) => (p.source === link.source && p.target === link.target && p.technology === link.technology)
                || (p.source === link.target && p.target === link.source && p.technology === link.technology)
        );

        const offset = (techList.indexOf(link.technology) - (techList.length - 1) / 2) * 100;

        return {
            id: `${link.source}-${link.target}-${link.technology}`,
            source: matchingPacket ? matchingPacket.source : link.source,
            target: matchingPacket ? matchingPacket.target : link.target,
            label: link.technology,
            type: matchingPacket ? "animatedOffset" : "offset",
            data: {
                technology: link.technology,
                offset,
                ...(matchingPacket && { packetColor: getPacketColor(matchingPacket.type) }),
            },
            style: {
                stroke: getEdgeColor(link.technology),
                strokeWidth: 1.5,
            },
        };
    });


    const handleNodesChange = (changes: NodeChange[]) => {
        changes.forEach((change) => {
            if (change.type === 'position' && change.position && change.id) {
                setNodePosition(change.id, change.position)
            }
        });
    }

    // console.log("Graph nodes:", graphNodes);
    // console.log("Graph links:", graphLinks);

    return (
        <ReactFlow
            colorMode="system"
            className="flex-1 overflow-hidden border bg-accent/15"
            nodes={graphNodes}
            edges={graphLinks}
            onNodesChange={handleNodesChange}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            fitView
        >
            <Background />
        </ReactFlow>
    );
}