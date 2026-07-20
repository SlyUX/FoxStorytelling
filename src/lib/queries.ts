import { client } from '@/sanity/client'
export async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    return await client.fetch<T>(query, params)
  } catch {
    return fallback
  }
}
export const BOOKS_QUERY = `*[_type=="book"]|order(order asc){_id,title,"slug":slug.current,series,status,shortDescription,cover}`
export const BOOK_QUERY = `*[_type=="book" && slug.current==$slug][0]{_id,title,series,status,description,buyLinks,cover}`
export const POSTS_QUERY = `*[_type=="post"]|order(publishedAt desc){_id,title,"slug":slug.current,category,excerpt,publishedAt,cover}`
export const POST_QUERY = `*[_type=="post" && slug.current==$slug][0]{_id,title,category,body,publishedAt,cover}`
export const FEATURED_QUERY = `*[_type=="post" && featured==true]|order(publishedAt desc)[0]{title,"slug":slug.current,excerpt}`
