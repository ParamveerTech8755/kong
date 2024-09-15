import {createElement} from "../../kong/create.js"
import {useState} from "../../kong/hooks.js"

/** @jsx createElement */
const Test = () => {
	const [count, setCount] = useState(0)

	return (
		<div>
			<button onClick={() => setCount(count => count+1)}>click me!</button>
			<span>{count}</span>
		</div>
	)
}

export default Test