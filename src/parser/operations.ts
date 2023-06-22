import { QuakeActionDict } from './Quake.ohm-bundle'
import {
  ClientUserinfoChanged,
  CommandToken,
  Game,
  GameToken,
  Games,
  GamesToken,
  Kill,
} from './tokens'

export const tokenOperations: QuakeActionDict<
  string | CommandToken | undefined
> = {
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
    return ClientUserinfoChanged(id.tokens(), name.tokens())
  },
  KillToken(_arg1, _arg2, assassin, victim, weapon, _arg5, _arg6) {
    return Kill(assassin.tokens(), victim.tokens(), weapon.tokens())
  },
}

export const gameOperations: QuakeActionDict<GamesToken | GameToken> = {
  AllGames(head, tail) {
    return Games([head.games(), tail.children.map((c) => c.games())].flat())
  },
  Game(_arg1, _arg2, other, _arg3, _arg4) {
    return Game(other.children.map((c) => c.tokens()))
  },
}
