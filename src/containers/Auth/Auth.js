import React, { Component } from 'react'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'

import Spinner from '../../components/UI/Spinner/Spinner'

import classes from './Auth.module.css'

import { auth } from '../../store/actions/index'

import { connect } from 'react-redux'

class Auth extends Component {
	state = {
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Your Email',
				},
				value: '',
				validation: {
					required: true,
					isEmail: true,
				},
				valid: false,
				touched: false,
			},

			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Enter Password',
				},
				value: '',
				validation: {
					required: true,
					minLength: 6,
				},
				valid: false,
				touched: false,
			},
		},

		isSignUp: true,
	}

	checkValidity = (value, rules = {}) => {
		let isValid = true

		if (rules.required) {
			isValid = value.trim() !== '' && isValid
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid
		}

		if (rules.isEmail) {
			const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
			isValid = pattern.test(value) && isValid
		}

		if (rules.isNumeric) {
			const pattern = /^\d+$/
			isValid = pattern.test(value) && isValid
		}

		return isValid
	}

	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				touched: true,
				valid: this.checkValidity(
					event.target.value,
					this.state.controls[controlName].validation
				),
			},
		}

		this.setState({ controls: updatedControls })
	}

	submitHandler = (event) => {
		event.preventDefault()

		const { email, password } = this.state.controls

		this.props.onAuth(email.value, password.value, this.state.isSignUp)
	}

	switchAuthModeHandler = () => {
		this.setState((prevState) => {
			return {
				isSignUp: !prevState.isSignUp,
			}
		})
	}
	render() {
		const formElementsArray = []
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key],
			})
		}

		let form = formElementsArray.map(({ id, config }) => {
			return (
				<Input
					key={id}
					elementType={config.elementType}
					elementConfig={config.elementConfig}
					value={config.value}
					invalid={!config.valid}
					shouldValidate={config.validation ? true : false}
					touched={config.touched}
					changed={(event) => this.inputChangedHandler(event, id)}
				/>
			)
		})

		if (this.props.loading) {
			form = <Spinner />
		}

		return (
			<div className={classes.Auth}>
				<form onSubmit={this.submitHandler}>
					{form}
					<Button btnType="Success">SUBMIT</Button>
				</form>
				<Button clicked={this.switchAuthModeHandler} btnType="Danger">
					SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}
				</Button>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignUp) =>
			dispatch(auth(email, password, isSignUp)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
