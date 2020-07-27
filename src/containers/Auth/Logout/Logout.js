import React, { Component } from 'react'

import { logout } from '../../../store/actions'

import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

class Logout extends Component {
	componentDidMount() {
		this.props.onLogout()
	}

	render() {
		return <Redirect to="/" />
	}
}

const mapDisptachToProps = (dispatch) => {
	return {
		onLogout: () => dispatch(logout()),
	}
}

export default connect(null, mapDisptachToProps)(Logout)
