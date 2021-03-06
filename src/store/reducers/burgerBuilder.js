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
	building: false,
	authRedirectPath: '/',
}

const reducer = (state = initialState, action) => {
	let newState
	if (state.ingredients) {
		newState = {
			...state,
			ingredients: {
				...state.ingredients,
			},
		}
	} else {
		newState = { ...state }
	}
	switch (action.type) {
		case actionTypes.ADD_INGREDIENT:
			newState.ingredients[action.ingredientType] += 1
			newState.totalPrice += INGREDIENT_PRICES[action.ingredientType]
			newState.building = true
			break

		case actionTypes.REMOVE_INGREDIENT:
			newState.ingredients[action.ingredientType] -= 1
			newState.totalPrice -= INGREDIENT_PRICES[action.ingredientType]
			newState.building = true
			break

		case actionTypes.SET_INGREDIENT:
			newState.ingredients = {
				salad: action.ingredients.salad,
				bacon: action.ingredients.bacon,
				cheese: action.ingredients.cheese,
				meat: action.ingredients.meat,
			}
			newState.error = false
			newState.totalPrice = 4
			newState.building = false
			break

		case actionTypes.FETCH_INGREDIENTS_FAILED:
			newState.error = true
			break

		case actionTypes.SET_AUTH_REDIRECT_PATH:
			newState.authRedirectPath = action.path
			break

		default:
			break
	}
	return newState
}

export default reducer
