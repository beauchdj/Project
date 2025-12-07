/* Gavin Stankovsky
*  September 2025
*  Counter component
*/

'use client';
import { useReducer } from "react";

export default function Counter() {
	// hold state variables
	type State = {
		counter: number,
		username: string,
		password: string
	};
	// actions on those variables
	type Action = { type: "increment" } | { type: "decrement" }
	// define a function to be passed to reducer
	// args: state: State, action: Action
	function reducer(state: State, action: Action): State {
		switch (action.type) {
			case 'increment': return { ...state, counter: state.counter + 1 };
			case 'decrement': return { ...state, counter: state.counter - 1 };
			default: return state;
		}
	}
	const [state, dispatch] = useReducer(reducer, { counter: 0, username: '', password: '' });

	return (
		<main>
			<button className="bg-slate-600 hover:bg-slate-500 px-4 rounded m-4" onClick={() => dispatch({ type: 'decrement' })}>-1</button>
			<button className="bg-slate-600 hover:bg-slate-500 px-4 rounded m-4" onClick={() => dispatch({ type: 'increment' })}>+1</button>
			<p>counter: {state.counter}</p>
		</main>
	);
}