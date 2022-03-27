import graphql from 'babel-plugin-relay/macro'
import React, {Suspense} from 'react'
import {useFragment} from 'react-relay'
import MockScopingList from '~/modules/meeting/components/MockScopingList'
import useQueryLoaderNow from '../hooks/useQueryLoaderNow'
import gitlabScopingSearchResultsQuery, {
  GitLabScopingSearchResultsQuery
} from '../__generated__/GitLabScopingSearchResultsQuery.graphql'
import {GitLabScopingSearchResultsRoot_meeting$key} from '../__generated__/GitLabScopingSearchResultsRoot_meeting.graphql'
import GitLabScopingSearchResults from './GitLabScopingSearchResults'

interface Props {
  meetingRef: GitLabScopingSearchResultsRoot_meeting$key
}

const GitLabScopingSearchResultsRoot = (props: Props) => {
  const {meetingRef} = props
  const meeting = useFragment(
    graphql`
      fragment GitLabScopingSearchResultsRoot_meeting on PokerMeeting {
        ...GitLabScopingSearchResults_meeting
        gitlabSearchQuery
        teamId
      }
    `,
    meetingRef
  )
  const {teamId, gitlabSearchQuery} = meeting
  const normalizedQueryString = gitlabSearchQuery?.trim() || ''
  const queryRef = useQueryLoaderNow<GitLabScopingSearchResultsQuery>(
    gitlabScopingSearchResultsQuery,
    {teamId, queryString: normalizedQueryString}
  )
  return (
    <Suspense fallback={<MockScopingList />}>
      {queryRef && <GitLabScopingSearchResults queryRef={queryRef} meetingRef={meeting} />}
    </Suspense>
  )
}

export default GitLabScopingSearchResultsRoot
