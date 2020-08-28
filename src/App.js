import React, { useEffect } from 'react'

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'

import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'

// import Orders from './containers/Orders/Orders'

// import Checkout from './containers/Checkout/Checkout'

// import Auth from './containers/Auth/Auth'

import Logout from './containers/Auth/Logout/Logout'

import { connect } from 'react-redux'

import asyncComponent from './hoc/asyncComponent/asyncComponent'

import * as actions from './store/actions/index'

const asyncCheckout = asyncComponent(() => {
	return import('./containers/Checkout/Checkout')
})

const asyncOrders = asyncComponent(() => {
	return import('./containers/Orders/Orders')
})

const asyncAuth = asyncComponent(() => {
	return import('./containers/Auth/Auth')
})

const App = (props) => {
	useEffect(() => {
		props.onTryAutoSignup()
	}, [])

	let routes = (
		<Switch>
			<Route path="/auth" component={asyncAuth} />
			<Route path="/" exact component={BurgerBuilder} />
			<Redirect to="/" />
		</Switch>
	)

	if (this.props.isAuthenticated) {
		routes = (
			<Switch>
				<Route path="/checkout" component={asyncCheckout} />
				<Route path="/orders" component={asyncOrders} />
				<Route path="/logout" component={Logout} />
				<Route path="/auth" component={asyncAuth} />
				<Route path="/" exact component={BurgerBuilder} />
				<Redirect to="/" />
			</Switch>
		)
	}

	return (
		<div>
			<Layout>{routes}</Layout>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.idToken !== null,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState()),
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
