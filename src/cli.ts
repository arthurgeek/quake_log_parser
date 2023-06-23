#!/usr/bin/env npx tsx

import { cli } from 'cleye'
import { parseCommand } from './commands/parse'
import { reportCommand } from './commands/report'

cli(
  {
    name: 'quake',
    commands: [parseCommand, reportCommand],
    help: {
      description: 'CLI to parse Quake log files',
    },
  },
  (argv) => {
    argv.showHelp()
  },
)
