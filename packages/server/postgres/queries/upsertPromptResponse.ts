import getPg from '../getPg'
import {
  IUpsertPromptResponseQueryParams,
  upsertPromptResponseQuery
} from './generated/upsertPromptResponseQuery'

export const upsertPromptResponse = async (
  response: IUpsertPromptResponseQueryParams['response']
) => {
  return upsertPromptResponseQuery.run({response}, getPg())
}
