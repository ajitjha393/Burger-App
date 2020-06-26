import React, { Component } from 'react'

import { Route, Redirect } from 'react-router-dom'

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

import ContactData from './ContactData/ContactData'

import { connect } from 'react-redux'

class Checkout extends Component {
	// Because i needed Component will mount

	checkoutCancelledHandler = () => {
		this.props.history.goBack()
	}

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data')
	}

	render() {
		let summary = <Redirect to="/" />

		if (this.props.ingredients) {
			summary = (
				<CheckoutSummary
					ingredients={this.props.ingredients}
					checkoutCancelled={this.checkoutCancelledHandler}
					checkoutContinued={this.checkoutContinuedHandler}
				/>
			)
		}

		return (
			<div>
				{summary}

				<Route
					path={this.props.match.path + '/contact-data'}
					component={ContactData}
				/>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		ingredients: state.burgerBuilder.ingredients,
	}
}

export default connect(mapStateToProps)(Checkout)
