import { parseCommand } from '../../src/commands/parse'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

vitest.spyOn(console, 'log')

describe('parse command', () => {
  it('prints a JSON structure for all games in `data/quake.log if no file is given`', async () => {
    vitest.mocked(console.log).mockImplementation(noop)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await parseCommand.callback!({ _: { file: undefined } })

    expect(vitest.mocked(console.log).mock.calls).toMatchSnapshot()
  })

  it('accepts another file`', async () => {
    vitest.mocked(console.log).mockImplementation(noop)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await parseCommand.callback!({ _: { file: './specs/data/smaller.log' } })

    expect(vitest.mocked(console.log).mock.calls).toMatchInlineSnapshot(`
      [
        [
          "{\\"kind\\":\\"AllGames\\",\\"children\\":[{\\"kind\\":\\"Game\\",\\"children\\":[]},{\\"kind\\":\\"Game\\",\\"children\\":[]}]}",
        ],
      ]
    `)
  })
})
