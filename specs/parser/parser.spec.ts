import dedent from 'dedent'
import { parse } from '@/parser/parser'
import { GamesToken } from '@/parser/tokens'

describe('Parser', () => {
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
