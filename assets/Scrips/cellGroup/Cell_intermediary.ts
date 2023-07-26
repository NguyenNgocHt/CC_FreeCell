const { ccclass, property } = cc._decorator;
import { BaseCard } from "../CardGroup/BaseCard";
import Cell from "./Cell";
@ccclass
export default class Cell_intermediary extends cc.Component {
    private cards_entermediary: BaseCard[];
    public Add_cardEntermediary(card: BaseCard) {
        if (!this.cards_entermediary) {
            this.cards_entermediary = [];
        }
        if (!this.cards_entermediary.includes(card)) {
            this.cards_entermediary.push(card);
        }
        let cardPositionInNodePrentOld = card.node.position;
        let wordPositionCardInNodeParenOld = card.node.parent.convertToWorldSpaceAR(cardPositionInNodePrentOld);
        let newPositionCardInNodeParentNew = this.node.convertToNodeSpaceAR(wordPositionCardInNodeParenOld);
        if (card.node.parent) {
            card.node.removeFromParent();
        }
        this.node.addChild(card.node);
        card.Belong(this.node, this.cards_entermediary.length);
        this.SetPositionAllChild_cardEntermediary();
        card.node.setPosition(newPositionCardInNodeParentNew);
    }
    SetPositionAllChild_cardEntermediary() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].getComponent(BaseCard).imgSelect.getComponent(cc.Sprite).enabled = true;
        }
    }
}
