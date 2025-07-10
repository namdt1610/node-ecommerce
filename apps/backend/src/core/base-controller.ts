export class BaseController {
    constructor() {
        bindMethods(this)
    }
}

function bindMethods(obj: any) {
    const proto = Object.getPrototypeOf(obj)

    for (const key of Object.getOwnPropertyNames(proto)) {
        const val = obj[key]
        if (key !== 'constructor' && typeof val === 'function') {
            obj[key] = val.bind(obj)
        }
    }
}
