export type CommandToken = {
  kind: 'ClientUserinfoChanged'
  children: TerminalToken[]
}

export type TerminalToken = {
  kind: 'UserID' | 'UserName'
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

export function Games(children: GameToken[]): GamesToken {
  return { kind: 'AllGames', children }
}

export function Game(children: CommandToken[]): GameToken {
  return {
    kind: 'Game',
    children,
  }
}

export function ClientUserinfoChanged(id: string, name: string): CommandToken {
  return {
    kind: 'ClientUserinfoChanged',
    children: [
      { kind: 'UserID', content: id },
      { kind: 'UserName', content: name },
    ],
  }
}
