import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import {urlFor} from '@/sanity/lib/image'
import type {WritingBodyImage, WritingBodyVideo} from '@/sanity/lib/writings'

function mediaClasses(
  base: string,
  alignment: 'left' | 'center' | 'right' = 'center',
  size: 'small' | 'medium' | 'large' = 'large',
) {
  return `${base} media-align-${alignment} media-size-${size}`
}

export function PhotoCredit({credit, url}: {credit?: string; url?: string}) {
  if (!credit) return null

  return (
    <span className="writing-photo-credit">
      Photo by:{' '}
      {url ? (
        <a href={url} rel="noreferrer" target="_blank">{credit}</a>
      ) : credit}
    </span>
  )
}

function getYouTubeEmbedUrl(href: string) {
  try {
    const url = new URL(href)
    let id = url.hostname.replace(/^www\./, '') === 'youtu.be'
      ? url.pathname.split('/')[1]
      : url.searchParams.get('v')

    if (!id && (url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/'))) {
      id = url.pathname.split('/')[2]
    }

    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
  } catch {
    return null
  }
}

export function WritingVideo({video}: {video: WritingBodyVideo}) {
  if (video.displayAs === 'link') {
    return (
      <p className={mediaClasses('writing-content-external-link', video.alignment, video.size)}>
        <span aria-hidden="true">( </span>
        {video.caption && <span>{video.caption}: </span>}
        <a href={video.url} rel="noreferrer" target="_blank">{video.url}</a>
        <span aria-hidden="true"> )</span>
      </p>
    )
  }

  const embedUrl = getYouTubeEmbedUrl(video.url)
  if (!embedUrl) return null

  return (
    <figure className={mediaClasses('writing-content-video', video.alignment, video.size)}>
      <div>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={embedUrl}
          title={video.title}
        />
      </div>
      {video.caption && <figcaption>{video.caption}</figcaption>}
    </figure>
  )
}

const components: PortableTextComponents = {
  block: {
    normal: ({children, value}) => {
      const text = value.children
        ?.map((child) => ('text' in child ? child.text : ''))
        .join('')
        .trim()
      const isSignature = /^[-–—]\s*\S/.test(text || '')

      return <p className={isSignature ? 'writing-author-signature' : 'writing-text-justify'}>{children}</p>
    },
    alignLeft: ({children}) => <p className="writing-text-left">{children}</p>,
    alignCenter: ({children}) => <p className="writing-text-center">{children}</p>,
    alignRight: ({children}) => <p className="writing-text-right">{children}</p>,
    signature: ({children}) => <p className="writing-author-signature">{children}</p>,
    poem: ({children, value}) => {
      const text = value.children
        ?.map((child) => ('text' in child ? child.text : ''))
        .join('')
      const signature = text?.match(/(?:^|\n)\s*([-–—]\s*[^\n]+)\s*$/)

      if (!signature) {
        return (
          <div className="writing-poem-block">
            <p className="writing-poem-stanza">{children}</p>
          </div>
        )
      }

      const poemText = text.slice(0, signature.index).trimEnd()

      return (
        <div className="writing-poem-block">
          {poemText && <p className="writing-poem-stanza">{poemText}</p>}
          <p className="writing-poem-author">{signature[1]}</p>
        </div>
      )
    },
  },
  types: {
    image: ({value}) => {
      const image = value as WritingBodyImage
      if (!image.asset) return null

      return (
        <figure className={mediaClasses('writing-content-image', image.alignment, image.size)}>
          <Image
            alt={image.alt}
            height={875}
            sizes="(max-width: 700px) 92vw, 760px"
            src={urlFor(image).width(1400).quality(85).auto('format').url()}
            width={1400}
          />
          {(image.caption || image.credit) && (
            <figcaption>
              {image.caption && <span>{image.caption}</span>}
              <PhotoCredit credit={image.credit} url={image.creditUrl} />
            </figcaption>
          )}
        </figure>
      )
    },
    youtubeVideo: ({value}) => <WritingVideo video={value as WritingBodyVideo} />,
  },
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const external = href.startsWith('http')
      const openInNewTab = Boolean(value?.openInNewTab && external)
      return (
        <a href={href} rel={openInNewTab ? 'noreferrer' : undefined} target={openInNewTab ? '_blank' : undefined}>
          {children}
        </a>
      )
    },
  },
}

export function WritingBody({
  value,
}: {
  value: Array<PortableTextBlock | WritingBodyImage | WritingBodyVideo>
}) {
  return <PortableText components={components} value={value} />
}
