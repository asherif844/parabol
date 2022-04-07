import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {usePreloadedQuery, PreloadedQuery} from 'react-relay'
import useAtmosphere from '~/hooks/useAtmosphere'
import useMutationProps from '~/hooks/useMutationProps'
import EndTeamPromptMutation from '~/mutations/EndTeamPromptMutation'
import {MenuProps} from '../hooks/useMenu'
import {PALETTE} from '../styles/paletteV3'
import {ICON_SIZE} from '../styles/typographyV2'
import getMassInvitationUrl from '../utils/getMassInvitationUrl'
import Icon from './Icon'
import Menu from './Menu'
import MenuItem from './MenuItem'
import {MenuItemLabelStyle} from './MenuItemLabel'
import {MeetingCardOptionsMenuQuery} from '../__generated__/MeetingCardOptionsMenuQuery.graphql'

interface Props {
  menuProps: MenuProps
  popTooltip: () => void
  queryRef: PreloadedQuery<MeetingCardOptionsMenuQuery>
}

const StyledIcon = styled(Icon)({
  color: PALETTE.SLATE_600,
  fontSize: ICON_SIZE.MD24,
  marginRight: 8
})

const OptionMenuItem = styled('div')({
  ...MenuItemLabelStyle,
  width: '200px'
})

const EndMeetingMutationLookup = {
  teamPrompt: EndTeamPromptMutation
}

const query = graphql`
  query MeetingCardOptionsMenuQuery($teamId: ID!, $meetingId: ID!) {
    viewer {
      team(teamId: $teamId) {
        massInvitation(meetingId: $meetingId) {
          id
        }
      }
      meeting(meetingId: $meetingId) {
        id
        meetingType
      }
    }
  }
`

const MeetingCardOptionsMenu = (props: Props) => {
  const {menuProps, popTooltip, queryRef} = props
  const data = usePreloadedQuery<MeetingCardOptionsMenuQuery>(query, queryRef, {
    UNSTABLE_renderPolicy: 'full'
  })
  const {viewer} = data
  const {team, meeting} = viewer
  const {massInvitation} = team!
  const {id: token} = massInvitation
  const {id: meetingId, meetingType} = meeting!
  const canEndMeeting = meetingType === 'teamPrompt'
  const atmosphere = useAtmosphere()
  const {onCompleted, onError} = useMutationProps()

  const {closePortal} = menuProps
  return (
    <Menu ariaLabel={'Edit the meeting'} {...menuProps}>
      <MenuItem
        key='copy'
        label={
          <OptionMenuItem>
            <StyledIcon>person_add</StyledIcon>
            <span>{'Copy invite link'}</span>
          </OptionMenuItem>
        }
        onClick={async () => {
          popTooltip()
          closePortal()
          const copyUrl = getMassInvitationUrl(token)
          await navigator.clipboard.writeText(copyUrl)
        }}
      />
      {canEndMeeting && (
        <MenuItem
          key='close'
          label={
            <OptionMenuItem>
              <StyledIcon>close</StyledIcon>
              <span>{'End the meeting'}</span>
            </OptionMenuItem>
          }
          onClick={() => {
            popTooltip()
            closePortal()
            EndMeetingMutationLookup[meetingType]?.(atmosphere, {meetingId}, {onError, onCompleted})
          }}
        />
      )}
    </Menu>
  )
}

export default MeetingCardOptionsMenu
