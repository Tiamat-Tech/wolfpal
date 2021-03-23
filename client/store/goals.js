export const state = () => ({
  weekly: [],
  messages: {
    success: null,
    error: null,
    errors: {
      title: null,
    },
  },
})

export const actions = {
  async FETCH_WEEKLY_GOALS({ commit }) {
    try {
      const res = await this.$axios.$get('/api/goals/weekly')
      commit('SET_WEEKLY_GOALS', res.goals)
    } catch (e) {
      commit('SET_WEEKLY_GOALS', [])
      commit('SET_MESSAGE_SUCCESS', null)
      commit('SET_MESSAGE_ERROR', 'Oops.. Something Went Wrong..')
    }
  },
  async MODIFY_GOAL_IS_COMPLETE({ state, commit }, index) {
    try {
      await this.$axios.$put(
        `/api/goals/weekly/${state.weekly[index]._id}/complete`
      )

      commit('SET_GOAL_IS_COMPLETE', {
        index,
        isCompleted: true,
      })
      commit('SET_MESSAGE_ERROR', null)
      commit('SET_MESSAGE_SUCCESS', 'Goal has been marked as completed')
    } catch (e) {
      commit('SET_MESSAGE_SUCCESS', null)
      switch (e.response.data.code) {
        case 'NON_EXISTENT':
          commit('SET_MESSAGE_ERROR', 'Goal is not found.')
          break
        default:
          commit('SET_MESSAGE_ERROR', 'Oops.. Something Went Wrong..')
          break
      }
    }
  },
  async MODIFY_GOAL_IS_NOT_COMPLETE({ state, commit }, index) {
    try {
      await this.$axios.$put(
        `/api/goals/weekly/${state.weekly[index]._id}/not-complete`
      )

      commit('SET_GOAL_IS_COMPLETE', {
        index,
        isCompleted: false,
      })
      commit('SET_MESSAGE_ERROR', null)
      commit('SET_MESSAGE_SUCCESS', 'Goal has been marked as not completed')
    } catch (e) {
      commit('SET_MESSAGE_SUCCESS', null)
      switch (e.response.data.code) {
        case 'NON_EXISTENT':
          commit('SET_MESSAGE_ERROR', 'Goal is not found.')
          break
        default:
          commit('SET_MESSAGE_ERROR', 'Oops.. Something Went Wrong..')
          break
      }
    }
  },
  async REMOVE_WEEKLY_GOAL({ state, commit }, index) {
    try {
      const res = await this.$axios.$delete(
        `/api/goals/weekly/${state.weekly[index]._id}`
      )
      commit('SET_MESSAGE_ERROR', null)
      switch (res.code) {
        case 'REMOVED':
          commit('SET_MESSAGE_SUCCESS', 'Goal has been removed.')
          break
        default:
      }
      commit('DELETE_WEEKLY_GOAL', index)
    } catch (e) {
      commit('SET_MESSAGE_SUCCESS', null)
      switch (e.response.data.code) {
        case 'NON_EXISTENT':
          commit('SET_MESSAGE_ERROR', 'Goal is might be already deleted.')
          break
        default:
          commit('SET_MESSAGE_ERROR', 'Oops.. Something Went Wrong..')
      }
    }
  },
  async ADD_WEEKLY_GOAL({ commit }, goal) {
    try {
      const res = await this.$axios.$post('/api/goals/weekly', goal)
      commit('SET_MESSAGE_ERROR', null)
      commit('SET_MESSAGE_SUCCESS', 'Goal has been added.')
      commit('PUSH_WEEKLY_GOAL', res.goal)
    } catch (e) {
      commit('SET_MESSAGE_SUCCESS', null)
      if (e.response.data.codes) {
        if (e.response.data.codes.title)
          switch (e.response.data.codes.title) {
            case 'REQUIRED':
              commit('SET_MESSAGE_ERRORS_TITLE', 'Goal is required.')
              break
            default:
          }
      } else {
        commit('SET_MESSAGE_ERROR', 'Oops.. Something Went Wrong..')
      }
    }
  },
}

export const mutations = {
  SET_WEEKLY_GOALS(state, goals) {
    return (state.weekly = goals)
  },
  SET_GOAL_IS_COMPLETE(state, { index, isCompleted }) {
    return (state.weekly[index].isCompleted = isCompleted)
  },

  DELETE_WEEKLY_GOAL: (state, index) => {
    return state.weekly.splice(index, 1)
  },
  PUSH_WEEKLY_GOAL: (state, goal) => {
    return state.weekly.push(goal)
  },
  SET_MESSAGE_SUCCESS: (state, success) => {
    return (state.messages.success = success)
  },
  SET_MESSAGE_ERROR: (state, error) => {
    return (state.messages.error = error)
  },
  SET_MESSAGE_ERRORS_TITLE: (state, message) => {
    return (state.messages.errors.title = message)
  },
}

export const getters = {
  WEEKLY_GOALS: (state) => {
    return state.weeky
  },
  MESSAGE_SUCCESS: (state) => {
    return state.messages.success
  },
  MESSAGE_ERROR: (state) => {
    return state.messages.error
  },
  MESSAGE_ERRORS_TITLE: (state) => {
    return state.messages.errors.title
  },
}
