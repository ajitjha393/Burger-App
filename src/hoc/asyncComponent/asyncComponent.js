import React, { Component } from 'react'

const asyncComponent = (importComponent) => {
	return class extends Component {
		state = {
			component: null,
		}

		componentDidMount() {
			importComponent().then((cmp) => {
				this.setState({ component: cmp.default })
			})
		}

		render() {
			const loadedComponent = this.state.component
			return loadedComponent ? <loadedComponent {...this.props} /> : null
		}
	}
}

export default asyncComponent
