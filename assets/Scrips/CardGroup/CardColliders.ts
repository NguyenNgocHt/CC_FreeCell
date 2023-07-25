import { BaseCard } from "./BaseCard";
import { CardTypeStatus } from "./CardType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardColliders extends cc.Component {
    private _baseCard_other: BaseCard = new BaseCard();
    private _baseCard_self: BaseCard = new BaseCard();
    private isMovingOK: boolean = false;
    onCollisionEnter(other, self) {
        this.GetCardInfo(other, self);
        if (this._baseCard_other.tag_group != this._baseCard_self.tag_group) {
            if (((this._baseCard_other.type == CardTypeStatus.CLUB || this._baseCard_other.type == CardTypeStatus.SPADE) &&
                (this._baseCard_self.type == CardTypeStatus.DIAMOND || this._baseCard_self.type == CardTypeStatus.HEART)) ||
                ((this._baseCard_other.type == CardTypeStatus.DIAMOND || this._baseCard_other.type == CardTypeStatus.HEART) &&
                    (this._baseCard_self.type == CardTypeStatus.CLUB || this._baseCard_self.type == CardTypeStatus.SPADE))) {
                if (self.tag == other.tag - 1) {
                    if (this.isMovingOK) {
                        console.log("ăn được");
                    }
                }
            }
            console.log("on collision enter");
        }
    }
    onCollisionStay(other, self) {
        if (self.tag != other.tag) {

        }
    }
    onCollisionExit(other, self) {
    }
    GetCardInfo(other: any, self: any) {
        this._baseCard_other.tag_group = other.node.parent.getComponent(BaseCard).tag_group;
        this._baseCard_other.type = other.node.parent.getComponent(BaseCard).type;
        this.isMovingOK = this._baseCard_other.CheckLastElementOfArray();
        this._baseCard_self.tag_group = self.node.parent.getComponent(BaseCard).tag_group;
        this._baseCard_self.type = self.node.parent.getComponent(BaseCard).type
    }
}
