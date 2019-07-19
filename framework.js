import { modules, componentElDict } from "./module.js"
export class JQ {
    DEFAULT_PARENT_ID = "app"
    constructor(option, parendId) {

        // コンポーネント名
        this.el = option.el
        // 親id
        this.parentId = parendId || this.DEFAULT_PARENT_ID
        // コンポーネントid作成
        this.id = this.el + "-" + uniqueCd()
        // コンポーネントのhtml
        this.template = option.template
        // コンポーネントのdata
        this.data = option.data
        // Dom取得
        this.comp = document.querySelector(`#${this.parentId} ${this.el}`)
        // コンポーネントのタグの前に描画し、
        this.comp.insertAdjacentHTML('beforebegin', `<div id="${this.id}">${this.template}</div>`);
        // コンポーネントタグを消去
        removeSelf(this.comp)
        // 描画後のコンポーネントDom取得
        this.renderedComp = document.querySelector(`#${this.id}`)
        this.renderJFor()
        this.renderVariable()
        this.renderChildren(this.renderedComp)
    }

    jFor_ATTR_NAME = "jFor"
    jFor_LET = "let "
    jFor_OF = " of "
    BRACKETS_FROM = "{{"
    BRACKETS_TO = "}}"
    NOT_PERIOD = "[\\s[({+\\-/*=<>%&|!?,:;]"
    renderJFor = () => {
        const jForDom = document.querySelectorAll(`[${this.jFor_ATTR_NAME}]`)


        jForDom.forEach(dom => {
            const jForAttr = dom.getAttribute(this.jFor_ATTR_NAME)

            const listName = getAfter(jForAttr, this.jFor_OF)
            const xName = getBetween(jForAttr, this.jFor_LET, this.jFor_OF)
            let baseDom = dom
            this.data[listName].forEach(x => {
                const jForDomClone = dom.cloneNode(true)
                jForDomClone.removeAttribute(this.jFor_ATTR_NAME);
                const renderedHtml = this.render(jForDomClone.innerHTML, x, xName)
                jForDomClone.innerHTML = renderedHtml
                baseDom.parentNode.insertBefore(jForDomClone, baseDom.nextSibling);
                baseDom = jForDomClone
            });

            // jForDom削除
            removeSelf(dom)
        })
    }

    renderVariable = () => {
        let beforeVariableRendered = this.renderedComp.innerHTML
        // {{と}}に挟まれた部分を出力
        let variableRendered = beforeVariableRendered.replace(/{{([^{][\s\S]+?[^}])}}/g,
            (str) => { // 第２引数に関数を渡す
                const renderedInner = this.renderBracket(str)
                console.log(renderedInner)
                return eval(renderedInner);
            })
        this.renderedComp.innerHTML = variableRendered
    }

    renderBracket = (str) => {
        str = str.replace("{{", " ").replace("}}", " ")
        Object.keys(this.data).forEach(v => {
            console.log(this.NOT_PERIOD + v + "\\W")
            const reg = new RegExp(this.NOT_PERIOD + v + "\\W", 'g');
            str = str.replace(reg,
                (v) => {
                    console.log(v)
                    const head = v[0]
                    const tail = v[v.length - 1]
                    const middle = v.slice(1).slice(0, -1)
                    console.log(`${head}this.data["${middle}"]${tail}`)
                    return `${head}this.data["${middle}"]${tail}`
                })
        })
        return str;
    }

    render = (html, x, xName) => {
        const reg = new RegExp(this.NOT_PERIOD + xName + "\\W", 'g');
        return html.replace(/{{([^{][\s\S]+?[^}])}}/g,
            (str) => { // 第２引数に関数を渡す
                let renderedInner = this.renderBracket(str)
                console.log(renderedInner)
                renderedInner = renderedInner.replace(reg,
                    (v) => {
                        console.log(v)
                        const head = v[0]
                        const tail = v[v.length - 1]
                        const middle = v.slice(1).slice(0, -1)
                        console.log(`${head}x${tail}`)
                        return `${head}x${tail}`
                    })
                console.log(renderedInner)
                return eval(renderedInner);
            })

    }

    renderChildren = (parent) => {
        Array.from(parent.children).forEach(child => {
            if (Object.keys(componentElDict).includes(child.tagName)) {
                console.log(child.tagName)
                new JQ(componentElDict[child.tagName], this.id)
            }
            this.renderChildren(child)
        })
    }
}

const getAfter = (str, target) => {
    const from = str.indexOf(target) + target.length
    return str.substr(from)
}

// const getBefore = (str, target) {
//     return str.substr(target + target.length)
// }

const getBetween = (str, target1, target2) => {
    const from = str.indexOf(target1) + target1.length
    const to = str.indexOf(target2)
    return str.substring(from, to)
}

const uniqueCd = () => {
    return Number(new Date())
}

const removeSelf = (dom) => {
    dom.parentNode.removeChild(dom)
}