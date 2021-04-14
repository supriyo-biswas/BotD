type SimpleSourceResult = string | number | boolean
type SourceResult = SimpleSourceResult | SimpleSourceResult[]
type SourceFunction = () => SourceResult | Promise<SourceResult>
export type SourceDict = Record<string, SourceFunction>
export type SourceResultDict = Record<string, Source>

type Source =
  | {
      state: State.Success
      value: SourceResult
    }
  | {
      state: State.Failure
      value: string
    }

export interface Options {
  token: string
  url: string
}

export interface Result {
  is_bot: string
  is_search_bot: string
  inconsistency: string
  is_vm: string
}

const enum State {
  Success = 1,
  Failure = -1,
}

async function handleSource(sourceFunction: SourceFunction): Promise<Source> {
  let sourceResult: SourceResult
  let result: Source
  try {
    sourceResult = await sourceFunction()
    result = { state: State.Success, value: sourceResult }
  } catch (e) {
    result = { state: State.Failure, value: e.toString() }
  }
  return result
}

export default async function handleAll(sources: SourceDict): Promise<SourceResultDict> {
  const results: SourceResultDict = {}
  for (const name in sources) {
    if (Object.prototype.hasOwnProperty.call(sources, name)) {
      const sourceFunction = sources[name]
      results[name] = await handleSource(sourceFunction)
    }
  }
  return results
}