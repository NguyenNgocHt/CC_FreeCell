//card moving
const { ccclass, property } = cc._decorator;

@ccclass
export default class CardMove extends cc.Component {
    private isMoving: boolean = false;
    protected onLoad(): void {
    }
    start() {
        console.log("START ON");
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onCardTouchStart, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onCardTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onCardTouchEnd, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onCardTouchEnd, this);
    }
    protected onDisable(): void {
        this.node.off(cc.Node.EventType.MOUSE_DOWN);
        this.node.off(cc.Node.EventType.MOUSE_MOVE);
        this.node.off(cc.Node.EventType.MOUSE_UP);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE);
    }
    private onCardTouchStart(event: cc.Event.EventMouse) {
        console.log("Mouse down");
        let mousePos = event.getLocation();
        let newPos = new cc.Vec3(mousePos.x, mousePos.y, 0);
        this.node.parent.position = this.node.parent.convertToNodeSpaceAR(newPos);
        this.isMoving = true;
    }

    private onCardTouchMove(event: cc.Event.EventMouse) {
        if (this.isMoving) {
            console.log("Mouse move");
            // Lấy tọa độ của touchMove
            const mousePos = event.getLocation();
            const newPos = cc.v3(mousePos.x, mousePos.y, 0);
            this.node.parent.position = this.node.parent.convertToNodeSpaceAR(newPos);
        }
    }
    private onCardTouchEnd(event: cc.Event.EventTouch) {
        this.isMoving = false;
    }
}
