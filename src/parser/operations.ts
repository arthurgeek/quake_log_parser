import { QuakeActionDict } from './Quake.ohm-bundle'

export const operations: QuakeActionDict<string> = {
  _terminal() {
    return this.sourceString
  },
}
