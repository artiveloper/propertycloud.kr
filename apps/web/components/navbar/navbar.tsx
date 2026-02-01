import Image from "next/image"
import Link from "next/link"

export function Navbar() {
    return (
        <header className="h-14 border-b bg-background">
            <nav className="flex h-full items-center px-5">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/only-image.png"
                        alt="NEWDAWN PROPERTY"
                        width={46}
                        height={36}
                        priority
                    />
                    <span className="font-bold">Newdawn Platform</span>
                </Link>
            </nav>
        </header>
    )
}
