import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';


export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }: any) {
    const offset = data?.offset || 0;

    // Midpoint coordinates
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    // Apply perpendicular offset to control point (for visual separation)
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const len = Math.sqrt(dx * dx + dy * dy);

    const normX = dx / len;
    const normY = dy / len;

    // Rotate 90° counterclockwise for perpendicular
    const perpX = -normY;
    const perpY = normX;

    // Shift midpoint to create control offset
    const cpx = midX + perpX * offset;
    const cpy = midY + perpY * offset;

    const edgePath = `M${sourceX},${sourceY} Q${cpx},${cpy} ${targetX},${targetY}`;

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ strokeWidth: 2, stroke: '#a6e22e' }} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${cpx}px, ${cpy}px)`,
                        background: 'gray',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 12,
                        color: '#000',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {data?.technology}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}





export const edgeTypes = {
    custom: CustomEdge,
};
