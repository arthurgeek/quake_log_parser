import { Game, GameJSON, KillsByMeans, Player } from '@/game'

interface LocalTestContext {
  game: Game
}

describe('Game', () => {
  describe('initialization', () => {
    const game = new Game(1)

    it('initializes id as the given id', () => {
      expect(game.id).toEqual(1)
    })

    it('initializes an empty players list', () => {
      expect(game.players).toEqual([])
    })

    it('initializes total kills to 0', () => {
      expect(game.totalKills).toEqual(0)
    })

    it('initializes kill by means to empty', () => {
      expect(game.killsByMeans).toEqual({})
    })
  })

  describe('addOrUpdatePlayer', () => {
    beforeEach<LocalTestContext>(async (context) => {
      context.game = new Game(1)
    })

    describe('when player is not already part of the game', () => {
      it<LocalTestContext>('adds a new player to game list with given id and name and 0 kills', ({
        game,
      }) => {
        game.addOrUpdatePlayer('1', 'Player Name')

        expect(game.players).toEqual([
          {
            id: '1',
            name: 'Player Name',
            kills: 0,
          } satisfies Player,
        ])
      })
    })

    describe('when player is already part of the game', () => {
      beforeEach<LocalTestContext>(async (context) => {
        context.game.addOrUpdatePlayer('1', 'Player Name')
      })

      it<LocalTestContext>('changes player name', ({ game }) => {
        game.addOrUpdatePlayer('1', 'New Player Name')

        expect(game.players).toEqual([
          {
            id: '1',
            name: 'New Player Name',
            kills: 0,
          } satisfies Player,
        ])
      })

      it<LocalTestContext>('keeps its kill count', ({ game }) => {
        game.addKill('1', '1', '10')

        game.addOrUpdatePlayer('1', 'New Player Name')

        expect(game.players).toStrictEqual([
          {
            id: '1',
            name: 'New Player Name',
            kills: 1,
          } satisfies Player,
        ])
      })
    })
  })

  describe('addKill', () => {
    describe('when assassin is an existing player', () => {
      beforeEach<LocalTestContext>(async (context) => {
        context.game = new Game(1)
        context.game.addOrUpdatePlayer('1', 'Player Name')
        context.game.addKill('1', '1', '10')
      })

      it<LocalTestContext>('increments the game totalKills', ({ game }) => {
        expect(game.totalKills).toEqual(1)
      })

      it<LocalTestContext>('increments the assassin kills', ({ game }) => {
        expect(game.players).toEqual([
          {
            id: '1',
            name: 'Player Name',
            kills: 1,
          } satisfies Player,
        ])
      })
    })

    describe('when assassin is <world>', () => {
      beforeEach<LocalTestContext>(async (context) => {
        context.game = new Game(1)
        context.game.addOrUpdatePlayer('1', 'Player Name')
        context.game.addKill('1022', '1', '10')
      })

      it<LocalTestContext>('increments the game totalKills', ({ game }) => {
        expect(game.totalKills).toEqual(1)
      })

      it<LocalTestContext>('dencrements the victim totalKills', ({ game }) => {
        expect(game.players).toStrictEqual([
          {
            id: '1',
            name: 'Player Name',
            kills: -1,
          } satisfies Player,
        ])
      })
    })

    describe('when assassin does not exist', () => {
      beforeEach<LocalTestContext>(async (context) => {
        context.game = new Game(1)
      })

      it<LocalTestContext>('throws an error and does not increment the game totalKills', ({
        game,
      }) => {
        expect(() => {
          game.addKill('1', '1', '10')
        }).toThrowError('Error: Error parsing kill')

        expect(game.totalKills).toEqual(0)
      })
    })

    describe('when victim does not exists', () => {
      beforeEach<LocalTestContext>(async (context) => {
        context.game = new Game(1)
        context.game.addOrUpdatePlayer('1', 'Player Name')
      })

      describe('and assassin is not <world>', () => {
        it<LocalTestContext>('throws an error and does not increment any kills', ({
          game,
        }) => {
          expect(() => {
            game.addKill('1', '2', '10')
          }).toThrowError('Error: Error parsing kill')

          expect(game.totalKills).toEqual(0)
          expect(game.players).toEqual([
            {
              id: '1',
              name: 'Player Name',
              kills: 0,
            } satisfies Player,
          ])
        })
      })

      describe('and assassin is <world>', () => {
        it<LocalTestContext>('throws an error and does not increment any kills', ({
          game,
        }) => {
          expect(() => {
            game.addKill('1022', '2', '10')
          }).toThrowError('Error: Error parsing kill')

          expect(game.totalKills).toEqual(0)
          expect(game.players).toEqual([
            {
              id: '1',
              name: 'Player Name',
              kills: 0,
            } satisfies Player,
          ])
        })
      })
    })

    describe('when weapon does not exist', () => {
      it('throws an error and does not increment any kills', () => {
        const game = new Game(1)
        game.addOrUpdatePlayer('1', 'Player Name')

        expect(() => {
          game.addKill('1022', '1', '100')
        }).toThrowError('Error: Error parsing kill')

        expect(game.totalKills).toEqual(0)
        expect(game.players).toEqual([
          {
            id: '1',
            name: 'Player Name',
            kills: 0,
          } satisfies Player,
        ])
      })
    })
  })

  describe('toJSON', () => {
    it('returns a GameJSON object with id, players, total kills and grouped kills by means', () => {
      const game = new Game(1)
      game.addOrUpdatePlayer('1', 'First Player')
      game.addOrUpdatePlayer('2', 'Second Player')
      game.addKill('1022', '1', '19')
      game.addKill('1022', '2', '22')
      game.addKill('1', '2', '10')
      game.addKill('1', '2', '7')
      game.addKill('2', '1', '10')

      expect(game.toJSON()).toStrictEqual({
        id: 1,
        players: [
          { id: '1', name: 'First Player', kills: 1 },
          { id: '2', name: 'Second Player', kills: 0 },
        ] satisfies Player[],
        totalKills: 5,
        killsByMeans: {
          MOD_FALLING: 1,
          MOD_TRIGGER_HURT: 1,
          MOD_ROCKET_SPLASH: 1,
          MOD_RAILGUN: 2,
        } satisfies KillsByMeans,
      } satisfies GameJSON)
    })
  })
})
