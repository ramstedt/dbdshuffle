import {createClient} from '@sanity/client'

console.log('Sanity Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-01-31',
})
