export function CustomPacketNode({ data }: any) {
    const color = data?.color || "#ffffff";
    const icon = data?.icon || "...";

    return (
        <div
            className="flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium shadow"
            style={{ backgroundColor: color ?? "#555" }}
        >
            {icon}
            {data.label ?? "Packet"}
        </div>
    );
}
