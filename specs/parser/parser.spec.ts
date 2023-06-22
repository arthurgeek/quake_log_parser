import dedent from 'dedent'
import { parse } from '@/parser/parser'

describe('A very basic parser', () => {
  describe('without any parsing errors', () => {
    it('returns the parsed value', () => {
      expect(parse('1')).toEqual('1')
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
