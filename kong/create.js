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

const createRoot = () => {
	const root = document.createElement('div')
	root.id = "root"
	document.body.appendChild(root)

	return root
}

export {createElement, createRoot}
