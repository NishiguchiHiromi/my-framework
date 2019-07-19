import Comp from "./comp.js"
import Part from "./part.js"
export const modules = {
    componentList: [Comp, Part]
}
const obj = {}
modules.componentList.forEach(x => obj[x.el.toUpperCase()] = x)
export const componentElDict = obj