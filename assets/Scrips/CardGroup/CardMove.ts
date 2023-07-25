import { BaseCard } from "./BaseCard";

//card moving
const { ccclass, property } = cc._decorator;

@ccclass
export default class CardMove extends cc.Component {
    private isMoving: boolean = false;
    private isStartMouseEvent: boolean = false;
    private originPosition: cc.Vec3;
    protected onLoad(): void {
    }
    start() {
        this.RegisterEvent();
    }
    public RegisterEvent() {
        console.log("START ON");
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onCardTouchStart, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onCardTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onCardTouchEnd, this);
    }
    protected onDisable(): void {
        this.node.off(cc.Node.EventType.MOUSE_DOWN);
        this.node.off(cc.Node.EventType.MOUSE_MOVE);
        this.node.off(cc.Node.EventType.MOUSE_UP);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE);
    }
    private onCardTouchStart(event: cc.Event.EventMouse) {
        this.originPosition = this.node.position;
        let mousePos = event.getLocation();
        let newPos = new cc.Vec3(mousePos.x, mousePos.y, 0);
        this.node.position = this.node.parent.convertToNodeSpaceAR(newPos);
        this.isMoving = true
    }
    private onCardTouchMove(event: cc.Event.EventMouse) {
        if (this.isMoving) {
            // Lấy tọa độ của touchMove
            const mousePos = event.getLocation();
            const newPos = cc.v3(mousePos.x, mousePos.y, 0);
            this.node.position = this.node.parent.convertToNodeSpaceAR(newPos);
        }
    }
    private onCardTouchEnd(event: cc.Event.EventTouch) {
        cc.tween(this.node)
            .to(0.1, { position: new cc.Vec3(this.originPosition) })
            .call(() => {
                this.isMoving = false;
                this.node.getComponent(BaseCard).ClearCardMove();
            })
            .start();

    }
}
