import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Safenaija',
  description: 'AI powered dahboard',
  creator: 'Charles Chijuka',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
