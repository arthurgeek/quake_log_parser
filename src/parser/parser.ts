import { MatchResult } from 'ohm-js'
import grammar, {
  QuakeActionDict,
  QuakeGrammar,
  QuakeSemantics,
} from './Quake.ohm-bundle'
import { GamesToken, CommandToken, Tokens, GameToken } from './tokens'

type Failures = {
  [key: string]: string
}

interface FixForIncompleteMatchResult extends MatchResult {
  getRightmostFailures(): Failures[]
}

export class Parser {
  #data: string
  #grammar: QuakeGrammar
  #semantics: QuakeSemantics

  constructor(data: string) {
    this.#data = data
    this.#grammar = grammar
    this.#semantics = grammar.createSemantics()

    this.#semantics.addOperation('tokens', this.getTokenOperations())
    this.#semantics.addOperation('games', this.getGamesOperations())
  }

  parse = (token = false): GamesToken | CommandToken | { error: string } => {
    const semanticFunName = token ? 'tokens' : 'games'
    const startRule = token ? 'ActionTokens' : undefined

    const match = <FixForIncompleteMatchResult>(
      this.#grammar.match(this.#data, startRule)
    )

    if (match.failed()) {
      return { error: <string>match.message }
    } else {
      const result = this.#semantics(match)[semanticFunName]()

      return token ? result : this.removeIgnoredTokens(result)
    }
  }

  private removeIgnoredTokens = (allGames: GamesToken): GamesToken => {
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

  private getTokenOperations = (): QuakeActionDict<
    string | CommandToken | undefined
  > => {
    return {
      _terminal() {
        return this.sourceString
      },
      _iter(...children) {
        return children.map((c) => c.tokens()).join('')
      },
      rest(content, _) {
        return content.children.map((c) => c.tokens()).join('')
      },
      IgnoredCommandToken(_arg1, _arg2, _arg3, _arg4) {
        return undefined
      },
      ClientUserInfoChangedToken(_arg1, _arg2, id, _arg3, name, _arg4, _arg5) {
        return Tokens.clientUserinfoChanged(id.tokens(), name.tokens())
      },
      KillToken(_arg1, _arg2, assassin, victim, weapon, _arg5, _arg6) {
        return Tokens.kill(assassin.tokens(), victim.tokens(), weapon.tokens())
      },
    }
  }

  private getGamesOperations = (): QuakeActionDict<GamesToken | GameToken> => {
    return {
      AllGames(head, tail) {
        return Tokens.games(
          [head.games(), tail.children.map((c) => c.games())].flat(),
        )
      },
      Game(_arg1, _arg2, other, _arg3, _arg4) {
        return Tokens.game(other.children.map((c) => c.tokens()))
      },
    }
  }
}
