import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import useSettingsStore from '../../stores/settingsStore'

const SEOHead = ({ 
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  article = null,
  noindex = false,
  nofollow = false
}) => {
  const { 
    fetchSettings,
    getSiteName,
    getMetaTitle,
    getMetaDescription,
    getMetaKeywords,
    getOgTitle,
    getOgDescription,
    getOgImage,
    getSiteUrl,
    getFavicon,
    getGoogleAnalyticsId,
    getFacebookPixelId
  } = useSettingsStore()

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      await fetchSettings()
      setIsLoaded(true)
    }
    loadSettings()
  }, [fetchSettings])

  if (!isLoaded) {
    return null // Don't render until settings are loaded
  }

  // Build meta values with fallbacks
  const siteName = getSiteName()
  const siteUrl = getSiteUrl()
  const favicon = getFavicon()
  const googleAnalyticsId = getGoogleAnalyticsId()
  const facebookPixelId = getFacebookPixelId()

  const metaTitle = title || getMetaTitle()
  const metaDescription = description || getMetaDescription()
  const metaKeywords = keywords || getMetaKeywords()
  const ogTitle = title || getOgTitle()
  const ogDescription = description || getOgDescription()
  const ogImage = image || getOgImage()
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl

  // Build robots directive
  const robotsDirectives = []
  if (noindex) robotsDirectives.push('noindex')
  if (nofollow) robotsDirectives.push('nofollow')
  const robots = robotsDirectives.length > 0 ? robotsDirectives.join(', ') : 'index, follow'

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Favicon */}
      {favicon && <link rel="icon" href={favicon} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:alt" content={ogTitle} />}

      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content={siteName} />

      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": siteUrl,
          "logo": ogImage,
          "description": metaDescription,
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English", "Swahili"]
          },
          "areaServed": {
            "@type": "Country",
            "name": "Kenya"
          }
        })}
      </script>

      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </script>
        </>
      )}

      {/* Facebook Pixel */}
      {facebookPixelId && (
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </script>
      )}
    </Helmet>
  )
}

export default SEOHead