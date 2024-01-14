import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jack Kammerer',
  description: 'A personal portfolio website for Jack Kammerer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://kit.fontawesome.com/31a9bcd812.js" crossOrigin="anonymous" async></script>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"></link>
        <link href="https://fonts.googleapis.com/css2?family=Kanit&family=Roboto+Mono:ital,wght@0,400;0,500;1,200;1,400;1,700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500&display=swap" rel="stylesheet"></link>
        <meta property="url" content="https://jackkammerer.com" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
