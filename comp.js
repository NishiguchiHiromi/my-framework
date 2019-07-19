export default {
    el: "Comp",
    template:
        `   <div>{{fuga}}</div>
            <div>
                <div jFor="let hoge of hoges">
                    <p>{{hoge.fuga}}</p>
                    <p>{{hoge.piyo}}</p>
                    <p>{{hoge.age + hoge.weight + val}}</p>
                </div>
                <div jFor="let hoge of hoges">
                    <p>2{{hoge.fuga}}</p>
                    <p>2{{hoge.piyo}}</p>
                    <p>2{{hoge.age + hoge.weight}}</p>
                </div>
            </div>
            `
    ,
    data: {
        hoges: [
            { fuga: "ふが1", piyo: "ぴよ1", age: 1, weight: 10 },
            { fuga: "ふが2", piyo: "ぴよ2", age: 2, weight: 20 },
            { fuga: "ふが3", piyo: "ぴよ3", age: 3, weight: 30 },
        ],
        fuga: "ふが",
        val: 1000
    }
}