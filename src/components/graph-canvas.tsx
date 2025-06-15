import { useGraphStore } from "@/store/raw-graph-store";
import { ReactFlow, type NodeChange, Background } from "@xyflow/react";
import { edgeTypes } from "./CustomEdge";

export function GraphCanvas() {
    const { nodes, links } = useGraphStore((state) => state.graph)
    const positions = useGraphStore((state) => state.nodePositions)
    const setNodePosition = useGraphStore((state) => state.setNodePosition)

    console.log("Graph nodes:", nodes);
    console.log("Graph links:", links);

    function getEdgeColor(technology: string): string {
        const hash = Array.from(technology).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    }

    const graphNodes = nodes.map((node) => ({
        id: node.id,
        data: { label: node.id },
        position: positions[node.id],
    }));

    const grouped = new Map<string, string[]>();

    const graphLinks = links.map((link) => {
        const key = `${link.source}-${link.target}`;
        const techList = grouped.get(key) ?? [];

        if (!techList.includes(link.technology)) {
            techList.push(link.technology);
        }

        grouped.set(key, techList);

        const offset = (techList.indexOf(link.technology) - (techList.length - 1) / 2) * 100;

        return {
            id: `${link.source}-${link.target}-${link.technology}`,
            source: link.source,
            target: link.target,
            label: link.technology,
            type: "custom",
            data: {
                technology: link.technology,
                offset,
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
            fitView
        >
            <Background />
        </ReactFlow>
    );
}