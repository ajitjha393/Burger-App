import React, { Component } from 'react'

import Aux from '../../hoc/Aux/Aux'

import Burger from '../../components/Burger/Burger'

import BuildControls from '../../components/Burger/BuildControls/BuildControls'

import Modal from '../../components/UI/Modal/Modal'

import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

import Spinner from '../../components/UI/Spinner/Spinner'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import { connect } from 'react-redux'

import * as burgerBuilderActions from '../../store/actions/index'
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
		this.setState({
			purchasing: true,
		})
	}

	purchaseCancelHandler = () => {
		this.setState({
			purchasing: false,
		})
	}

	purchaseContinueHandler = () => {
		/* No need of using query parmas , state is passed using redux */
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
		ingredients: state.ingredients,
		price: state.totalPrice,
		error: state.error,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ing) =>
			dispatch(burgerBuilderActions.addIngredient(ing)),
		onIngredientRemoved: (ing) =>
			dispatch(burgerBuilderActions.removeIngredient(ing)),
		onInitIngredients: () =>
			dispatch(burgerBuilderActions.initIngredients()),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios))
