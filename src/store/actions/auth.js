import * as actionTypes from './actionTypes'

import axios from 'axios'

const API_KEY = 'AIzaSyAIqoQ8VwUy-X2shAGYNL0vdArYQii6v9g'

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START,
	}
}

export const authSuccess = (idToken, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken,
		userId,
	}
}

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error,
	}
}

export const auth = (email, password, isSignUp) => {
	return async (dispatch) => {
		dispatch(authStart())

		let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`

		if (!isSignUp) {
			url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
		}

		try {
			const res = await axios.post(url, {
				email,
				password,
				returnSecureToken: true,
			})
			console.log(res)

			dispatch(authSuccess(res.data.idToken, res.data.localId))
		} catch (err) {
			console.log(err)
			dispatch(authFail(err))
		}
	}
}
