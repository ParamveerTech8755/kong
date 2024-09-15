import {createElement} from "../../kong/create.js"
import Test from "./Test.jsx"

/** @jsx createElement */
function App(){
	return (
		<div>
		<ul>
			<li><a href="https://www.google.com">item1</a></li>
			<li>item2</li>
			<li>item3</li>
		</ul>
		<p>lets make this a bit more <strong>complicated</strong></p>
		<div>
			<p>Hello there buddy</p>
			<Test />
			<Test />
			<Test />
		</div>
		<table>
			<tbody>
				<tr>
					<td>param</td>
					<td>iitr</td>
				</tr>
				<tr>
					<td>Ram</td>
					<td>iitb</td>
				</tr>
			</tbody>
		</table>
	</div>
	)
}

export default App