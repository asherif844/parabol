import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {Suspense} from 'react'
import {commitLocalUpdate, useFragment} from 'react-relay'
import useAtmosphere from '~/hooks/useAtmosphere'
import useBreakpoint from '~/hooks/useBreakpoint'
import useMeeting from '~/hooks/useMeeting'
import {Breakpoint, DiscussionThreadEnum} from '~/types/constEnums'
import {TeamPromptMeeting_meeting$key} from '~/__generated__/TeamPromptMeeting_meeting.graphql'
import logoMarkPurple from '../styles/theme/images/brand/mark-color.svg'
import LinkButton from './LinkButton'
import MeetingArea from './MeetingArea'
import MeetingContent from './MeetingContent'
import MeetingHeaderAndPhase from './MeetingHeaderAndPhase'
import MeetingStyles from './MeetingStyles'
import PhaseWrapper from './PhaseWrapper'
import TeamPromptDiscussionDrawer from './TeamPrompt/TeamPromptDiscussionDrawer'
import TeamPromptTopBar from './TeamPrompt/TeamPromptTopBar'

interface Props {
  meeting: TeamPromptMeeting_meeting$key
}

graphql`
  fragment TeamPromptMeetingTeamPromptResponseStage on TeamPromptResponseStage {
    discussionId
  }
`

const StyledMeetingHeaderAndPhase = styled(MeetingHeaderAndPhase)<{isOpen: boolean}>(
  ({isOpen}) => ({
    width: isOpen ? `calc(100% - ${DiscussionThreadEnum.WIDTH}px)` : '100%'
  })
)

const TeamPromptMeeting = (props: Props) => {
  const {meeting: meetingRef} = props
  const atmosphere = useAtmosphere()
  const meeting = useFragment(
    graphql`
      fragment TeamPromptMeeting_meeting on TeamPromptMeeting {
        id
        isRightDrawerOpen
        ...useMeeting_meeting
        ...TeamPromptTopBar_meeting
        ...TeamPromptDiscussionDrawer_meeting
        phases {
          stages {
            ... on TeamPromptResponseStage {
              discussionId
            }
          }
        }
      }
    `,
    meetingRef
  )
  const isDesktop = useBreakpoint(Breakpoint.SIDEBAR_LEFT)
  const {safeRoute} = useMeeting(meeting)

  const {isRightDrawerOpen} = meeting

  const selectDiscussion = () => {
    // :TODO: (jmtaber129): Get the discussionId from the response card that was clicked.
    const {phases, id: meetingId} = meeting
    const phase = phases[0]
    const {stages} = phase!
    const stage = stages[0]
    const {discussionId} = stage!

    commitLocalUpdate(atmosphere, (store) => {
      const meetingProxy = store.get(meetingId)
      if (!meetingProxy) return
      meetingProxy.setValue(discussionId, 'localDiscussionId')
      meetingProxy.setValue(true, 'isRightDrawerOpen')
    })
  }

  if (!safeRoute) return null

  return (
    <MeetingStyles>
      <MeetingArea>
        <Suspense fallback={''}>
          <MeetingContent>
            <StyledMeetingHeaderAndPhase
              isOpen={isRightDrawerOpen && isDesktop}
              hideBottomBar={true}
            >
              <TeamPromptTopBar meetingRef={meeting} />
              <PhaseWrapper>
                <LinkButton>
                  <img onClick={selectDiscussion} alt='Parabol' src={logoMarkPurple} />
                </LinkButton>
              </PhaseWrapper>
            </StyledMeetingHeaderAndPhase>
            <TeamPromptDiscussionDrawer meetingRef={meeting} isDesktop={isDesktop} />
          </MeetingContent>
        </Suspense>
      </MeetingArea>
    </MeetingStyles>
  )
}

export default TeamPromptMeeting
