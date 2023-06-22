import { MatchResult } from 'ohm-js'
import grammar, { QuakeGrammar, QuakeSemantics } from './Quake.ohm-bundle'
import { operations } from './operations'

export interface Parser {
  grammar: QuakeGrammar
  semantics: QuakeSemantics
}

type Failures = {
  [key: string]: string
}

interface FixForIncompleteMatchResult extends MatchResult {
  getRightmostFailures(): Failures[]
}

export function parse(str: string): string | { error: string } {
  const parser = buildParser()

  const match = <FixForIncompleteMatchResult>parser.grammar.match(str)

  if (match.failed()) {
    return { error: <string>match.message }
  } else {
    const result = parser.semantics(match).operations()

    return result
  }
}

function buildParser(): Parser {
  const parser: Parser = {
    grammar: grammar,
    semantics: grammar.createSemantics(),
  }

  parser.semantics.addOperation('operations', operations)

  return parser
}
