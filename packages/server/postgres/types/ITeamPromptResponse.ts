import {IGetTeamPromptResponsesByIdsQueryResult} from '../queries/generated/getTeamPromptResponsesByIdsQuery'
import Reactji from '../../database/types/Reactji'

interface ITeamPromptResponse extends IGetTeamPromptResponsesByIdsQueryResult {
  reactjis: Reactji[]
}

export default ITeamPromptResponse
