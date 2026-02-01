import { Noto_Sans_KR, Noto_Sans_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/navbar"

const fontSans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = Noto_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="h-[calc(100svh-3.5rem)]">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
