import React, { useState } from 'react'
import Aux from '../Aux/Aux'

import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

import { connect } from 'react-redux'

// import { render } from "@testing-library/react";

const Layout = ({ isAuthenticated, children }) => {
	const [showSideDrawer, setShowSideDrawer] = useState(false)

	return (
		<Aux>
			<Toolbar
				isAuth={isAuthenticated}
				drawerToggleClicked={() => setShowSideDrawer(!showSideDrawer)}
			/>
			<SideDrawer
				isAuth={isAuthenticated}
				open={showSideDrawer}
				closed={() => setShowSideDrawer(false)}
			/>
			<main className={classes.Content}>{children}</main>
		</Aux>
	)
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.idToken !== null,
	}
}

export default connect(mapStateToProps)(Layout)
