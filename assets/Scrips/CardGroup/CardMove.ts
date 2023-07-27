import { BaseCard } from "./BaseCard";
import { GAME_LISTEN_TO_EVENTS, MOUSE_STATUS } from "../audio/config";
import Cell from "../cellGroup/Cell";
import { GameSave } from "../gameData/SaveData";
//card moving
const { ccclass, property } = cc._decorator;
@ccclass
export default class CardMove extends cc.Component {
    public isMoving: boolean = false;
    public isInputCell: boolean = false;
    private isStartMouseEvent: boolean = false;
    private originPosition: cc.Vec3;
    public Mouse_status: MOUSE_STATUS = MOUSE_STATUS.NO_STATUS;
    @property(cc.Button)
    CardButton: cc.Button = null;
    private debounceTimeout: any = null;
    private targetPos: cc.Vec3 = new cc.Vec3();
    protected onLoad(): void {
    }
    start() {
        this.RegisterEvent();
    }
    public RegisterEvent() {
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
        console.log("emit to cell");
        this.node.parent.getComponent(Cell).GetCardIndex(this.node.getSiblingIndex());
        let CellNode = this.node.parent.getComponent(Cell);
        cc.tween(this.node)
            .delay(0.01)
            .call(() => {
                if (this.isMoving) {
                    CellNode.CheckBaseCard(this.node.getSiblingIndex());
                }
            })
            .start();
    }
    private onCardTouchMove(event: cc.Event.EventMouse) {
        if (this.isMoving) {
            console.log("card moving");
            const mousePos = event.getLocation();
            const newPos = cc.v3(mousePos.x, mousePos.y, 0);
            let localPos = this.node.parent.convertToNodeSpaceAR(newPos);
            this.node.setPosition(localPos);
        }
    }
    private onCardTouchEnd(event: cc.Event.EventTouch) {
        console.log("ontouch END");
        this.Mouse_status = MOUSE_STATUS.MOUSE_UP;
        cc.tween(this.node)
            .delay(0.01)
            .call(() => {
                this.CardMovingOrigin();
                this.EmitOutputCell();
            })
            .start();
    }
    public CardMovingOrigin() {
        if (!this.isInputCell) {
            cc.tween(this.node)
                .to(0.1, { position: new cc.Vec3(this.originPosition) })
                .call(() => {
                    this.isMoving = false;
                    // this.node.getComponent(BaseCard).ClearCardMove();
                })
                .start();
        } else {
            this.isMoving = false;
            this.isInputCell = false;
            // this.node.getComponent(BaseCard).ClearCardMove();
        }
    }
    private EmitOutputCell() {
        this.node.parent.getComponent(Cell).SetOutputCell();
    }
    moveNode(event: cc.Event.EventMouse) {
        const mousePos = event.getLocation();
        const newPos = cc.v3(mousePos.x, mousePos.y, 0);
        let localPos = this.node.parent.convertToNodeSpaceAR(newPos);
        this.node.setPosition(localPos);
    }
    protected update(dt: number): void {
        if (this.isMoving) {
            console.log("card moving");
        }
    }
}
