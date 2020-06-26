import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderId: id,
		orderData: orderData,
	}
}

export const purchaseBurgerFail = (err) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAIL,
		error: err,
	}
}

export const purchaseBurgerStart = (orderData) => {
	return async (dispatch) => {
		try {
			const response = await axios.post('/orders.json', orderData)
			console.log(response)
			dispatch(purchaseBurgerSuccess(response.data, orderData))
		} catch (error) {
			dispatch(purchaseBurgerFail(error))
		}
	}
}
