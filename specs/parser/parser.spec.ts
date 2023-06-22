import { parse } from '@/parser/parser'

describe('A very basic parser', () => {
  it('returns the parsed value', () => {
    expect(parse('1')).toEqual('1')
  })
})
