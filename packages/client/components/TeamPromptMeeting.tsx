import styled from '@emotion/styled'
import {Editor as EditorState} from '@tiptap/core'
import {JSONContent} from '@tiptap/react'
import graphql from 'babel-plugin-relay/macro'
import React, {useRef} from 'react'
import {useFragment} from 'react-relay'
import {Link} from 'react-router-dom'
import {TeamPromptMeeting_meeting$key} from '~/__generated__/TeamPromptMeeting_meeting.graphql'
import useAtmosphere from '../hooks/useAtmosphere'
import useMutationProps from '../hooks/useMutationProps'
import UpdatePromptResponseMutation from '../mutations/UpdatePromptResponseMutation'
import cardRootStyles from '../styles/helpers/cardRootStyles'
import {MeetingControlBarEnum} from '../types/constEnums'
import Avatar from './Avatar/Avatar'
import Icon from './Icon'
import MasonryCSSGrid from './MasonryCSSGrid'
import PromptResponseEditor from './promptResponse/PromptResponseEditor'

interface Props {
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
  minHeight: '160px'
})

const CardStack = styled('div')({
  ...cardRootStyles,
  minHeight: '100px'
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
  const handleSubmit = (editorState: EditorState) => {
    if (submitting) return
    submitMutation()

    const promptResponseId = meeting.responses.find(({userId}) => userId === viewerId)!.id
    const content = JSON.stringify(editorState.getJSON())

    UpdatePromptResponseMutation(
      atmosphere,
      {promptResponseId: promptResponseId, content},
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
                const content: JSONContent = response.content ? JSON.parse(response.content) : {}
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
                          content={content}
                          handleSubmit={handleSubmit}
                          readOnly={response.userId !== viewerId}
                          placeholder={'Write your response here'}
                        />
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
