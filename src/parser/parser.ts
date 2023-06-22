import grammar, { QuakeGrammar, QuakeSemantics } from './Quake.ohm-bundle'
import { operations } from './operations'

export interface Parser {
  grammar: QuakeGrammar
  semantics: QuakeSemantics
}

export function parse(str: string): string {
  const parser = buildParser()
  const match = parser.grammar.match(str)

  return parser.semantics(match).operations()
}

function buildParser(): Parser {
  const parser: Parser = {
    grammar: grammar,
    semantics: grammar.createSemantics(),
  }

  parser.semantics.addOperation('operations', operations)

  return parser
}
