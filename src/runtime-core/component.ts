export function createComponentInstance(vnode) {

	const component = {
		vnode,
		type:vnode.type
	}
	return component
}

export function setupComponent(instance) {
	//initProps
	//initsolt
	setupStatefunComponent(instance)
}
//初始化setup函数
function setupStatefunComponent(instance) {
		const Component = instance.type
		const {setup} = Component
		if(setup) {
			//function object
			const setupResult = setup()

			handleSetupResult(instance,setupResult)
		}
}
function handleSetupResult(instance,setupResult) {
			//function object
	if(typeof setupResult === 'object') {
		instance.setupResult = setupResult
	}

	finishComponentSetup(instance) 
}

function finishComponentSetup(instance) {
	const Component = instance.type

	instance.render = Component.render
	
}

