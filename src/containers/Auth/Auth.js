import React, { useState, useEffect } from 'react'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'

import Spinner from '../../components/UI/Spinner/Spinner'

import classes from './Auth.module.css'

import { Redirect } from 'react-router-dom'

import { auth, setAuthRedirectPath } from '../../store/actions/index'

import { connect } from 'react-redux'

const Auth = (props) => {
	const [controls, setControls] = useState({
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
	})
	const [isSignUp, setIsSignUp] = useState(true)

	useEffect(() => {
		const {
			buildingBurger,
			authRedirectPath,
			onSetAuthRedirectPath,
		} = props
		if (!buildingBurger && authRedirectPath !== '/') {
			onSetAuthRedirectPath()
		}
	}, [props])

	const checkValidity = (value, rules = {}) => {
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

	const inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...controls,
			[controlName]: {
				...controls[controlName],
				value: event.target.value,
				touched: true,
				valid: checkValidity(
					event.target.value,
					controls[controlName].validation
				),
			},
		}

		setControls(updatedControls)
	}

	const submitHandler = (event) => {
		event.preventDefault()

		const { email, password } = controls

		props.onAuth(email.value, password.value, isSignUp)
	}

	const switchAuthModeHandler = () => {
		setIsSignUp(!isSignUp)
	}
	const formElementsArray = []
	for (let key in controls) {
		formElementsArray.push({
			id: key,
			config: controls[key],
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
				changed={(event) => inputChangedHandler(event, id)}
			/>
		)
	})

	if (props.loading) {
		form = <Spinner />
	}

	let errorMessage = null

	if (props.error) {
		errorMessage = <p>{props.error.message}</p>
	}

	let authRedirect = null
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={props.authRedirectPath} />
	}

	return (
		<div className={classes.Auth}>
			{authRedirect}
			{errorMessage}
			<form onSubmit={submitHandler}>
				{form}
				<Button btnType="Success">SUBMIT</Button>
			</form>
			<Button clicked={switchAuthModeHandler} btnType="Danger">
				SWITCH TO {isSignUp ? 'SIGNIN' : 'SIGNUP'}
			</Button>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.idToken,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.burgerBuilder.authRedirectPath,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignUp) =>
			dispatch(auth(email, password, isSignUp)),

		onSetAuthRedirectPath: () => dispatch(setAuthRedirectPath('/')),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
