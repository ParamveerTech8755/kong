const render = (element, parent) => {
	//element is an object and parent is dom element
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
	
	props.children.forEach(child => {
		render(child, ele)
	})

	parent.appendChild(ele)
}

export {render}
