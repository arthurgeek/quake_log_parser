import {
  CommandToken,
  GameToken,
  GamesToken,
  TerminalToken,
  Tokens,
} from '@/parser/tokens'

describe('Tokens', () => {
  describe('games token', () => {
    it('returns a games token with its given children', () => {
      const children: GameToken = { kind: 'Game', children: [] }
      const gamesToken: GamesToken = { kind: 'AllGames', children: [children] }

      expect(Tokens.games([children])).toStrictEqual(gamesToken)
    })
  })

  describe('game token', () => {
    it('returns a game token with its given children', () => {
      const children: CommandToken = { kind: 'Kill', children: [] }
      const gameToken: GameToken = { kind: 'Game', children: [children] }

      expect(Tokens.game([children])).toStrictEqual(gameToken)
    })
  })

  describe('client user info changed token', () => {
    it('returns a new token with its given user id and name as children', () => {
      const token: CommandToken = {
        kind: 'ClientUserinfoChanged',
        children: [
          { kind: 'UserID', content: '1' } satisfies TerminalToken,
          { kind: 'UserName', content: 'Name' } satisfies TerminalToken,
        ],
      }

      expect(Tokens.clientUserinfoChanged('1', 'Name')).toStrictEqual(token)
    })
  })

  describe('kill token', () => {
    it('returns a new token with its given assassin, victim and weapon ID', () => {
      const token: CommandToken = {
        kind: 'Kill',
        children: [
          { kind: 'AssassinID', content: '1' } satisfies TerminalToken,
          { kind: 'VictimID', content: '2' } satisfies TerminalToken,
          { kind: 'WeaponID', content: '3' } satisfies TerminalToken,
        ],
      }

      expect(Tokens.kill('1', '2', '3')).toStrictEqual(token)
    })
  })
})
