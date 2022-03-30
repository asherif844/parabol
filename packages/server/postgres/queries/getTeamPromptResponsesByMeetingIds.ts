import {getTeamPromptResponsesByMeetingIdQuery} from './generated/getTeamPromptResponsesByMeetingIdQuery'
import getPg from '../getPg'

export const getTeamPromptResponsesByMeetingIds = async (meetingIds: readonly string[]) => {
  return getTeamPromptResponsesByMeetingIdQuery.run({meetingIds}, getPg())
}
