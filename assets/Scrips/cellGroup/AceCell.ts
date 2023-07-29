
import { CardTypeStatus } from "../CardGroup/CardType";
import { BaseCard } from "../CardGroup/BaseCard";
import Cell from "./Cell";
import CardMove from "../CardGroup/CardMove";
import CardColliders from "../CardGroup/CardColliders";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AceCell extends Cell {
    public CardTypeGroup: number = 0;
    public Add_aceCell(card: BaseCard) {
        if (!this.cards_aceCell) {
            this.cards_aceCell = [];
        }
        if (!this.cards_aceCell.includes(card)) {
            this.cards_aceCell.push(card);
        }
        if (card.node.parent) {
            card.node.removeFromParent();
        }
        this.node.addChild(card.node);
        card.Belong(this.node, this.cards_aceCell.length);
        this.SetPositionAllChild_aceCell();
    }
    SetPositionAllChild_aceCell() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].setPosition(0, 0);
            childs[i].removeComponent(CardMove);
            childs[i].removeComponent(CardColliders);
        }
    }
    InitAceCell(cardType: number) {
        this.CardTypeGroup = cardType;
    }
    GetBaseCardForEndOfArr(): BaseCard {
        let lengthCards = this.cards_aceCell.length;
        return this.cards_aceCell[lengthCards - 1];
    }
}
