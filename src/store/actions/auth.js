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

export const logout = () => {
	localStorage.removeItem('token')
	localStorage.removeItem('expirationDate')
	localStorage.removeItem('userId')
	return {
		type: actionTypes.AUTH_LOGOUT,
	}
}

const checkAutoTimeout = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logout())
		}, expirationTime * 1000)
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

			const expirationDate = new Date(
				new Date().getTime() + res.data.expiresIn * 1000
			)

			localStorage.setItem('token', res.data.idToken)
			localStorage.setItem('expirationDate', expirationDate)
			localStorage.setItem('userId', res.data.localId)

			dispatch(authSuccess(res.data.idToken, res.data.localId))
			dispatch(checkAutoTimeout(res.data.expiresIn))
		} catch (err) {
			console.log(err)
			dispatch(authFail(err.response.data.error))
		}
	}
}

export const authCheckState = () => {
	return (dispatch) => {
		const token = localStorage.getItem('token')
		// console.log(token)
		if (!token) {
			dispatch(logout())
		} else {
			const expirationDate = new Date(
				localStorage.getItem('expirationDate')
			)

			if (expirationDate > new Date()) {
				console.log('Hiiii')
				const userId = localStorage.getItem('userId')
				dispatch(authSuccess(token, userId))
				// This sets up the timer to logout if we are still using the app

				const remainingExpirationTime =
					(expirationDate.getTime() - new Date().getTime()) / 1000

				// Will have to pass the time after which the storage must be clear
				console.log(remainingExpirationTime)
				dispatch(checkAutoTimeout(remainingExpirationTime))
			} else {
				console.log('logging out')
				dispatch(logout())
			}
		}
	}
}

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path,
	}
}
