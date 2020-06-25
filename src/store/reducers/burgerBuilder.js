import * as actionTypes from '../actions/actionTypes'

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7,
}

const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false,
}

const reducer = (state = initialState, action) => {
	const newState = {
		...state,
		ingredients: {
			...state.ingredients,
		},
	}
	switch (action.type) {
		case actionTypes.ADD_INGREDIENT:
			newState.ingredients[action.ingredientType] += 1
			newState.totalPrice += INGREDIENT_PRICES[action.ingredientType]
			break

		case actionTypes.REMOVE_INGREDIENT:
			newState.ingredients[action.ingredientType] -= 1
			newState.totalPrice -= INGREDIENT_PRICES[action.ingredientType]
			break

		default:
			break
	}
	return newState
}

export default reducer
