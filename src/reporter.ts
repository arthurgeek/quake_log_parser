import { Game, GameJSON } from './game'
import {
  CommandToken,
  GameToken,
  GamesToken,
  TerminalToken,
} from './parser/tokens'

export class Reporter {
  #games: GamesToken

  constructor(gamesToken: GamesToken) {
    this.#games = gamesToken
  }

  report = (): GameJSON[] => {
    const games: GameJSON[] = []

    this.#games.children.forEach((gameToken, index) => {
      games.push(new GameReport(gameToken, index).game.toJSON())
    })

    return games
  }
}

class GameReport {
  #gameToken: GameToken
  game: Game

  constructor(gameToken: GameToken, index: number) {
    this.#gameToken = gameToken
    this.game = new Game(++index)

    this.addPlayers()
    this.addKills()
  }

  private addPlayers = () => {
    const clientUserinfoChangedTokens = this.#gameToken.children.filter(
      (command: CommandToken) => command.kind == 'ClientUserinfoChanged',
    )

    for (const changeToken of clientUserinfoChangedTokens) {
      const id = (
        changeToken.children.find(
          (command) => command.kind == 'UserID',
        ) as TerminalToken
      ).content

      const name = (
        changeToken.children.find(
          (command) => command.kind == 'UserName',
        ) as TerminalToken
      ).content

      this.game.addOrUpdatePlayer(id, name)
    }
  }

  private addKills = () => {
    const killTokens = this.#gameToken.children.filter(
      (command: CommandToken) => command.kind == 'Kill',
    )

    for (const killToken of killTokens) {
      const assassinID = (
        killToken.children.find(
          (command) => command.kind == 'AssassinID',
        ) as TerminalToken
      ).content

      const victimID = (
        killToken.children.find(
          (command) => command.kind == 'VictimID',
        ) as TerminalToken
      ).content

      this.game.addKill(assassinID, victimID)
    }
  }
}
