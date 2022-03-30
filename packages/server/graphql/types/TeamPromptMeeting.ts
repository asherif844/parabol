import {GraphQLList, GraphQLNonNull, GraphQLObjectType} from 'graphql'
import {GQLContext} from '../graphql'
import TeamPromptMeetingMember from './TeamPromptMeetingMember'
import NewMeeting, {newMeetingFields} from './NewMeeting'
import TeamPromptResponse from './TeamPromptResponse'
import TeamPromptMeetingSettings from './TeamPromptMeetingSettings'
import {getTeamPromptResponsesByMeetingIds} from '../../postgres/queries/getTeamPromptResponsesByMeetingIds'

const TeamPromptMeeting = new GraphQLObjectType<any, GQLContext>({
  name: 'TeamPromptMeeting',
  interfaces: () => [NewMeeting],
  description: 'A team prompt meeting',
  fields: () => ({
    ...newMeetingFields(),
    settings: {
      type: new GraphQLNonNull(TeamPromptMeetingSettings),
      description: 'The settings that govern the team prompt meeting',
      resolve: ({teamId}: {teamId: string}, _args: unknown, {dataLoader}) => {
        return dataLoader.get('meetingSettingsByType').load({teamId, meetingType: 'teamPrompt'})
      }
    },
    responses: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TeamPromptResponse))),
      description: 'The tasks created within the meeting',
      resolve: async ({id: meetingId}: {id: string}, _args: unknown, {}) => {
        const responses = await getTeamPromptResponsesByMeetingIds([meetingId])
        return responses
      }
    },
    viewerMeetingMember: {
      type: TeamPromptMeetingMember,
      description: 'The team prompt meeting member of the viewer',
      resolve: async (_tmp, _args: unknown, {dataLoader}: GQLContext) => {
        const meetingMemberId = 'google-oauth2|108115215397624050772::-Ztk9eu8Vw'
        return dataLoader.get('meetingMembers').load(meetingMemberId)
      }
    }
  })
})

export default TeamPromptMeeting
