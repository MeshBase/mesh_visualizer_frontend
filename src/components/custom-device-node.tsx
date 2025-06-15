import { Handle, Position } from '@xyflow/react';
import { Monitor } from 'lucide-react'; // or any device icon you like

export function CustomDeviceNode({ data }: any) {
    return (
        <div className="flex flex-col items-center rounded-xl border bg-white px-3 py-2 shadow-md">
            <Monitor className="h-6 w-6 text-blue-500" />
            <span className="text-xs font-semibold text-gray-700">{data.label}</span>

            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-gray-500"  />
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-gray-500" />
        </div>
    );
}
