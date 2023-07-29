
import Cell from "./Cell";
import { BaseCard } from "../CardGroup/BaseCard";
const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeCell extends Cell {
    public CardTypeGroup: number = 0;
    public Add_freeCell(card: BaseCard) {
        if (!this.cards_freeCell) {
            this.cards_freeCell = [];
        }
        if (!this.cards_freeCell.includes(card)) {
            this.cards_freeCell.push(card);
        }
        if (card.node.parent) {
            card.node.removeFromParent();
        }
        this.node.addChild(card.node);
        card.Belong(this.node, this.cards_freeCell.length);
        this.SetPositionAllChild_freeCell();
    }
    SetPositionAllChild_freeCell() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].setPosition(0, 0);
        }
    }
    public setSbilingIndexCell() {
        let childs = this.node.children;
        this.node.parent.parent.setSiblingIndex(5);
        childs[0].setSiblingIndex(5);
    }
}
