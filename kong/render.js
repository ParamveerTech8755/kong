import {createDOM} from "./create.js"

let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null
let deletionQueue = []



const commitRoot = () => {
	commitWork(wipRoot)
	currentRoot = wipRoot
	wipRoot = null
	deletionQueue.forEach(fibre => {
		let parentFibre = fibre.parent
		while(!parentFibre.dom)
			parentFibre = parentFibre.parent
		parentFibre.dom.removeChild(fibre.dom)
	})
}


const commitWork = fibre => {
	if(!fibre)
		return
	const tag = fibre.effectTag
	if(tag === 'create'){
		let parentFibre = fibre.parent
		while(!parentFibre.dom)
			parentFibre = parentFibre.parent
		parentFibre.dom.appendChild(fibre.dom)
	}
	else if(tag === 'update'){
		//we can remove all the previous attributes here

		Object.keys(fibre.element.props).forEach(key => {
			if(key !== 'children'){
				if(key.startsWith('on')){
					// fibre.addEventListener
				}
				else{
					fibre.dom[key] = fibre.element.props[key]
				}
			}
		})

	}
	commitWork(fibre.child)
	commitWork(fibre.sibling)
}


const renderRoot = (element, parent) => {
	const root = {
		parent: {
			dom: parent
		},
		element,
		alternate: currentRoot,
		sibling: null,
		child: null
	}
	wipRoot = root
	nextUnitOfWork = root
	requestIdleCallback(workLoop)
}

const workLoop = deadline => {
	while(deadline.timeRemaining() > 1 && nextUnitOfWork)
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
	if(nextUnitOfWork)
		requestIdleCallback(workLoop)
	else if(wipRoot)
		commitRoot()
}


const performUnitOfWork = fibre => {
	let element = fibre.element
	const props = element.props

	const alternate = fibre.alternate

	if(element.type instanceof Function){

		// fibre.element = element = element.type(element.props)
		const newFibre = {
			parent: fibre,
			element: element.type(element.props),
			sibling: null,
			child: null,
			alternate: alternate ? alternate.child : null
			// alternate: alternate.effectTag === 'component' ? alternate.child : null
			//not correct.. but kaam chalau
		}
		fibre.child = newFibre
		fibre.effectTag = "component"
	}
	else{

		if(alternate === null){
			fibre.effectTag = "create"
			fibre.dom = createDOM(element)
		}
		else if(alternate.element.type === element.type){
			
			fibre.effectTag = "update"
		}
		else{
			fibre.effectTag = "create"
			deletionQueue.push(alternate)
			fibre.dom = createDOM(element)
			fibre.alternate = null
		}

		const oldChildren = alternate ? alternate.element.props.children : []

		let prev = null
		props.children.forEach((child, ind) => {
			const childFibre = {
				element: child,
				parent: fibre,
				alternate: null,
				child: null,
				sibling: null
			}
			if(ind < oldChildren.length)
				childFibre.alternate = oldChildren[ind]
			

			if(ind === 0)
				fibre.child = childFibre
			else
				prev.sibling = childFibre

			prev = childFibre


		})

		//now push all the deleted items in the deletionQueue
		if(oldChildren.length > props.children.length){
			let ptr = fibre.child
			for(let i = 0; i < props.children.length; i++)
				ptr = ptr.sibling

			while(ptr){
				deletionQueue.push(ptr)
				ptr = ptr.sibling
			}

		}

	}





	//now find for the nextUnitOfWork.. fine
	if(fibre.child)
		return fibre.child
	else if(fibre.sibling)
		return fibre.sibling

	let next = fibre.parent

	while(next.sibling === null)
		next = next.parent

	return next.sibling	
}


export {renderRoot}