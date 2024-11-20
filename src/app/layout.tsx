import ZenIDEModal from '@/components/zenIDEmodal'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

export const metadata: Metadata = {
	title: 'IDE Component | Remco Stoeten',
	description:
		'A powerful React component for file structure visualization. Built with TypeScript and Tailwind CSS.',
	keywords: [
		'React',
		'TypeScript',
		'IDE',
		'File Explorer',
		'Component',
		'Visualization'
	],
	authors: [{ name: 'Remco Stoeten' }],
	creator: 'Remco Stoeten',
	publisher: 'Remco Stoeten',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1
		}
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://remcostoeten.com',
		title: 'IDE Component | Remco Stoeten',
		description:
			'A powerful React component for file structure visualization.',
		siteName: 'IDE Component',
		images: [
			{
				url: 'https://remcostoeten.com/og-image.jpg', // Add your OG image
				width: 1200,
				height: 630,
				alt: 'IDE Component Preview'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'IDE Component | Remco Stoeten',
		description:
			'A powerful React component for file structure visualization.',
		creator: '@remcostoeten', // Your Twitter handle
		images: ['https://remcostoeten.com/twitter-image.jpg'] // Add your Twitter card image
	},
	verification: {
		google: 'your-google-site-verification', // Add your Google verification code
		yandex: 'your-yandex-verification' // Optional
	},
	manifest: '/manifest.json'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ZenIDEModal />
				{children}
			</body>
		</html>
	)
}
