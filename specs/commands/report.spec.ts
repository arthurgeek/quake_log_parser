import { reportCommand } from '@/commands/report'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

vitest.spyOn(console, 'log')

describe('report command', () => {
  it('prints a JSON structure for all games in `data/quake.log if no file is given`', async () => {
    vitest.mocked(console.log).mockImplementation(noop)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await reportCommand.callback!({ _: { file: undefined } })

    expect(vitest.mocked(console.log).mock.calls).toMatchSnapshot()
  })

  it('accepts another file`', async () => {
    vitest.mocked(console.log).mockImplementation(noop)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await reportCommand.callback!({
      _: { file: './specs/data/smallerWithKills.log' },
    })

    expect(vitest.mocked(console.log).mock.calls).toMatchInlineSnapshot(`
      [
        [
          "[{\\"id\\":1,\\"players\\":[{\\"id\\":\\"2\\",\\"name\\":\\"Zeh\\",\\"kills\\":1},{\\"id\\":\\"3\\",\\"name\\":\\"Isgalamido\\",\\"kills\\":2},{\\"id\\":\\"4\\",\\"name\\":\\"Zeh\\",\\"kills\\":0},{\\"id\\":\\"5\\",\\"name\\":\\"Assasinu Credi\\",\\"kills\\":1}],\\"totalKills\\":14,\\"killsByMeans\\":{\\"MOD_ROCKET\\":4,\\"MOD_ROCKET_SPLASH\\":4,\\"MOD_TRIGGER_HURT\\":5,\\"MOD_RAILGUN\\":1}}]",
        ],
      ]
    `)
  })
})
