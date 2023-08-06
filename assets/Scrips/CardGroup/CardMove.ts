import { BaseCard } from "./BaseCard";
import { GAME_LISTEN_TO_EVENTS, MOUSE_ONCLICK_LEFT_RIGHT_STATUS, MOUSE_STATUS, TOUCH_STATUS } from "../audio/config";
import Cell from "../cellGroup/Cell";
import { GameSave } from "../gameData/SaveData";
import FreeCell from "../cellGroup/FreeCell";
import PlayAudio from "../audio/PlayAuido";
import CardColliders from "./CardColliders";
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
    private debounceTimeout: any = null;
    private targetPos: cc.Vec3 = new cc.Vec3();
    private mousePos: cc.Vec2 = cc.v2(0, 0);
    private isLeaving: boolean = false;
    private offset: cc.Vec2 = cc.v2(0, 0);
    private indexOld_parent: number;
    private indexOld_parent_parent_parent: number;
    private TouchCount: number = 0;
    private DoubleTouchTime: number = 0.3;
    private touchStatus: TOUCH_STATUS = TOUCH_STATUS.NO_STATUS;
    private touchStartPos: cc.Vec2 = new cc.Vec2(0, 0);
    protected onLoad(): void {
    }
    start() {
        this.RegisterEvent();
    }
    public RegisterEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onCardTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onCardTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onCardTouchEnd.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onCardTouchEnd.bind(this));
    }
    protected onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
    }
    private onCardTouchStart(event: cc.Event.EventTouch) {
        this.TouchCount++;
        this.scheduleOnce(function () {
            this.TouchCount = 0;
        }, this.DoubleTouchTime)
        if (this.TouchCount >= 2) {
            this.touchStatus = TOUCH_STATUS.DOUBLE_TOUCH;
        } else {
            this.touchStatus = TOUCH_STATUS.TOUCH;
        }
        if (this.touchStatus == TOUCH_STATUS.TOUCH) {
            this.touchStartPos = event.getLocation();

            PlayAudio.Instance.AudioEffect_touch();
            this.getOldIndex();
            this.OpenSetNewSblIndexCell();
            this.Mouse_onClickStatus = MOUSE_ONCLICK_LEFT_RIGHT_STATUS.MOUSE_LEFT;
            this.originPosition = this.node.position;
            this.node.parent.getComponent(Cell).GetCardIndex(this.node.getSiblingIndex(), this.Mouse_onClickStatus, this.touchStartPos);
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
        } else if (this.touchStatus == TOUCH_STATUS.DOUBLE_TOUCH) {
            this.Mouse_onClickStatus = MOUSE_ONCLICK_LEFT_RIGHT_STATUS.MOUSE_RIGHT;
            PlayAudio.Instance.AudioEffect_touch();
            this.node.parent.getComponent(Cell).GetCardIndex(this.node.getSiblingIndex(), this.Mouse_onClickStatus, this.touchStartPos);
            this.Mouse_onClickStatus = MOUSE_ONCLICK_LEFT_RIGHT_STATUS.NO_STATUS;
        }
    }
    private onCardTouchMove(event: cc.Event.EventTouch) {
        if (this.isMoving) {
            const touchPos = event.getLocation();
            const delta = touchPos.sub(this.touchStartPos);
            if (this.node.getComponent(BaseCard).tag_group == 9) {
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
            cc.tween(this.node)
                .to(0.1, { position: new cc.Vec3(this.originPosition) })
                .call(() => {
                    if (this.node.getComponent(Cell)) {
                        if (this.node.getComponent(Cell).Tag == 20) {
                            PlayAudio.Instance.AudioEffect_swap();
                            this.isMoving = false;
                            this.node.getComponent(BaseCard).Select(false);
                            this.node.getComponent(Cell).get_childCardNodeInCellTag20();
                            this.node.removeComponent(Cell);
                            let colliderNode = this.node.getChildByName("CardCollider");
                            if (colliderNode) {
                                if (colliderNode.getComponent(CardColliders)) {
                                    colliderNode.removeComponent(CardColliders);
                                }
                            }
                        }
                    }
                    else {
                        this.isMoving = false;
                        this.node.getComponent(BaseCard).Select(false);
                        this.node.parent.getComponent(Cell).SetOriginCellIndex();
                        this.SetOilIndexNode();
                        PlayAudio.Instance.AudioEffect_swap();
                    }
                })
                .start();
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
}
