import book from './book'
import post from './post'
import page from './page'
import series from './series'
import siteSettings from './siteSettings'
import buyLink from './buyLink'
import socialLink from './socialLink'
import { imageWithAlt, link, richText } from './objects'

export const schemaTypes = [siteSettings, book, series, post, page, buyLink, socialLink, link, imageWithAlt, richText]
