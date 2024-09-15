import {hooks, tree, workLoop} from "./render.js"


function useState(initVal){
	const fibre = hooks.wipFibre
	
	if(!fibre.state[hooks.hookIndex])
		fibre.state[hooks.hookIndex] = initVal

	let localIndex = hooks.hookIndex
	hooks.hookIndex++

	const setState = arg => {
		let action
		if(typeof arg !== 'function'){
			action = () => arg
		}
		else
			action = arg
		fibre.state[localIndex] = action(fibre.state[localIndex])
		hooks.modify = true

		if(tree.wipRoot === null){
			// console.log("this: ", tree.currentRoot.element)
			tree.wipRoot = {
				parent: tree.currentRoot.parent,
				alternate: tree.currentRoot,
				sibling: null,
				child: null,
				element: tree.currentRoot.element
			}
			tree.nextUnitOfWork = tree.wipRoot
			hooks.modify = false
			requestIdleCallback(workLoop)
		}
	}

	return [fibre.state[localIndex], setState]
}
// whenever the function is rerendered.. set index to 0

export {useState}