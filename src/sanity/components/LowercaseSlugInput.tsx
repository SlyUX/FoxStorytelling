'use client'

import { useCallback } from 'react'
import { PatchEvent, type FormPatch, type SlugInputProps } from 'sanity'

import { toSlug } from '../slug'

/**
 * The slug input, normalizing what's stored as you type, not just what's shown.
 * (A CSS lowercase would be worse than nothing: the field would read "about"
 * while the document stored "About".) Validation in `slugField.ts` is the
 * backstop for pasted values and anything written outside this input.
 */
export function LowercaseSlugInput(props: SlugInputProps) {
  const { onChange } = props

  // onChange takes a patch, a list, or a PatchEvent: make it one PatchEvent, then rewrite its sets.
  const handleChange = useCallback(
    (incoming: FormPatch | PatchEvent | FormPatch[]) => {
      onChange(
        PatchEvent.from(
          PatchEvent.from(incoming).patches.map((patch) => {
            if (patch.type !== 'set') return patch
            // The slug arrives as a bare string at `current`, or as the whole { _type, current } object.
            if (typeof patch.value === 'string') return { ...patch, value: toSlug(patch.value, { final: false }) }
            if (patch.value && typeof patch.value === 'object' && 'current' in patch.value && typeof patch.value.current === 'string') {
              return { ...patch, value: { ...patch.value, current: toSlug(patch.value.current, { final: false }) } }
            }
            return patch
          }),
        ),
      )
    },
    [onChange],
  )

  return props.renderDefault({ ...props, onChange: handleChange })
}
