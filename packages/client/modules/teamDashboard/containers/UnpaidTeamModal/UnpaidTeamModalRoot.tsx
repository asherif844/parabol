import React, {Suspense} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import UnpaidTeamModal from '../../components/UnpaidTeamModal/UnpaidTeamModal'
import useQueryLoaderNow from '../../../../hooks/useQueryLoaderNow'
import unpaidTeamModalQuery, {
  UnpaidTeamModalQuery
} from '../../../../__generated__/UnpaidTeamModalQuery.graphql'
import {renderLoader} from '../../../../utils/relay/renderLoader'

interface Props extends RouteComponentProps<{}> {
  teamId: string
}

const UnpaidTeamModalRoot = (props: Props) => {
  const {teamId} = props
  const queryRef = useQueryLoaderNow<UnpaidTeamModalQuery>(unpaidTeamModalQuery, {teamId})
  return (
    <Suspense fallback={renderLoader()}>
      {queryRef && <UnpaidTeamModal queryRef={queryRef} />}
    </Suspense>
  )
}

export default withRouter(UnpaidTeamModalRoot)
