import { create } from 'zustand'

export type RawGraph = {
    nodes: { id: string }[]
    links: { source: string; target: string; technology: string }[]
}

type GraphStore = {
    graph: RawGraph
    nodePositions: Record<string, { x: number; y: number }>,
    updateGraph: (newGraph: RawGraph) => void
    setNodePosition: (nodeId: string, position: { x: number; y: number }) => void
}

export function extractGraph(event: any): RawGraph | null {
    const parsed_event = JSON.parse(event);
    console.log('Parsed event:', parsed_event);
    console.log('Graph data:', parsed_event.graph);

    if (parsed_event.graph === undefined) {
        return null;
    }

    return parsed_event.graph as RawGraph;
}

export const useGraphStore = create<GraphStore>((set) => ({
    graph: { nodes: [], links: [] },
    nodePositions: {},
    updateGraph: (newGraph) => {
        const filteredGraph: RawGraph = {
            nodes: newGraph.nodes.map(({ id }) => ({ id })),
            links: newGraph.links.map(({ source, target, technology }) => ({ source, target, technology })),
        }

        const nodePositions: Record<string, { x: number; y: number }> = {
            ...Object.fromEntries(
                filteredGraph.nodes
                    .filter(node => !(node.id in (useGraphStore.getState().nodePositions)))
                    .map(node => [node.id, { x: Math.random() * 500, y: Math.random() * 500 }])
            ),
            ...useGraphStore.getState().nodePositions
        };

        set({ graph: filteredGraph, nodePositions });
    },

    setNodePosition: (nodeId, position) => {
        set((state) => ({
            nodePositions: {
                ...state.nodePositions,
                [nodeId]: position,
            },
        }));
    },
}))
