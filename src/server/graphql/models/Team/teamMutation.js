import {Team, CreateTeamInput, UpdateTeamInput} from './teamSchema';
import r from '../../../database/rethinkDriver';
import {
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';
import {requireSUOrTeamMember, requireSUOrSelf} from '../authorization';

export default {
  createTeam: {
    type: GraphQLBoolean,
    description: 'Create a new team and add the first team member',
    args: {
      newTeam: {
        type: new GraphQLNonNull(CreateTeamInput),
        description: 'The new team object with exactly 1 team member'
      }
    },
    async resolve(source, {newTeam}, {authToken}) {
      // require cachedUserId in the input so an admin can also create a team
      const userId = newTeam.leader.cachedUserId;
      requireSUOrSelf(authToken, userId);
      const {leader, ...team} = newTeam;
      // can't trust the client
      const verifiedLeader = {...leader, isActive: true, isLead: true, isFacilitator: true};
      r.table('TeamMember').insert(verifiedLeader);
      r.table('Team').insert(team);
      r.table('UserProfile').get(userId).update({isNew: false});
      return true;
    }
  },
  updateTeamName: {
    type: Team,
    args: {
      updatedTeam: {
        type: new GraphQLNonNull(UpdateTeamInput),
        description: 'The input object containing the teamId and any modified fields'
      }
    },
    async resolve(source, {updatedTeam}, {authToken}) {
      const {id, name} = updatedTeam;
      requireSUOrTeamMember(authToken, id);
      const teamFromDB = await r.table('Team').get(id).update({
        name
      }, {returnChanges: true});
      // TODO this mutation throws an error, but we don't have a use for it in the app yet
      console.log(teamFromDB);
      // TODO think hard about if we can pluck only the changed values (in this case, name)
      return teamFromDB.changes[0].new_val;
    }
  }
};
