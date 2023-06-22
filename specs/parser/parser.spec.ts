import dedent from 'dedent'
import { parse } from '@/parser/parser'
import { GamesToken } from '@/parser/tokens'
import { readFile } from 'node:fs/promises'

describe('Parser', () => {
  describe('Parsing a list of game commands', () => {
    describe('without any parsing errors', () => {
      it('returns an AST that can later be used to generate reports', () => {
        const str = dedent`
        0:00 ------------------------------------------------------------
        0:00 InitGame: \sv_floodProtect\1\sv_maxPing\0\sv_minPing\0\sv_maxRate\10000\sv_minRate\0\sv_hostname\Code Miner Server\g_gametype\0\sv_privateClients\2\sv_maxclients\16\sv_allowDownload\0\dmflags\0\fraglimit\20\timelimit\15\g_maxGameClients\0\capturelimit\8\version\ioq3 1.36 linux-x86_64 Apr 12 2009\protocol\68\mapname\q3dm17\gamename\baseq3\g_needpass\0
       15:00 Exit: Timelimit hit.
       20:34 ClientConnect: 2
       20:34 ClientUserinfoChanged: 2 n\Isgalamido\t\0\model\\xian/default\hmodel\\xian/default\g_redteam\\g_blueteam\\c1\4\c2\5\hc\100\w\0\l\0\tt\0\tl\0
       20:37 ClientUserinfoChanged: 2 n\Isgalamido\t\0\model\\uriel/zael\hmodel\\uriel/zael\g_redteam\\g_blueteam\\c1\5\c2\5\hc\100\w\0\l\0\tt\0\tl\0
       20:37 ClientBegin: 2
       20:37 ShutdownGame:
       20:37 ------------------------------------------------------------`

        const ast: GamesToken = {
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
                      content: '2',
                    },
                    {
                      kind: 'UserName',
                      content: 'Isgalamido',
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
                      content: 'Isgalamido',
                    },
                  ],
                },
              ],
            },
          ],
        }

        expect(parse(str)).toStrictEqual(ast)
      })
    })

    describe('with parsing errors', () => {
      it('returns an error', () => {
        expect(parse('a')).toStrictEqual({
          error: dedent`Line 1, col 1:
          > 1 | a
                ^
          Expected a digit`,
        })
      })
    })
  })

  describe('parsing a single token', () => {
    it('works', () => {
      const str = dedent`20:37 ClientUserinfoChanged: 2 n\Isgalamido\t\n`

      expect(parse(str, true)).toStrictEqual({
        kind: 'ClientUserinfoChanged',
        children: [
          {
            kind: 'UserID',
            content: '2',
          },
          {
            kind: 'UserName',
            content: 'Isgalamido',
          },
        ],
      })
    })

    describe('parsing ClientUserinfoChanged', () => {
      it.each([
        {
          input: dedent`20:37 ClientUserinfoChanged: 2 n\Chessus!\t\n`,
          expected: 'Chessus!',
        },
        {
          input: dedent`20:37 ClientUserinfoChanged: 2 n\M@ry!\t\n`,
          expected: 'M@ry!',
        },
      ])('works for $expected', ({ input, expected }) => {
        expect(parse(input, true)).toStrictEqual({
          kind: 'ClientUserinfoChanged',
          children: [
            {
              kind: 'UserID',
              content: '2',
            },
            {
              kind: 'UserName',
              content: expected,
            },
          ],
        })
      })
    })
  })

  describe('parsing Kill', () => {
    it.each([
      {
        input: dedent` 22:06 Kill: 2 3 7: Isgalamido killed Mocinha by MOD_ROCKET_SPLASH\n`,
        expected: {
          kind: 'Kill',
          children: [
            {
              kind: 'AssassinID',
              content: '2',
            },
            {
              kind: 'VictimID',
              content: '3',
            },
            {
              kind: 'WeaponID',
              content: '7',
            },
          ],
        },
      },
      {
        input: dedent` 20:54 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT\n`,
        expected: {
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
      },
    ])('works', ({ input, expected }) => {
      expect(parse(input, true)).toStrictEqual(expected)
    })
  })
})

describe('parsing the example data', () => {
  it('should return 21 games', async () => {
    const data = await readFile('./data/quake.log', 'utf8')

    const result = <GamesToken>parse(data)

    expect(result.children).toHaveLength(21)
  })
})
