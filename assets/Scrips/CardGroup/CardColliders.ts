import { MOUSE_STATUS } from "../audio/config";
import Cell from "../cellGroup/Cell";
import FreeCell from "../cellGroup/FreeCell";
import TopGroupManager from "../topGroup/TopGroupManager";
import { BaseCard } from "./BaseCard";
import CardMove from "./CardMove";
import { CardTypeStatus } from "./CardType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardColliders extends cc.Component {
    private _baseCard_other: BaseCard = new BaseCard();
    private _baseCard_self: BaseCard = new BaseCard();
    private self_cards_freecell: BaseCard[];
    private isInputOK: boolean = false;
    onCollisionEnter(other, self) {
    }
    onCollisionStay(other, self) {
        if (other.node.parent.getComponent(BaseCard).tag_group != self.node.parent.getComponent(BaseCard).tag_group) {
            this.GetCardInfo(other, self);
            if (this._baseCard_other.tag_group != this._baseCard_self.tag_group) {
                if (((this._baseCard_other.type == CardTypeStatus.CLUB || this._baseCard_other.type == CardTypeStatus.SPADE) &&
                    (this._baseCard_self.type == CardTypeStatus.DIAMOND || this._baseCard_self.type == CardTypeStatus.HEART)) ||
                    ((this._baseCard_other.type == CardTypeStatus.DIAMOND || this._baseCard_other.type == CardTypeStatus.HEART) &&
                        (this._baseCard_self.type == CardTypeStatus.CLUB || this._baseCard_self.type == CardTypeStatus.SPADE))) {
                    if (self.tag == other.tag - 1) {
                        if (this.isInputOK && this._baseCard_other.isMoving == false && this._baseCard_self.isMoving == true
                            && self.node.parent.getComponent(CardMove).Mouse_status == MOUSE_STATUS.MOUSE_UP) {
                            if (this._baseCard_other.tag_group != 10 && this._baseCard_other.tag_group != 11
                                && this._baseCard_other.tag_group != 12 && this._baseCard_other.tag_group != 13
                                && this._baseCard_other.tag_group != 14 && this._baseCard_other.tag_group != 15
                                && this._baseCard_other.tag_group != 16 && this._baseCard_other.tag_group != 17) {
                                if (this._baseCard_self.tag_group == 9 && this._baseCard_other.tag_group != 9) {
                                    self.node.parent.getComponent(CardMove).Mouse_status = MOUSE_STATUS.NO_STATUS;
                                    TopGroupManager.Instance.ShowCountMove(1);
                                    self.node.parent.parent.getComponent(Cell).SetOutputCell(other.node.parent.parent.getComponent(Cell).id)
                                    this.node.parent.parent.getComponent(Cell).EmitCheckChildsInCell(this._baseCard_self.tag_group);
                                    this.node.parent.parent.getComponent(Cell).SetPositionAllChild();
                                }
                                else if (this._baseCard_self.tag_group == 10 || this._baseCard_self.tag_group == 11 ||
                                    this._baseCard_self.tag_group == 12 || this._baseCard_self.tag_group == 13) {
                                    console.log('this._baseCard_self.tag_group', this._baseCard_self.tag_group);
                                    console.log("this.node", this.node.parent.getComponent(BaseCard));
                                    TopGroupManager.Instance.ShowCountMove(1);
                                    self.node.parent.getComponent(CardMove).Mouse_status = MOUSE_STATUS.NO_STATUS;
                                    self.node.parent.getComponent(BaseCard).SetIsInputCell(true);
                                    other.node.parent.parent.getComponent(Cell).Add(self.node.parent.getComponent(BaseCard));
                                    this.node.parent.parent.getComponent(Cell).EmitToMain_removeCardFreecell(this._baseCard_self.tag_group);
                                    this.node.parent.parent.getComponent(Cell).SetPositionAllChild();
                                }
                                else {
                                    TopGroupManager.Instance.ShowCountMove(1);
                                    self.node.parent.getComponent(CardMove).Mouse_status = MOUSE_STATUS.NO_STATUS;
                                    self.node.parent.getComponent(BaseCard).SetIsInputCell(true);
                                    other.node.parent.parent.getComponent(Cell).Add(self.node.parent.getComponent(BaseCard));
                                    this.node.parent.parent.getComponent(Cell).EmitCheckChildsInCell(this._baseCard_self.tag_group);
                                    this.node.parent.parent.getComponent(Cell).SetPositionAllChild();

                                }
                            }
                        }
                    }
                } else {
                    if (self.node.parent.getComponent(CardMove).Mouse_status) {
                        if (self.node.parent.getComponent(CardMove).Mouse_status == MOUSE_STATUS.MOUSE_UP &&
                            other.node.parent.name == "ColliderNode") {
                            if (self.node.parent.getComponent(BaseCard).tag_group == 9 &&
                                other.node.parent.getComponent(BaseCard).tag_group != 9) {
                                self.node.parent.getComponent(CardMove).Mouse_status = MOUSE_STATUS.NO_STATUS;
                                TopGroupManager.Instance.ShowCountMove(1);
                                console.log("nhap cell rỗng");
                                self.node.parent.parent.getComponent(Cell).SetOutputCell(other.node.parent.parent.getComponent(Cell).id)
                                this.node.parent.parent.getComponent(Cell).EmitCheckChildsInCell(this._baseCard_self.tag_group);
                                this.node.parent.parent.getComponent(Cell).EmitDeleteColliderInCell(this._baseCard_other.tag_group);
                                this.node.parent.parent.getComponent(Cell).SetPositionAllChild();
                            }
                            else if (this._baseCard_self.tag_group == 10 || this._baseCard_self.tag_group == 11 ||
                                this._baseCard_self.tag_group == 12 || this._baseCard_self.tag_group == 13) {
                                TopGroupManager.Instance.ShowCountMove(1);
                                console.log('this._baseCard_self.tag_group', this._baseCard_self.tag_group);
                                console.log("this.node", this.node.parent.getComponent(BaseCard));
                                self.node.parent.getComponent(CardMove).Mouse_status = MOUSE_STATUS.NO_STATUS;
                                self.node.parent.getComponent(BaseCard).SetIsInputCell(true);
                                other.node.parent.parent.getComponent(Cell).Add(self.node.parent.getComponent(BaseCard));
                                this.node.parent.parent.getComponent(Cell).EmitToMain_removeCardFreecell(this._baseCard_self.tag_group);
                                this.node.parent.parent.getComponent(Cell).EmitDeleteColliderInCell(this._baseCard_other.tag_group);
                                this.node.parent.parent.getComponent(Cell).SetPositionAllChild();
                            }
                            else {
                                TopGroupManager.Instance.ShowCountMove(1);
                                self.node.parent.getComponent(CardMove).Mouse_status = MOUSE_STATUS.NO_STATUS;
                                self.node.parent.getComponent(BaseCard).SetIsInputCell(true);
                                other.node.parent.parent.getComponent(Cell).Add(self.node.parent.getComponent(BaseCard));
                                this.node.parent.parent.getComponent(Cell).EmitCheckChildsInCell(this._baseCard_self.tag_group);
                                this.node.parent.parent.getComponent(Cell).EmitDeleteColliderInCell(this._baseCard_other.tag_group);
                                this.node.parent.parent.getComponent(Cell).SetPositionAllChild();
                            }
                        }
                    }
                }
            }
        }
    }
    onCollisionExit(other, self) {
    }
    GetCardInfo(other: any, self: any) {
        this._baseCard_other.tag_group = other.node.parent.getComponent(BaseCard).tag_group;
        this._baseCard_other.type = other.node.parent.getComponent(BaseCard).type;
        this.isInputOK = other.node.parent.getComponent(BaseCard).CheckLastElementOfArray();
        this._baseCard_self.tag_group = self.node.parent.getComponent(BaseCard).tag_group;
        this._baseCard_self.type = self.node.parent.getComponent(BaseCard).type
        this._baseCard_other.isMoving = other.node.parent.getComponent(BaseCard).GetIsMoving();
        this._baseCard_self.isMoving = self.node.parent.getComponent(BaseCard).GetIsMoving();
    }
}
