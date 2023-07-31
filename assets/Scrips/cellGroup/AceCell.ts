
import { CardTypeStatus } from "../CardGroup/CardType";
import { BaseCard } from "../CardGroup/BaseCard";
import Cell from "./Cell";
import CardMove from "../CardGroup/CardMove";
import CardColliders from "../CardGroup/CardColliders";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AceCell extends Cell {
    public CardTypeGroup: number = 0;
    InitAceCell(cardType: number) {
        this.CardTypeGroup = cardType;
    }
    GetBaseCardForEndOfArr(): BaseCard {
        let length = this.cards.length;
        return this.cards[length - 1];
    }
}
