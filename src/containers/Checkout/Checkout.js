import React, { Component } from 'react'

import { Route } from 'react-router-dom'

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'

import ContactData from './ContactData/ContactData'

class Checkout extends Component {
	// Because i needed Component will mount

	checkoutCancelledHandler = () => {
		this.props.history.goBack()
	}

	checkoutContinuedHandler = () => {
		this.props.history.replace('/checkout/contact-data')
	}

	render() {
		return (
			<div>
				<CheckoutSummary
					ingredients={this.state.ingredients}
					checkoutCancelled={this.checkoutCancelledHandler}
					checkoutContinued={this.checkoutContinuedHandler}
				/>
				{/* 
        <Route
          path={this.props.match.path + "/contact-data"}
          component={ContactData}
        /> */}

				{/* Hack to pass data to the compnent */}

				<Route
					path={this.props.match.path + '/contact-data'}
					render={(props) => (
						<ContactData
							ingredients={this.state.ingredients}
							price={this.state.totalPrice}
							{...props}
						/>
					)}
				/>
			</div>
		)
	}
}

export default Checkout
