import React, { Component } from 'react'

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

class BurgerBuilder extends Component {
	state = {
		purchasing: false,
	}

	componentDidMount() {
		// Will add this part again after learning async state handlng using redux
		this.props.onInitIngredients()
	}

	updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients).reduce((sum, curr) => {
			return sum + ingredients[curr]
		}, 0)

		return sum > 0

		// console.log(sum);
	}

	purchaseHandler = () => {
		if (this.props.isAuthenticated) {
			this.setState({
				purchasing: true,
			})
		} else {
			this.props.history.push('/auth')
		}
	}

	purchaseCancelHandler = () => {
		this.setState({
			purchasing: false,
		})
	}

	purchaseContinueHandler = () => {
		this.props.onInitPurchase()
		this.props.history.push('/checkout')
	}

	render() {
		const disabledInfo = {
			...this.props.ingredients,
		}

		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}

		let orderSummary = null

		if (this.props.ingredients) {
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ingredients}
					price={this.props.price}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinued={this.purchaseContinueHandler}
				/>
			)
		}

		let burger = this.props.error ? (
			<p>Ingredients cant be loaded...</p>
		) : (
			<Spinner />
		)

		if (this.props.ingredients) {
			burger = (
				<Aux>
					<Burger ingredients={this.props.ingredients} />
					<BuildControls
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled={disabledInfo}
						purchasable={this.updatePurchaseState(
							this.props.ingredients
						)}
						isAuth={this.props.isAuthenticated}
						price={this.props.price}
						ordered={this.purchaseHandler}
					/>
				</Aux>
			)
		}
		return (
			<Aux>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}
				>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		)
	}
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
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios))
