import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import {urlFor} from '@/sanity/lib/image'
import type {WritingBodyImage} from '@/sanity/lib/writings'

const components: PortableTextComponents = {
  block: {
    normal: ({children, value}) => {
      const text = value.children
        ?.map((child) => ('text' in child ? child.text : ''))
        .join('')
        .trim()
      const isSignature = /^[-–—]\s*\S/.test(text || '')

      return <p className={isSignature ? 'writing-author-signature' : undefined}>{children}</p>
    },
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
        <figure className="writing-content-image">
          <Image
            alt={image.alt}
            height={875}
            sizes="(max-width: 700px) 92vw, 760px"
            src={urlFor(image).width(1400).quality(85).auto('format').url()}
            width={1400}
          />
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      )
    },
  },
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const external = href.startsWith('http')
      return (
        <a href={href} rel={external ? 'noreferrer' : undefined} target={external ? '_blank' : undefined}>
          {children}
        </a>
      )
    },
  },
}

export function WritingBody({
  value,
}: {
  value: Array<PortableTextBlock | WritingBodyImage>
}) {
  return <PortableText components={components} value={value} />
}
