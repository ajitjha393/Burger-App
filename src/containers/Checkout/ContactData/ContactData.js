import React, { useState } from 'react'
import Button from '../../../components/UI/Button/Button'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'

import Input from '../../../components/UI/Input/Input'

import classes from './ContactData.module.css'

import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'

import { connect } from 'react-redux'

import { purchaseBurger } from '../../../store/actions/index'

const ContactData = (props) => {
	const [orderForm, setOrderForm] = useState({
		name: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Your name',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},

		street: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Street',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},

		zipCode: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'ZIP Code',
			},
			value: '',
			validation: {
				required: true,
				minLength: 5,
				maxLength: 5,
			},
			valid: false,
			touched: false,
		},

		country: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Country',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},

		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'Your E-mail',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},

		deliveryMethod: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'fastest', displayValue: 'Fastest' },
					{ value: 'cheapest', displayValue: 'Cheapest' },
				],
			},
			value: 'fastest',
			valid: true,
		},
	})

	const [formIsValid, setFormIsValid] = useState(false)

	const orderHandler = (event) => {
		event.preventDefault()

		const formData = {}

		for (let formElementIdentifier in orderForm) {
			formData[formElementIdentifier] =
				orderForm[formElementIdentifier].value
		}

		const order = {
			ingredients: props.ingredients,
			price: props.price,
			orderData: formData,
			userId: props.userId,
		}

		props.onOrderBurger(order, props.token)
	}

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

		return isValid
	}

	const inputChangedHandler = (event, inputIdentifier) => {
		// Now change state immutably

		// Remember that nested objects are not copied deeply
		const updatedOrderForm = {
			...orderForm,
		}

		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier],
		}

		updatedFormElement.value = event.target.value
		updatedFormElement.valid = checkValidity(
			updatedFormElement.value,
			updatedFormElement.validation
		)
		updatedFormElement.touched = true

		updatedOrderForm[inputIdentifier] = updatedFormElement

		// console.log(updatedFormElement);

		let formIsValid = true

		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
		}

		setOrderForm(updatedOrderForm)
		setFormIsValid(formIsValid)
	}

	const formElementsArray = []
	for (let key in orderForm) {
		formElementsArray.push({
			id: key,
			config: orderForm[key],
		})
	}

	let form = (
		<form onSubmit={orderHandler}>
			{formElementsArray.map((formElement) => (
				<Input
					changed={(event) =>
						inputChangedHandler(event, formElement.id)
					}
					key={formElement.id}
					elementType={formElement.config.elementType}
					elementConfig={formElement.config.elementConfig}
					value={formElement.config.value}
					invalid={!formElement.config.valid}
					shouldValidate={
						formElement.config.validation ? true : false
					}
					touched={formElement.config.touched}
				/>
			))}

			<Button btnType="Success" disabled={!formIsValid}>
				ORDER
			</Button>
		</form>
	)
	if (props.loading) {
		form = <Spinner />
	}
	return (
		<div className={classes.ContactData}>
			<h4> Enter your Contact Data</h4>
			{form}
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		ingredients: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.idToken,
		userId: state.auth.userId,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(purchaseBurger(orderData, token)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axios))
