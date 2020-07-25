import * as actionTypes from './actionTypes'

import axios from 'axios'

const API_KEY = 'AIzaSyAIqoQ8VwUy-X2shAGYNL0vdArYQii6v9g'

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START,
	}
}

export const authSuccess = (authData) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		authData,
	}
}

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error,
	}
}

export const auth = (email, password) => {
	return async (dispatch) => {
		dispatch(authStart())

		try {
			const res = await axios.post(
				`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
				{
					email,
					password,
					returnSecureToken: true,
				}
			)
			console.log(res)

			dispatch(authSuccess(res.data))
		} catch (err) {
			console.log(err)
			dispatch(authFail(err))
		}
	}
}
