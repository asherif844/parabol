import graphql from 'babel-plugin-relay/macro'
import {commitMutation} from 'react-relay'
import {StandardMutation} from '../types/relayMutations'
import {UpdatePromptResponseMutation as TUpdatePromptResponseMutation} from '../__generated__/UpdatePromptResponseMutation.graphql'

graphql`
  fragment UpdatePromptResponseMutation_meeting on UpdatePromptResponseSuccess {
    promptResponse {
      content
    }
  }
`

const mutation = graphql`
  mutation UpdatePromptResponseMutation($promptResponseId: ID!, $content: String!) {
    updatePromptResponse(promptResponseId: $promptResponseId, content: $content) {
      ... on ErrorPayload {
        error {
          message
        }
      }
      ...UpdatePromptResponseMutation_meeting @relay(mask: false)
    }
  }
`

const UpdatePromptResponseMutation: StandardMutation<TUpdatePromptResponseMutation> = (
  atmosphere,
  variables,
  {onError, onCompleted}
) => {
  return commitMutation<TUpdatePromptResponseMutation>(atmosphere, {
    mutation,
    variables,
    optimisticUpdater: (store) => {
      const {promptResponseId, content} = variables
      const promptResponseProxy = store.get(promptResponseId)!
      promptResponseProxy.setValue(content, 'content')
    },
    onCompleted,
    onError
  })
}

export default UpdatePromptResponseMutation
