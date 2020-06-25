import * as actionTypes from './actionTypes'

import axios from '../../axios-orders'

export const addIngredient = (ingredientType) => {
	return {
		type: actionTypes.ADD_INGREDIENT,
		ingredientType,
	}
}

export const removeIngredient = (ingredientType) => {
	return {
		type: actionTypes.REMOVE_INGREDIENT,
		ingredientType,
	}
}

const setIngredients = (ingredients) => {
	return {
		type: actionTypes.SET_INGREDIENT,
		ingredients,
	}
}

export const initIngredients = () => {
	return async (dispatch) => {
		const response = await axios.get(
			'https://react-burger-app-11993.firebaseio.com/ingredients.json'
		)
		const ingredients = response.data
		return dispatch(setIngredients(ingredients))
	}
}
