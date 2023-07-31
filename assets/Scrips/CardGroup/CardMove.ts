import { BaseCard } from "./BaseCard";
import { GAME_LISTEN_TO_EVENTS, MOUSE_ONCLICK_LEFT_RIGHT_STATUS, MOUSE_STATUS } from "../audio/config";
import Cell from "../cellGroup/Cell";
import { GameSave } from "../gameData/SaveData";
import FreeCell from "../cellGroup/FreeCell";
//card moving
const { ccclass, property } = cc._decorator;
@ccclass
export default class CardMove extends cc.Component {
    public isMoving: boolean = false;
    public isInputCell: boolean = false;
    private isStartMouseEvent: boolean = false;
    private originPosition: cc.Vec3;
    public Mouse_status: MOUSE_STATUS = MOUSE_STATUS.NO_STATUS;
    public Mouse_onClickStatus: MOUSE_ONCLICK_LEFT_RIGHT_STATUS = MOUSE_ONCLICK_LEFT_RIGHT_STATUS.NO_STATUS;
    @property(cc.Button)
    CardButton: cc.Button = null;
    private debounceTimeout: any = null;
    private targetPos: cc.Vec3 = new cc.Vec3();
    private mousePos: cc.Vec2 = cc.v2(0, 0);
    private isLeaving: boolean = false;
    private offset: cc.Vec2 = cc.v2(0, 0);
    private indexOld_parent: number;
    private indexOld_parent_parent_parent: number;
    protected onLoad(): void {
    }
    start() {
        this.RegisterEvent();
    }
    public RegisterEvent() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onCardTouchStart, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onCardTouchMove, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onCardTouchEnd, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }
    protected onDisable(): void {
        this.node.off(cc.Node.EventType.MOUSE_DOWN);
        this.node.off(cc.Node.EventType.MOUSE_MOVE);
        this.node.off(cc.Node.EventType.MOUSE_UP);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE);
    }
    private onCardTouchStart(event: cc.Event.EventMouse) {
        if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT) {

            console.log("card info", this.node.getComponent(BaseCard));
            this.getOldIndex();
            this.OpenSetNewSblIndexCell();
            this.Mouse_onClickStatus = MOUSE_ONCLICK_LEFT_RIGHT_STATUS.MOUSE_LEFT;
            this.originPosition = this.node.position;
            console.log("emit to cell");
            this.node.parent.getComponent(Cell).GetCardIndex(this.node.getSiblingIndex(), this.Mouse_onClickStatus);
            let CellNode = this.node.parent.getComponent(Cell);
            this.Mouse_onClickStatus = MOUSE_ONCLICK_LEFT_RIGHT_STATUS.NO_STATUS;
            cc.tween(this.node)
                .delay(0.01)
                .call(() => {
                    if (this.isMoving) {
                        CellNode.CheckBaseCard(this.node.getSiblingIndex());
                    }
                })
                .start();
        } else if (event.getButton() === cc.Event.EventMouse.BUTTON_RIGHT) {
            this.Mouse_onClickStatus = MOUSE_ONCLICK_LEFT_RIGHT_STATUS.MOUSE_RIGHT;
            console.log("onClick chuột phải");
            this.node.parent.getComponent(Cell).GetCardIndex(this.node.getSiblingIndex(), this.Mouse_onClickStatus);
            this.Mouse_onClickStatus = MOUSE_ONCLICK_LEFT_RIGHT_STATUS.NO_STATUS;
        }
    }
    private onCardTouchMove(event: cc.Event.EventMouse) {
        if (this.isMoving) {
            this.mousePos = new cc.Vec2(event.getLocationX(), event.getLocationY());
            if (this.node.getComponent(BaseCard).tag_group == 9) {
                console.log("cell moving");
                const delta = event.getDelta();
                this.node.parent.x += delta.x;
                this.node.parent.y += delta.y;
            } else {
                const mousePos = event.getLocation();
                const newPos = new cc.Vec3(mousePos.x, mousePos.y, 0);
                let localPos = this.node.parent.convertToNodeSpaceAR(newPos);
                this.node.setPosition(localPos);
            }
        }
    }
    private onCardTouchEnd(event: cc.Event.EventTouch) {
        if (this.isMoving) {
            console.log("ontouch END");
            this.node.zIndex = 0;
            this.isLeaving = false;
            this.Mouse_status = MOUSE_STATUS.MOUSE_UP;
            cc.tween(this.node)
                .delay(0.01)
                .call(() => {
                    this.CardMovingOrigin();
                })
                .start();
        }
    }
    public CardMovingOrigin() {
        if (!this.isInputCell) {
            this.Mouse_status = MOUSE_STATUS.NO_STATUS;
            if (this.node.getComponent(BaseCard).tag_group == 9) {
                cc.tween(this.node.parent)
                    .to(0.1, { position: new cc.Vec3(this.node.parent.getComponent(Cell).posCell_intermediry) })
                    .call(() => {
                        this.isMoving = false;
                        this.EmitOutputCell();
                    })
                    .start();
            } else {
                cc.tween(this.node)
                    .to(0.1, { position: new cc.Vec3(this.originPosition) })
                    .call(() => {
                        this.isMoving = false;
                        this.SetOilIndexNode();
                    })
                    .start();
            }

        } else {
            this.Mouse_status = MOUSE_STATUS.NO_STATUS;
            this.isMoving = false;
            this.isInputCell = false;
            this.SetOilIndexNode();
        }
    }
    private EmitOutputCell() {
        this.node.parent.getComponent(Cell).SetOutputCell(this.node.parent.getComponent(Cell).id_cell_old);
    }
    moveNode(event: cc.Event.EventMouse) {
        const mousePos = event.getLocation();
        const newPos = cc.v3(mousePos.x, mousePos.y, 0);
        let localPos = this.node.parent.convertToNodeSpaceAR(newPos);
        this.node.setPosition(localPos);
    }
    onMouseLeave(event: cc.Event.EventMouse) {
        this.isLeaving = true;
    }
    OpenSetNewSblIndexCell() {
        if (this.node.getComponent(BaseCard).tag_group == 10 ||
            this.node.getComponent(BaseCard).tag_group == 11 ||
            this.node.getComponent(BaseCard).tag_group == 12 ||
            this.node.getComponent(BaseCard).tag_group == 13) {
            this.node.parent.setSiblingIndex(3);
            this.node.parent.parent.parent.setSiblingIndex(5);
        }
    }
    getOldIndex() {
        if (this.node.getComponent(BaseCard).tag_group == 10 ||
            this.node.getComponent(BaseCard).tag_group == 11 ||
            this.node.getComponent(BaseCard).tag_group == 12 ||
            this.node.getComponent(BaseCard).tag_group == 13) {
            this.indexOld_parent = this.node.parent.getSiblingIndex();
            this.indexOld_parent_parent_parent = this.node.parent.parent.parent.getSiblingIndex();
        }
    }
    SetOilIndexNode() {
        if (this.node.getComponent(BaseCard).tag_group == 10 ||
            this.node.getComponent(BaseCard).tag_group == 11 ||
            this.node.getComponent(BaseCard).tag_group == 12 ||
            this.node.getComponent(BaseCard).tag_group == 13) {
            this.node.parent.setSiblingIndex(this.indexOld_parent);
            this.node.parent.parent.parent.setSiblingIndex(this.indexOld_parent_parent_parent);
        }
    }
    protected update(dt: number): void {
        // if (this.isLeaving && this.isMoving) {
        //     const newPos = this.node.parent.convertToNodeSpaceAR(this.mousePos).add(this.offset);
        //     this.node.setPosition(newPos);
        // }
    }
}
