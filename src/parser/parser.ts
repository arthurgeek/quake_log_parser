import { MatchResult } from 'ohm-js'
import { gameOperations, tokenOperations } from './operations'
import grammar, { QuakeGrammar, QuakeSemantics } from './Quake.ohm-bundle'
import { CommandToken, GameToken, GamesToken } from './tokens'

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

export function parse(
  str: string,
  token = false,
): GamesToken | CommandToken | { error: string } {
  const parser = buildParser()

  const semanticFunName = token ? 'tokens' : 'games'
  const startRule = token ? 'ActionTokens' : undefined

  const match = <FixForIncompleteMatchResult>(
    parser.grammar.match(str, startRule)
  )

  if (match.failed()) {
    return { error: <string>match.message }
  } else {
    const result = parser.semantics(match)[semanticFunName]()

    return token ? result : removeIgnoredTokens(result)
  }
}

function buildParser(): Parser {
  const parser: Parser = {
    grammar: grammar,
    semantics: grammar.createSemantics(),
  }

  parser.semantics.addOperation('tokens', tokenOperations)
  parser.semantics.addOperation('games', gameOperations)

  return parser
}

function removeIgnoredTokens(allGames: GamesToken): GamesToken {
  return {
    ...allGames,
    children: allGames.children.map((game: GameToken): GameToken => {
      return {
        ...game,
        children: game.children.filter(
          (token: CommandToken) => token != undefined,
        ),
      }
    }),
  }
}
