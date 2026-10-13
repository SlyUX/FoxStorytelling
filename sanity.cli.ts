import { defineCliConfig } from 'sanity/cli'

import { projectId, dataset } from './src/sanity/env'

/**
 * CLI config, used by `sanity schema extract` and `sanity typegen generate`
 * (`npm run typegen`). Separate from sanity.config.ts, which configures the
 * Studio itself; the CLI only needs to know which project and dataset to use.
 */
export default defineCliConfig({
  api: { projectId, dataset },
})
