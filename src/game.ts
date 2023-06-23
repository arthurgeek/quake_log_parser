export interface Player {
  id: string
  name: string
  kills: number
}

enum MeansOfDeath {
  MOD_UNKNOWN,
  MOD_SHOTGUN,
  MOD_GAUNTLET,
  MOD_MACHINEGUN,
  MOD_GRENADE,
  MOD_GRENADE_SPLASH,
  MOD_ROCKET,
  MOD_ROCKET_SPLASH,
  MOD_PLASMA,
  MOD_PLASMA_SPLASH,
  MOD_RAILGUN,
  MOD_LIGHTNING,
  MOD_BFG,
  MOD_BFG_SPLASH,
  MOD_WATER,
  MOD_SLIME,
  MOD_LAVA,
  MOD_CRUSH,
  MOD_TELEFRAG,
  MOD_FALLING,
  MOD_SUICIDE,
  MOD_TARGET_LASER,
  MOD_TRIGGER_HURT,
  MOD_NAIL,
  MOD_CHAINGUN,
  MOD_PROXIMITY_MINE,
  MOD_KAMIKAZE,
  MOD_JUICED,
  MOD_GRAPPLE,
}

type MeansOfDeathValues = keyof typeof MeansOfDeath

export type KillsByMeans = {
  [key in MeansOfDeathValues]?: number
}

export type GameJSON = Pick<
  Game,
  'id' | 'players' | 'totalKills' | 'killsByMeans'
>

export class Game {
  #id: number
  #players: Player[]
  #totalKills: number
  #killsByMeans: KillsByMeans

  private static readonly WORLD_PLAYER_ID = '1022'

  constructor(id: number) {
    this.#id = id
    this.#players = []
    this.#totalKills = 0
    this.#killsByMeans = {}
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

  get killsByMeans() {
    return this.#killsByMeans
  }

  addOrUpdatePlayer = (id: string, name: string) => {
    const existingPlayer = this.getPlayer(id)
    existingPlayer ? (existingPlayer.name = name) : this.addPlayer(id, name)
  }

  addKill = (assassinID: string, victimID: string, weaponID: string) => {
    const assassinIsWorld = assassinID === Game.WORLD_PLAYER_ID
    const assassin = this.getPlayer(assassinID)
    const victim = this.getPlayer(victimID)
    const weapon = MeansOfDeath[parseInt(weaponID)] as
      | MeansOfDeathValues
      | undefined

    if (assassin && victim && weapon) {
      assassin.kills++
    } else {
      if (assassinIsWorld && victim && weapon) {
        victim.kills--
      } else {
        throw new Error(`Error: Error parsing kill`)
      }
    }

    this.#killsByMeans[weapon] = (this.#killsByMeans[weapon] || 0) + 1
    this.#totalKills++
  }

  toJSON = (): GameJSON => {
    return {
      id: this.id,
      players: this.#players,
      totalKills: this.#totalKills,
      killsByMeans: this.#killsByMeans,
    }
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
