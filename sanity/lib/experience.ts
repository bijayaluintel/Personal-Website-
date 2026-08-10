import {defineQuery} from 'next-sanity'
import {client} from './client'

export type ExperienceItem = {
  id: string
  period: string
  title: string
  organization: string
  location: string
  description: string
  highlights: string[]
}

type ExperienceResult = {
  page: {
    eyebrow?: string
    title?: string
  } | null
  experiences: Array<{
    _id: string
    period: string
    title: string
    organization: string
    location: string
    description: string
    highlights: string[]
  }>
}

export type ExperienceContent = {
  hero: {
    eyebrow: string
    title: string
  }
  experiences: ExperienceItem[]
}

const EXPERIENCE_QUERY = defineQuery(/* groq */ `{
  "page": *[_type == "experiencePage"][0]{
    eyebrow,
    title
  },
  "experiences": *[_type == "experience"] | order(displayOrder asc, _createdAt desc){
    _id,
    period,
    title,
    organization,
    location,
    description,
    highlights
  }
}`)

export async function getExperienceContent(): Promise<ExperienceContent> {
  try {
    const data = await client.fetch<ExperienceResult>(
      EXPERIENCE_QUERY,
      {},
      {next: {revalidate: 60, tags: ['experience']}},
    )

    return {
      hero: {
        eyebrow: data.page?.eyebrow || 'Journey so far',
        title: data.page?.title || 'Experience',
      },
      experiences:
        data.experiences.length > 0
          ? data.experiences.map((experience) => ({
              id: experience._id,
              period: experience.period,
              title: experience.title,
              organization: experience.organization,
              location: experience.location,
              description: experience.description,
              highlights: experience.highlights,
            }))
          : [],
    }
  } catch (error) {
    console.error('Unable to load experience from Sanity:', error)
    return {
      hero: {eyebrow: 'Journey so far', title: 'Experience'},
      experiences: [],
    }
  }
}
