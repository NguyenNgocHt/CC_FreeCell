// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    start() {
        this.RegisterEvent();
    }
    public RegisterEvent() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }
    protected onDisable(): void {
        this.node.off(cc.Node.EventType.MOUSE_DOWN);
        this.node.off(cc.Node.EventType.MOUSE_MOVE);
        this.node.off(cc.Node.EventType.MOUSE_UP);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE);
    }
    onTouchStart(event: cc.Event.EventMouse) {
        console.log("onclick bg");
        event.stopPropagationImmediate();
    }
    onTouchMove() {

    }
    onTouchEnd() {

    }
    onMouseLeave() {

    }
}
