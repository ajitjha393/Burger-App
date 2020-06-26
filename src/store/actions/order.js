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

export const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START,
	}
}

export const purchaseBurger = (orderData) => {
	return async (dispatch) => {
		dispatch(purchaseBurgerStart())
		try {
			const response = await axios.post('/orders.json', orderData)
			console.log(response)
			dispatch(purchaseBurgerSuccess(response.data.name, orderData))
		} catch (error) {
			dispatch(purchaseBurgerFail(error))
		}
	}
}

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT,
	}
}

export const fecthOrdersStart = () => {
	return {
		type: actionTypes.FETCH_ORDER_START,
	}
}

export const fetchOrdersSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDER_SUCCESS,
		orders,
	}
}

export const fetchOrdersFail = (error) => {
	return {
		type: actionTypes.FETCH_ORDER_FAIL,
		error,
	}
}

export const fetchOrders = () => {
	return async (dispatch) => {
		dispatch(fecthOrdersStart())
		try {
			const res = await axios.get('/orders.json')

			const fetchedOrdersList = []
			for (let key in res.data) {
				fetchedOrdersList.push({
					...res.data[key],
					id: key,
				})
			}
			dispatch(fetchOrdersSuccess(fetchedOrdersList))
		} catch (err) {
			dispatch(fetchOrdersFail(err))
		}
	}
}
