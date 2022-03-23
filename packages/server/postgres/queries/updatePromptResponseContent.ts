import getPg from '../getPg'
import {
  IUpdatePromptResponseContentByIdQueryParams,
  updatePromptResponseContentByIdQuery
} from './generated/updatePromptResponseContentByIdQuery'

export const updatePromptResponseContentById = async (
  params: IUpdatePromptResponseContentByIdQueryParams
) => {
  await updatePromptResponseContentByIdQuery.run(params, getPg())
}
