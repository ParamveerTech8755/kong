const createElement = (type, props, ...children) => {
	const obj = {type}

	children = children.map(child => {
		if(typeof child !== "object")
			return {
				type: "TEXT_NODE",
				nodeValue: child,
				props: {
					children: []
				}
			}
		return child
	})

	if(props){
		props.children = children
		obj.props = props
	}
	else{
		obj.props = {
			children
		}
	}


	return obj
}

const createDOM = element => {
	let ele
	if(element.type === "TEXT_NODE")
		ele = document.createTextNode(element.nodeValue)
	else
		ele = document.createElement(element.type)

	const props = element.props
	
	Object.keys(props).forEach(key => {
		if(key !== 'children'){
			if(key.startsWith('on')){
				const name = key.substring(2).toLowerCase()
				ele.addEventListener(name, props[key])
			}
			else if(key === 'className'){
				const list = props[key].trim().split(' ')
				ele.classList.add(...list)
			}
			else
				ele.setAttribute(key, props[key])

		}
	})

	return ele;
}

const createRoot = () => {
	const root = document.createElement('div')
	root.id = "root"
	document.body.appendChild(root)

	return root
}

export {createElement, createRoot, createDOM}
