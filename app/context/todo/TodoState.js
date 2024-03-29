import React, { useReducer, useContext } from 'react'
import { Alert } from 'react-native'
import { TodoContext } from './todoContext'
import { todoReducer } from './todoReducer'
import {
	ADD_TODO,
	REMOVE_TODO,
	UPD_TODO,
	SHOW_ERROR,
	HIDE_LOADER,
	SHOW_LOADER,
	CLEAR_ERROR,
	FETCH_TODOS,
} from '../types'
import { ScreenContext } from '../screen/screenContext'
import { Http } from '../../http'

export const TodoState = ({ children }) => {
	const initialState = {
		todos: [],
		loading: false,
		error: null
	}
	const { change } = useContext(ScreenContext)
	const [state, dispatch] = useReducer(todoReducer, initialState)

	const addTodo = async title => {
		// Http.get('https://react-native-todo-95be5-default-rtdb.europe-west1.firebasedatabase.app/todos.json')
		// const response = await fetch('https://react-native-todo-95be5-default-rtdb.europe-west1.firebasedatabase.app/todos.json', {
		// 	method: 'POST',
		// 	headers: { 'Content-type': 'application/json' },
		// 	body: JSON.stringify({ title })
		// })
		// const data = await response.json();//это тоже Promise
		const data = await Http.post('https://react-native-todo-95be5-default-rtdb.europe-west1.firebasedatabase.app/todos.json',
			{ title }
		)
		dispatch({ type: ADD_TODO, title: title, id: data.name })
	}

	const removeTodo = (id) => {
		const todo = state.todos.find(t => t.id === id)
		Alert.alert(
			"Удаление элемента",
			`Вы уверены что ходите удалить "${todo.title}"`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Удаление",
					style: "destructive",
					onPress: async () => {
						change(null)

						await Http.delete(`https://react-native-todo-95be5-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`)
						dispatch({ type: REMOVE_TODO, id })
					},
				},
			],
			{ cancelable: false }
		);

	}
	const fetchTodo = async () => {
		showLoader();
		clearError();


		try {

			const data = await Http.get('https://react-native-todo-95be5-default-rtdb.europe-west1.firebasedatabase.app/todos.json')
			const todosArray = Object.keys(data).map(key => ({ ...data[key], id: key }))
			console.log('DATA', todosArray)
			dispatch({ type: FETCH_TODOS, todosArray })

		} catch (error) {
			showError('УПС...')
			console.log(error)

		} finally {
			hideLoader();
		}
	}

	const updateTodo = async (id, title) => {
		showLoader();
		clearError();
		try {
			await Http.patch(`https://react-native-todo-95be5-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, { title })

		} catch (error) {
			showError('УПС...')
			console.log(error)
		} finally {
			hideLoader();
		}

		dispatch({ type: UPD_TODO, id, title })
	}

	const showLoader = () => dispatch({ type: SHOW_LOADER })
	const hideLoader = () => dispatch({ type: HIDE_LOADER })
	const showError = (error) => dispatch({ type: SHOW_ERROR, error })
	const clearError = () => dispatch({ type: CLEAR_ERROR })

	return (
		<TodoContext.Provider
			value={{
				todos: state.todos,
				loading: state.loading,
				error: state.error,
				addTodo,
				removeTodo,
				updateTodo,
				fetchTodo,

			}}>
			{children}
		</TodoContext.Provider>
	)
}
