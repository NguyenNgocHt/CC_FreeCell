// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class singleTon extends cc.Component {
    private static instance: singleTon | null = null;
    private parentNode: cc.Node = null;
    public static get Instance(): singleTon {
        if (this.instance == null) {
            this.instance = new singleTon();
        }
        return this.instance;
    }
    public setParentNode(parentNode: cc.Node) {
        this.parentNode = parentNode;
    }
    public getParentNode(): cc.Node {
        return this.parentNode;
    }
    public callbackFromChild() {
    }
}
