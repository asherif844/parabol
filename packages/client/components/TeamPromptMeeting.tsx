import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {useRef} from 'react'
import {Link} from 'react-router-dom'
import PromptResponseEditor from './promptResponse/PromptResponseEditor'
import {
  TeamPromptMeeting_meeting$key
} from '~/__generated__/TeamPromptMeeting_meeting.graphql'
import useMutationProps from '../hooks/useMutationProps'
import UpdatePromptResponseMutation from '../mutations/UpdatePromptResponseMutation'
import useAtmosphere from '../hooks/useAtmosphere'
import {useFragment} from 'react-relay'
import {JSONContent} from '@tiptap/react'
import cardRootStyles from '../styles/helpers/cardRootStyles'
import Icon from './Icon'
import Avatar from './Avatar/Avatar'
import MasonryCSSGrid from './MasonryCSSGrid'
import {MeetingControlBarEnum} from '../types/constEnums'

interface Props  {
  meeting: TeamPromptMeeting_meeting$key
}

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  height: '100%'
})

const GridWrapper = styled('div')<{isExpanded: boolean}>(({isExpanded}) => ({
  height: isExpanded ? '100%' : `calc(100% - ${MeetingControlBarEnum.HEIGHT + 16}px)`,
  overflow: 'auto',
  padding: '8px 16px 0',
  marginBottom: 16
}))

const ResponseCard = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  position: 'absolute',
  width: '296px',
  minHeight: '160px',
})

const CardStack = styled('div')({
  ...cardRootStyles,
  minHeight: '100px',
})

const MemberHeader = styled('div')({
  position: 'static',
  width: '296px',
  height: '48px',
  left: '0px',
  top: '0px',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  margin: '12px 0px'
})

const StackHeader = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  position: 'absolute',
  width: '296px',
  height: '48px',
  left: '0px',
  top: '0px'
})

const MemberHeaderMeta = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  position: 'static',
  width: '121px',
  height: '48px',
  left: '0px',
  top: '0px',
  flex: 'none',
  order: 0,
  flexGrow: 0,
  margin: '0px 12px'
})

const BackIcon = styled(Icon)({
  color: 'inherit'
})

const Name = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  fontFamily: 'IBM Plex Sans',
  fontStyle: 'normal',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '24px',
  padding: '0px',
  position: 'static',
  width: '61px',
  height: '24px',
  left: '60px',
  top: '12px',
  flex: 'none',
  order: 1,
  flexGrow: 0,
  margin: '0px 12px'
})

const TeamPromptMeeting = (props: Props) => {
  const {meeting: meetingRef} = props
  const meeting = useFragment(
    graphql`
      fragment TeamPromptMeeting_meeting on TeamPromptMeeting {
        responses {
          id
          content
          userId
          user {
            picture
            preferredName
          }
        }
      }
    `,
    meetingRef
  )
  const atmosphere = useAtmosphere()
  const {viewerId} = atmosphere
  const {onError, onCompleted, submitMutation, submitting} = useMutationProps()
  const handleSubmit = (value: string) => {
    if (submitting) return
    submitMutation()

    const promptResponseId = meeting.responses.find(({userId}) => userId === viewerId)!.id

    UpdatePromptResponseMutation(
      atmosphere,
      {promptResponseId: promptResponseId, content: value},
      {onError, onCompleted}
    )
  }
  const ref = useRef<HTMLDivElement>(null)


  return (
    <>
      <Link title='My Dashboard' to='/meetings'>
        <BackIcon>arrow_back</BackIcon>
      </Link>
      <Root>
        <GridWrapper ref={ref} isExpanded={true}>
          <MasonryCSSGrid colWidth={256} gap={12}>
          {(setItemRef) => {
            return meeting.responses.map((response) => {
              return (
                <div key={response.id} ref={setItemRef(response.id)}>
                  <ResponseCard>
                    <MemberHeader>
                      <StackHeader>
                        <MemberHeaderMeta>
                          <Avatar size={48} picture={response.user!.picture} />
                          <Name>{response.user!.preferredName}</Name>
                        </MemberHeaderMeta>
                      </StackHeader>
                    </MemberHeader>
                    <CardStack>
                      <PromptResponseEditor
                        autoFocus={true}
                        initialDoc={JSON.parse(response.content) as JSONContent}
                        handleSubmit={handleSubmit}
                        readOnly={response.userId !== viewerId}
                        placeholder={'Write your response here'} />
                    </CardStack>
                  </ResponseCard>
                </div>
              )
            })
          }}
          </MasonryCSSGrid>
        </GridWrapper>



      </Root>
    </>
  )
}

export default TeamPromptMeeting
