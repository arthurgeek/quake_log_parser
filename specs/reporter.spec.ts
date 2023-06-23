import { Reporter } from '@/reporter'
import { GamesToken } from '@/parser/tokens'
import { GameJSON } from '@/game'

describe('Reporter', () => {
  it('detects all players in the game', () => {
    const games: GamesToken = {
      kind: 'AllGames',
      children: [
        {
          kind: 'Game',
          children: [
            {
              kind: 'ClientUserinfoChanged',
              children: [
                {
                  kind: 'UserID',
                  content: '1',
                },
                {
                  kind: 'UserName',
                  content: 'First User',
                },
              ],
            },
            {
              kind: 'ClientUserinfoChanged',
              children: [
                {
                  kind: 'UserID',
                  content: '2',
                },
                {
                  kind: 'UserName',
                  content: 'Second User',
                },
              ],
            },
          ],
        },
      ],
    }

    const result: GameJSON[] = [
      {
        id: 1,
        totalKills: 0,
        players: [
          { id: '1', name: 'First User', kills: 0 },
          { id: '2', name: 'Second User', kills: 0 },
        ],
      },
    ]

    expect(new Reporter(games).report()).toStrictEqual(result)
  })

  it('detects when players change names', () => {
    const games: GamesToken = {
      kind: 'AllGames',
      children: [
        {
          kind: 'Game',
          children: [
            {
              kind: 'ClientUserinfoChanged',
              children: [
                {
                  kind: 'UserID',
                  content: '1',
                },
                {
                  kind: 'UserName',
                  content: 'First User',
                },
              ],
            },
            {
              kind: 'ClientUserinfoChanged',
              children: [
                {
                  kind: 'UserID',
                  content: '1',
                },
                {
                  kind: 'UserName',
                  content: 'Malandrilson',
                },
              ],
            },
          ],
        },
      ],
    }

    const result: GameJSON[] = [
      {
        id: 1,
        totalKills: 0,
        players: [{ id: '1', name: 'Malandrilson', kills: 0 }],
      },
    ]

    expect(new Reporter(games).report()).toStrictEqual(result)
  })

  it('detects all kills', () => {
    const games: GamesToken = {
      kind: 'AllGames',
      children: [
        {
          kind: 'Game',
          children: [
            {
              kind: 'ClientUserinfoChanged',
              children: [
                {
                  kind: 'UserID',
                  content: '1',
                },
                {
                  kind: 'UserName',
                  content: 'First User',
                },
              ],
            },
            {
              kind: 'ClientUserinfoChanged',
              children: [
                {
                  kind: 'UserID',
                  content: '2',
                },
                {
                  kind: 'UserName',
                  content: 'Second User',
                },
              ],
            },
            {
              kind: 'Kill',
              children: [
                {
                  kind: 'AssassinID',
                  content: '1',
                },
                {
                  kind: 'VictimID',
                  content: '2',
                },
                {
                  kind: 'WeaponID',
                  content: '10',
                },
              ],
            },
            {
              kind: 'Kill',
              children: [
                {
                  kind: 'AssassinID',
                  content: '1',
                },
                {
                  kind: 'VictimID',
                  content: '2',
                },
                {
                  kind: 'WeaponID',
                  content: '8',
                },
              ],
            },
            {
              kind: 'Kill',
              children: [
                {
                  kind: 'AssassinID',
                  content: '1022',
                },
                {
                  kind: 'VictimID',
                  content: '2',
                },
                {
                  kind: 'WeaponID',
                  content: '22',
                },
              ],
            },
          ],
        },
      ],
    }

    const result: GameJSON[] = [
      {
        id: 1,
        totalKills: 3,
        players: [
          { id: '1', name: 'First User', kills: 2 },
          { id: '2', name: 'Second User', kills: -1 },
        ],
      },
    ]

    expect(new Reporter(games).report()).toStrictEqual(result)
  })
})
