import type {ReactNode} from "react"

export function DetailSection({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <div>
            <h3 className="mb-3 text-base font-semibold">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    )
}

export function DetailItem({label, value}: {label: string; value: string}) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className="break-words text-right font-medium">{value}</span>
        </div>
    )
}
