import './globals.css'
import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'

const roboto_mono = Roboto_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Check',
  description: 'Check || risk managment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto_mono.className}>{children}</body>
    </html>
  )
}
