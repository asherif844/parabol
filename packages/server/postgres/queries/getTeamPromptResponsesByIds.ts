import {getTeamPromptResponsesByIdsQuery, IGetTeamPromptResponsesByIdsQueryResult} from './generated/getTeamPromptResponsesByIdsQuery'
import {JSONContent} from '@tiptap/core'
import getPg from '../getPg'

export interface TeamPromptResponse extends  Omit<IGetTeamPromptResponsesByIdsQueryResult, 'content'> {
  content: JSONContent
}

export const mapToTeamPromptResponse = (results: IGetTeamPromptResponsesByIdsQueryResult[]): TeamPromptResponse[] => {
  return results.map((teamPromptResponse: any) => {
    return {
      ...teamPromptResponse,
      content: teamPromptResponse.content as JSONContent
    } as TeamPromptResponse
  })
}

export const getTeamPromptResponsesByIds = async (promptResponseIds: readonly number[]): Promise<TeamPromptResponse[]> => {
  const teamPromptResponses = await getTeamPromptResponsesByIdsQuery.run({ids: promptResponseIds}, getPg())
  return mapToTeamPromptResponse(teamPromptResponses)
}

export const getTeamPromptResponseById = async (id: number): Promise<TeamPromptResponse | null> => {
  const teamPromptResponses = await getTeamPromptResponsesByIds([id])
  return teamPromptResponses[0] ?? null
}
