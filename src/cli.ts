#!/usr/bin/env npx tsx

import { cli } from 'cleye'
import { parseCommand } from './commands/parse'

cli(
  {
    name: 'quake',
    commands: [parseCommand],
    help: {
      description: 'CLI to parse Quake log files',
    },
  },
  (argv) => {
    argv.showHelp()
  },
)
