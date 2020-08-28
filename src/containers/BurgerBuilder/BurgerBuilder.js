import React, { useState, useEffect } from 'react'

import Aux from '../../hoc/Aux/Aux'

import Burger from '../../components/Burger/Burger'

import BuildControls from '../../components/Burger/BuildControls/BuildControls'

import Modal from '../../components/UI/Modal/Modal'

import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

import Spinner from '../../components/UI/Spinner/Spinner'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import { connect } from 'react-redux'

import * as actions from '../../store/actions/index'
import axios from '../../axios-orders'

// Remeber setState does not work instantaneously

const BurgerBuilder = (props) => {
	const [purchasing, setPurchasing] = useState(false)

	const { onInitIngredients } = props
	useEffect(() => {
		onInitIngredients()
	}, [onInitIngredients])

	const updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients).reduce((sum, curr) => {
			return sum + ingredients[curr]
		}, 0)

		return sum > 0

		// console.log(sum);
	}

	const purchaseHandler = () => {
		if (props.isAuthenticated) {
			setPurchasing(true)
		} else {
			props.onSetAuthRedirectPath('/checkout')
			props.history.push('/auth')
		}
	}

	const purchaseCancelHandler = () => {
		setPurchasing(false)
	}

	const purchaseContinueHandler = () => {
		props.onInitPurchase()
		props.history.push('/checkout')
	}

	const disabledInfo = {
		...props.ingredients,
	}

	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0
	}

	let orderSummary = null

	if (props.ingredients) {
		orderSummary = (
			<OrderSummary
				ingredients={props.ingredients}
				price={props.price}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
			/>
		)
	}

	let burger = props.error ? (
		<p>Ingredients cant be loaded...</p>
	) : (
		<Spinner />
	)

	if (props.ingredients) {
		burger = (
			<Aux>
				<Burger ingredients={props.ingredients} />
				<BuildControls
					ingredientAdded={props.onIngredientAdded}
					ingredientRemoved={props.onIngredientRemoved}
					disabled={disabledInfo}
					purchasable={updatePurchaseState(props.ingredients)}
					isAuth={props.isAuthenticated}
					price={props.price}
					ordered={purchaseHandler}
				/>
			</Aux>
		)
	}
	return (
		<Aux>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Aux>
	)
}

const mapStateToProps = (state) => {
	return {
		ingredients: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.idToken !== null,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ing) => dispatch(actions.addIngredient(ing)),
		onIngredientRemoved: (ing) => dispatch(actions.removeIngredient(ing)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) =>
			dispatch(actions.setAuthRedirectPath(path)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios))
