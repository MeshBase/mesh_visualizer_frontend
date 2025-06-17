import { BaseEdge } from '@xyflow/react';

export function CustomAnimatedEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }: any) {
    const offset = data?.offset || 0;
    const packetColor = data?.packetColor || '#ff0073'; // fallback color

    // Midpoint
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const len = Math.sqrt(dx * dx + dy * dy);

    const normX = dx / len;
    const normY = dy / len;

    const perpX = -normY;
    const perpY = normX;

    const cpx = midX + perpX * offset;
    const cpy = midY + perpY * offset;

    const edgePath = `M${sourceX},${sourceY} Q${cpx},${cpy} ${targetX},${targetY}`;

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ strokeWidth: 2, stroke: '#a6e22e' }} />
            <circle r="6" fill={packetColor}>
                <animateMotion dur="1s" repeatCount="1" path={edgePath} />
            </circle>
        </>
    );
}
