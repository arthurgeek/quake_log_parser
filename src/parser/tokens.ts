export type CommandToken = {
  kind: 'ClientUserinfoChanged' | 'Kill'
  children: TerminalToken[]
}

export type TerminalToken = {
  kind: 'UserID' | 'UserName' | 'AssassinID' | 'VictimID' | 'WeaponID'
  content: string
}

export interface GamesToken {
  kind: 'AllGames'
  children: GameToken[]
}

export interface GameToken {
  kind: 'Game'
  children: CommandToken[]
}

export class Tokens {
  static games = (children: GameToken[]): GamesToken => {
    return { kind: 'AllGames', children }
  }

  static game = (children: CommandToken[]): GameToken => {
    return {
      kind: 'Game',
      children,
    }
  }

  static clientUserinfoChanged = (id: string, name: string): CommandToken => {
    return {
      kind: 'ClientUserinfoChanged',
      children: [
        { kind: 'UserID', content: id },
        { kind: 'UserName', content: name },
      ],
    }
  }

  static kill = (
    assassin: string,
    victim: string,
    weapon: string,
  ): CommandToken => {
    return {
      kind: 'Kill',
      children: [
        { kind: 'AssassinID', content: assassin },
        { kind: 'VictimID', content: victim },
        { kind: 'WeaponID', content: weapon },
      ],
    }
  }
}
