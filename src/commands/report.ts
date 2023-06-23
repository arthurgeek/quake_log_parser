import { readFile } from 'node:fs/promises'
import { command } from 'cleye'
import { Reporter } from '@/reporter'
import { Parser } from '@/parser/parser'

export const reportCommand = command(
  {
    name: 'report',
    parameters: ['[file]'],
    help: {
      description: 'report [file] and output JSON',
    },
  },
  async (argv) => {
    const file = argv._.file || './data/quake.log'
    const data = await readFile(file, 'utf8')
    const ast = new Parser(data).parse()

    if ('kind' in ast && ast.kind == 'AllGames') {
      console.log(JSON.stringify(new Reporter(ast).report()))
    }
  },
)
