import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/private/', '/admin/'] // Add any private routes you want to block
		},
		sitemap: 'https://remcostoeten.com/sitemap.xml' // Replace with your domain
	}
}
