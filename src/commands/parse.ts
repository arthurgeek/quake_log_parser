import { readFile } from 'node:fs/promises'
import { command } from 'cleye'
import { parse } from '@/parser/parser'

export const parseCommand = command(
  {
    name: 'parse',
    parameters: ['[file]'],
    help: {
      description: 'parse [file] and output a JSON AST',
    },
  },
  async (argv) => {
    const file = argv._.file || './data/quake.log'
    const data = await readFile(file, 'utf8')

    console.log(JSON.stringify(parse(data)))
  },
)
