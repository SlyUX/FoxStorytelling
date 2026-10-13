import type { StructureResolver } from 'sanity/structure'

/**
 * Studio sidebar: settings first, then content in the order the site shows it.
 *
 * `siteSettings` is pinned to a single document. Without that, editors can
 * create a second one, and the site reads whichever the query returns first.
 * Paired with `newDocumentOptions` in sanity.config.ts, which hides it from
 * the global create menu.
 */
export const SINGLETONS = ['siteSettings']

const PLACED = ['siteSettings', 'book', 'post', 'page']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('siteSettings')
        .schemaType('siteSettings')
        .title('Site settings')
        .child(S.editor().id('siteSettings').schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('book').title('Stories'),
      S.documentTypeListItem('post').title('Rejection Files'),
      S.documentTypeListItem('page').title('Pages'),
      // Anything added later still appears, at the end.
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return id ? !PLACED.includes(id) && !SINGLETONS.includes(id) : true
      }),
    ])
