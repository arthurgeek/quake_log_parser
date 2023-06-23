export interface Player {
  id: string
  name: string
  kills: number
}

enum ErrorMessages {
  UnknownAssassin = 'Assassin is Unknown',
  UnknownVictim = 'Victim is Unknown',
}

export type GameJSON = Pick<Game, 'id' | 'players' | 'totalKills'>

export class Game {
  #id: number
  #players: Player[] = []
  #totalKills: number

  private static readonly WORLD_PLAYER_ID = '1022'

  constructor(id: number) {
    this.#id = id
    this.#players = []
    this.#totalKills = 0
  }

  get id() {
    return this.#id
  }

  get players() {
    return this.#players
  }

  get totalKills() {
    return this.#totalKills
  }

  addOrUpdatePlayer = (id: string, name: string) => {
    const existingPlayer = this.getPlayer(id)
    existingPlayer ? (existingPlayer.name = name) : this.addPlayer(id, name)
  }

  addKill = (assassinID: string, victimID: string) => {
    const assassinIsWorld = assassinID === Game.WORLD_PLAYER_ID
    const assassin = this.getPlayer(assassinID)
    const victim = this.getPlayer(victimID)

    if (assassin) {
      if (victim) {
        this.#totalKills++
        assassin.kills++
      } else {
        throw new Error(`Error: ${ErrorMessages.UnknownVictim}`)
      }
    } else {
      if (assassinIsWorld) {
        if (victim) {
          this.#totalKills++
          victim.kills--
        } else {
          throw new Error(`Error: ${ErrorMessages.UnknownVictim}`)
        }
      } else {
        throw new Error(`Error: ${ErrorMessages.UnknownAssassin}`)
      }
    }
  }

  toJSON = (): GameJSON => {
    return { id: this.id, players: this.#players, totalKills: this.#totalKills }
  }

  private addPlayer = (id: string, name: string) => {
    this.players.push({
      id: id,
      name: name,
      kills: 0,
    } satisfies Player)
  }

  private getPlayer = (id: string): Player | undefined => {
    return this.players.find((player) => player.id === id)
  }
}
