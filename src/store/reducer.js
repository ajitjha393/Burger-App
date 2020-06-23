import * as actionTypes from './actions'

const initialState = {
	ingredients: {
		salad: 0,
		bacon: 0,
		cheese: 0,
		meat: 0,
	},
	totalPrice: 4,
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
			break

		case actionTypes.REMOVE_INGREDIENT:
			newState.ingredients[action.ingredientType] -= 1
			break

		default:
			break
	}
	return newState
}

export default reducer
