import {
	AUTH_START,
	AUTH_SUCCESS,
	AUTH_FAIL,
	AUTH_LOGOUT,
} from '../actions/actionTypes'

const initialState = {
	userId: null,
	idToken: null,
	error: null,
	loading: false,
}

const reducer = (state = initialState, action) => {
	const newState = { ...state }
	switch (action.type) {
		case AUTH_START:
			newState.loading = true
			newState.error = null
			break

		case AUTH_SUCCESS:
			newState.userId = action.userId
			newState.idToken = action.idToken
			newState.error = null
			newState.loading = false
			break

		case AUTH_FAIL:
			newState.error = action.error
			newState.loading = false
			break

		case AUTH_LOGOUT:
			newState.userId = null
			newState.token = null

		default:
			break
	}
	return newState
}

export default reducer
