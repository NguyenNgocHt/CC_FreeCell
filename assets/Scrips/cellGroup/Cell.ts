
import { BaseCard } from "../CardGroup/BaseCard";
import CardMove from "../CardGroup/CardMove";
import { CardTypeStatus } from "../CardGroup/CardType";
import { GAME_LISTEN_TO_EVENTS } from "../audio/config";
import CellMove from "./CellMove";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Cell extends cc.Component {
    @property
    Tag: number;
    private cards: BaseCard[];
    public Cards_intermediary: BaseCard[];
    private carts_intermediary: BaseCard[];
    private cards_index: number[];
    private successInit_index: number;
    public id: number;
    start() {
        this.successInit_index = 0;
        this.EventRegister();
    }
    EventRegister() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].on(GAME_LISTEN_TO_EVENTS.DATA_INDEX_FOR_CARD, this.GetCardIndex, this);
        }
    }
    public Add(card: BaseCard) {
        if (!this.cards) {
            this.cards = [];
        }
        if (!this.cards.includes(card)) {
            this.cards.push(card);
        }
        if (card.node.parent) {
            card.node.removeFromParent();
        }
        this.node.addChild(card.node);
        card.Belong(this.node, this.cards.length);
        this.SetPositionAllChild();
    }
    public Add_cardEntermediary(card: BaseCard) {
        console.log("nhay vao day");
        if (!this.Cards_intermediary) {
            this.Cards_intermediary = [];
        }
        if (!this.Cards_intermediary.includes(card)) {
            this.Cards_intermediary.push(card);
        }
        let cardPositionInNodePrentOld = card.node.position;
        let wordPositionCardInNodeParenOld = card.node.parent.convertToWorldSpaceAR(cardPositionInNodePrentOld);
        let newPositionCardInNodeParentNew = this.node.convertToNodeSpaceAR(wordPositionCardInNodeParenOld);
        if (card.node.parent) {
            card.node.removeFromParent();
        }
        this.node.addChild(card.node);
        // card.Belong(this.node, this.cards_entermediary.length);
        this.SetPositionAllChild_cardEntermediary();
        card.node.setPosition(newPositionCardInNodeParentNew);
        card.node.removeComponent(CardMove);
    }
    SetPositionAllChild() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            if (childs[i].getComponent(BaseCard).id == 1) {
                childs[i].setPosition(this.node.position.x, this.node.position.y)
            } else {
                childs[i].setPosition(this.node.position.x, this.node.position.y - i * 50);
            }
        }
        this.EventRegister();
    }
    SetPositionAllChild_cardEntermediary() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].getComponent(BaseCard).imgSelect.getComponent(cc.Sprite).enabled = true;
            console.log(i);
        }
        this.node.addComponent(CellMove);
    }
    public GroupFrom(id: number): BaseCard[] {
        return this.cards.slice(id);
    }
    public RemoveFrom(id: number) {
        this.cards.splice(id, this.cards.length - id);
    }
    public RemoveCard(card: BaseCard) {
        const index = this.cards.indexOf(card);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    }
    public AddGroup(list: BaseCard[]) {
        for (let i = 0; i < list.length; i++) {
            this.Add(list[i]);
        }
    }
    public Length(): number {
        if (this.cards.length) {
            return this.cards.length;
        }
    }
    public GetCard(i: number): BaseCard {
        return this.cards[i];
    }
    public SetCard(i: number, card: BaseCard): void {
        this.cards[i] = card;
    }
    public getFree(): boolean {
        this.cards = this.cards || [];
        return this.cards.length === 0;
    }
    public TopCard(): BaseCard | null {
        this.cards = this.cards || [];
        return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
    }
    public CheckAutoCollect(): boolean {
        if (this.cards != null && this.cards.length > 1) {
            for (let i = 0; i < this.cards.length - 1; i++) {
                if (this.cards[i].number_index - 1 != this.cards[i + 1].number_index) {
                    return false;
                }
            }
        }
        return true;
    }
    public MovableCards(): BaseCard[] {
        let cardArr: BaseCard[];
        if (this.TopCard() != null) {
            cardArr.push(this.TopCard());
        }
        for (let i = this.cards.length - 2; i >= 0; i--) {
            if (this.cards[i + 1].IsInOrderWithCard(this.cards[i])) {
                cardArr.push(this.cards[i]);
            }
            else {
                break;
            }
        }
        return cardArr;
    }
    public Select(on: boolean) {
        if (!this.getFree()) {
            this.TopCard().Select(on);
        }
        else {
        }
    }
    public CheckBaseCard(cardIndex: number) {
        if (this.successInit_index != cardIndex) {
            this.carts_intermediary = [];
            let childs = this.node.children;
            let standardNumber = childs.length - cardIndex;
            let actualNumber = 0;
            for (let i = 0; i < childs.length; i++) {
                if (childs[i].getSiblingIndex() >= cardIndex) {
                    if (i + 1 < childs.length) {
                        if (childs[i].getComponent(BaseCard).number_index == childs[i + 1].getComponent(BaseCard).number_index + 1) {
                            if (((childs[i].getComponent(BaseCard).type == CardTypeStatus.CLUB || childs[i].getComponent(BaseCard).type == CardTypeStatus.SPADE) &&
                                (childs[i + 1].getComponent(BaseCard).type == CardTypeStatus.HEART || childs[i + 1].getComponent(BaseCard).type == CardTypeStatus.DIAMOND)) ||
                                ((childs[i].getComponent(BaseCard).type == CardTypeStatus.DIAMOND || childs[i].getComponent(BaseCard).type == CardTypeStatus.HEART) &&
                                    (childs[i + 1].getComponent(BaseCard).type == CardTypeStatus.CLUB || childs[i + 1].getComponent(BaseCard).type == CardTypeStatus.SPADE))) {
                                actualNumber += 1;
                                this.carts_intermediary.push(childs[i].getComponent(BaseCard));
                            }
                        }
                    }
                    else if (i == childs.length - 1 && actualNumber == standardNumber - 1) {
                        this.carts_intermediary.push(childs[i].getComponent(BaseCard));
                        console.log("carts_intermediary" + this.carts_intermediary);
                        console.log("có thể chuyển");
                        if (this.carts_intermediary.length > 1) {
                            this.Emit_data_toMain();
                        }
                    }
                    else {
                        console.log("không thể chuyển");
                    }
                }
            }
        }
    }
    Emit_data_toMain() {
        console.log("emit to main game");
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_FOR_CARD_INTERMEDIARY, this.carts_intermediary);
    }
    GetCardIndex(index: number) {
        console.log("Index", index);
        if (!this.cards_index) {
            this.cards_index = [];
        }
        this.cards_index.push(index);
        this.CheckIndexMax();
    }
    CheckIndexMax() {
        cc.tween(this.node)
            .delay(0.005)
            .call(() => {
                let maxIndex = Math.max(...this.cards_index);
                console.log("max index", maxIndex);
                this.SetIsMovingCard(maxIndex);
            })
            .start();
    }
    SetIsMovingCard(indexMax: number) {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            if (i == indexMax) {
                childs[i].getComponent(CardMove).isMoving = true;
                this.node.parent.setSiblingIndex(9);
            } else {
                childs[i].getComponent(CardMove).isMoving = false;
            }
        }
        cc.tween(this.node)
            .delay(0.005)
            .call(() => {
                this.cards_index = [];
            })
            .start();
    }
}
