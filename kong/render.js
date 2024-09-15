import {createDOM} from "./create.js"

const tree = {
	nextUnitOfWork: null,
	currentRoot: null,
	wipRoot: null
}

const hooks = {
	wipFibre: null,
	hookIndex: 0,
	modify: false
}

let deletionQueue = []

const commitRoot = () => {
	commitWork(tree.wipRoot)
	tree.currentRoot = tree.wipRoot
	tree.wipRoot = null
	deletionQueue.forEach(fibre => {
		let parentFibre = fibre.parent
		while(!parentFibre.dom)
			parentFibre = parentFibre.parent
		parentFibre.dom.removeChild(fibre.dom)
	})
	if(hooks.modify){
		renderRoot(tree.currentRoot, tree.currentRoot.parent.dom)
		tree.wipRoot = tree.currentRoot
		tree.nextUnitOfWork = tree.wipRoot
		requestIdleCallback(workLoop)
		hooks.modify = false
	}
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

		if(fibre.element.type === "TEXT_NODE")
			fibre.dom.nodeValue = fibre.element.nodeValue

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
		alternate: tree.currentRoot,
		sibling: null,
		child: null
	}

	tree.wipRoot = root
	tree.nextUnitOfWork = root
	requestIdleCallback(workLoop)
}

const workLoop = deadline => {
	while(deadline.timeRemaining() > 1 && tree.nextUnitOfWork)
		tree.nextUnitOfWork = performUnitOfWork(tree.nextUnitOfWork)
	if(tree.nextUnitOfWork)
		requestIdleCallback(workLoop)
	else if(tree.wipRoot)
		commitRoot()
}



const performUnitOfWork = fibre => {
	let element = fibre.element
	const props = element.props

	const alternate = fibre.alternate

	if(element.type instanceof Function){

		hooks.wipFibre = fibre
		hooks.hookIndex = 0
		hooks.wipFibre.state = alternate ? alternate.state : []
		
		// fibre for the child
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
			fibre.dom = alternate.dom
		}
		else{
			fibre.effectTag = "create"
			deletionQueue.push(alternate)
			fibre.dom = createDOM(element)
			fibre.alternate = null
		}

		const oldChildren = []
		if(alternate){
			let ele = alternate.child
			while(ele){
				oldChildren.push(ele)
				ele = ele.sibling
			}
		}

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


export {renderRoot, hooks, tree, workLoop}