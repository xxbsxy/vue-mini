'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    //initProps
    //initsolt
    setupStatefunComponent(instance);
}
//初始化setup函数
function setupStatefunComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        //function object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    //function object
    if (typeof setupResult === 'object') {
        instance.setupResult = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    ProcessComponent(vnode);
}
function ProcessComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode); //通过虚拟节点创建组件实例对象
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    patch(subTree);
}

function createVNode(type, prop, children) {
    const vnode = {
        type,
        prop,
        children
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            //先创建虚拟节点
            const vnode = createVNode(rootComponent);
            //接收虚拟节点和容器
            render(vnode);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
