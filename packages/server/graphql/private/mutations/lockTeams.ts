import getRethink from '../../../database/rethinkDriver'
import updateTeamByTeamId from '../../../postgres/queries/updateTeamByTeamId'
import {MutationResolvers} from '../resolverTypes'

const lockTeams: MutationResolvers['lockTeams'] = async (_source, {message, teamIds, isPaid}) => {
  const r = await getRethink()

  const lockMessageHTML = isPaid ? null : message ?? null

  // RESOLUTION
  const updates = {
    isPaid,
    lockMessageHTML,
    updatedAt: new Date()
  }
  await Promise.all([
    r.table('Team').getAll(r.args(teamIds)).update(updates).run(),
    updateTeamByTeamId(updates, teamIds)
  ])
  return true
}

export default lockTeams
