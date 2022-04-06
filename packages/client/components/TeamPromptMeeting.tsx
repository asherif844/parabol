import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {Suspense, useMemo} from 'react'
import {useFragment} from 'react-relay'
import useBreakpoint from '~/hooks/useBreakpoint'
import useMeeting from '~/hooks/useMeeting'
import useTransition, {TransitionStatus} from '~/hooks/useTransition'
import {Elevation} from '~/styles/elevation'
import {BezierCurve, Breakpoint, Card, ElementWidth} from '~/types/constEnums'
import {isNotNull} from '~/utils/predicates'
import {TeamPromptMeeting_meeting$key} from '~/__generated__/TeamPromptMeeting_meeting.graphql'
import ErrorBoundary from './ErrorBoundary'
import MeetingArea from './MeetingArea'
import MeetingContent from './MeetingContent'
import MeetingHeaderAndPhase from './MeetingHeaderAndPhase'
import MeetingStyles from './MeetingStyles'
import TeamPromptTopBar from './TeamPrompt/TeamPromptTopBar'

const ResponsesGridContainer = styled('div')<{maybeTabletPlus: boolean}>(({maybeTabletPlus}) => ({
  height: '100%',
  overflow: 'auto',
  padding: maybeTabletPlus ? '32px 10%' : 16
}))

const ResponsesGrid = styled('div')({
  flex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative'
})

//TODO: replace with real team prompt response comopnent
const ResponseCard = styled('div')<{
  maybeTabletPlus: boolean
  status: TransitionStatus
}>(({maybeTabletPlus, status}) => ({
  background: Card.BACKGROUND_COLOR,
  borderRadius: Card.BORDER_RADIUS,
  boxShadow: Elevation.CARD_SHADOW,
  flexShrink: 0,
  maxWidth: '100%',
  transition: `box-shadow 100ms ${BezierCurve.DECELERATE}, opacity 300ms ${BezierCurve.DECELERATE}`,
  marginBottom: maybeTabletPlus ? 0 : 16,
  opacity: status === TransitionStatus.MOUNTED || status === TransitionStatus.EXITING ? 0 : 1,
  margin: 8,
  height: ElementWidth.MEETING_CARD,
  width: ElementWidth.MEETING_CARD,
  userSelect: 'none'
}))

interface Props {
  meeting: TeamPromptMeeting_meeting$key
}

const TeamPromptMeeting = (props: Props) => {
  const {meeting: meetingRef} = props
  const meeting = useFragment(
    graphql`
      fragment TeamPromptMeeting_meeting on TeamPromptMeeting {
        ...TeamPromptTopBar_meeting
        id
        ...useMeeting_meeting
        phases {
          id
          phaseType
          stages {
            ... on TeamPromptResponseStage {
              id
              teamMember {
                id
                preferredName
                picture
              }
            }
          }
        }
      }
    `,
    meetingRef
  )

  const maybeTabletPlus = useBreakpoint(Breakpoint.FUZZY_TABLET)
  const teamMembers = useMemo(() => {
    return meeting.phases
      .flatMap((phase) => phase.stages)
      .flatMap((stage) => stage.teamMember)
      .map((teamMember) => {
        if (!teamMember) {
          return null
        }

        return {
          ...teamMember,
          key: teamMember.id
        }
      })
      .filter(isNotNull)
  }, [meeting.phases])
  const transitioningTeamMembers = useTransition(teamMembers)
  const {safeRoute} = useMeeting(meeting)
  if (!safeRoute) return null

  return (
    <MeetingStyles>
      <MeetingArea>
        <Suspense fallback={''}>
          <MeetingContent>
            <MeetingHeaderAndPhase hideBottomBar={true}>
              <TeamPromptTopBar meetingRef={meeting} />
              <ErrorBoundary>
                <ResponsesGridContainer maybeTabletPlus={maybeTabletPlus}>
                  <ResponsesGrid>
                    {transitioningTeamMembers.map((teamMember) => {
                      const {child, onTransitionEnd, status} = teamMember
                      const {id} = child

                      return (
                        <ResponseCard
                          key={id}
                          maybeTabletPlus={maybeTabletPlus}
                          onTransitionEnd={onTransitionEnd}
                          status={status}
                        >
                          {child.preferredName}
                        </ResponseCard>
                      )
                    })}
                  </ResponsesGrid>
                </ResponsesGridContainer>
              </ErrorBoundary>
            </MeetingHeaderAndPhase>
          </MeetingContent>
        </Suspense>
      </MeetingArea>
    </MeetingStyles>
  )
}

export default TeamPromptMeeting
