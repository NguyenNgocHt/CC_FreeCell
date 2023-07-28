// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CardTypeStatus } from "../CardGroup/CardType";
import { BaseCard } from "../CardGroup/BaseCard";
import Cell from "./Cell";

const { ccclass, property } = cc._decorator;

@ccclass
export class AceCell extends Cell {
    public cards_aceCell: BaseCard[];
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
        }
    }
    InitAceCell(cardType: number) {
        this.CardTypeGroup = cardType;
    }
}
