
import { BaseCard } from "../CardGroup/BaseCard";
import CardMove from "../CardGroup/CardMove";
import { CardTypeStatus } from "../CardGroup/CardType";
import { GAME_LISTEN_TO_EVENTS } from "../audio/config";
import Main from "../maingame/Main";
import CellMove from "./CellMove";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Cell extends cc.Component {
    @property
    Tag: number = 0;
    public cards: BaseCard[];
    public Cards_intermediaryInput: BaseCard[];
    private carts_intermediaryOutput: BaseCard[];
    private cards_inputCardEnterCellOld: BaseCard[];
    private cards_temporary: BaseCard[];
    private cards_index: number[];
    private successInit_index: number;
    private id_cell_old: number;
    public id: number;
    start() {
        this.successInit_index = 0;
    }
    protected onDisable(): void {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].off(GAME_LISTEN_TO_EVENTS.DATA_INDEX_FOR_CARD);
            childs[i].off(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL);
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
    public Add_cardEntermediary(card: BaseCard, ID_cell_old: number) {
        this.id_cell_old = ID_cell_old;
        console.log("nhay vao day");
        if (!this.Cards_intermediaryInput) {
            this.Cards_intermediaryInput = [];
        }
        if (!this.Cards_intermediaryInput.includes(card)) {
            this.Cards_intermediaryInput.push(card);
        }
        let cardPositionInNodePrentOld = card.node.position;
        let wordPositionCardInNodeParenOld = card.node.parent.convertToWorldSpaceAR(cardPositionInNodePrentOld);
        let newPositionCardInNodeParentNew = this.node.convertToNodeSpaceAR(wordPositionCardInNodeParenOld);
        if (card.node.parent) {
            card.node.removeFromParent();
        }
        this.node.addChild(card.node);
        card.Belong(this.node, this.Cards_intermediaryInput.length);
        this.SetPositionAllChild_cardEntermediary();
        card.node.setPosition(newPositionCardInNodeParentNew);
    }
    public Add_InputCardsEnterCellOld(card: BaseCard) {
        console.log("Add_InputCardsEnterCellOld");
        if (!this.cards) {
            this.cards = [];
        }
        if (!this.cards.includes(card)) {
            this.cards.push(card);
        }
        let cardPositionInNodePrentOld = card.node.position;
        let wordPositionCardInNodeParenOld = card.node.parent.convertToWorldSpaceAR(cardPositionInNodePrentOld);
        let newPositionCardInNodeParentNew = this.node.convertToNodeSpaceAR(wordPositionCardInNodeParenOld);
        // console.log("card.node.parent ", card.node.parent);
        // if (card.node.parent) {
        //     card.node.removeFromParent();
        // }
        // this.node.addChild(card.node);
        card.Belong(this.node, this.cards.length);
        card.node.setPosition(newPositionCardInNodeParentNew);
    }
    public SetPositionAllChildsAndOffActive() {
        this.SetPositionAllChild_InputCardsEnterCellOld();
    }
    SetPositionAllChild() {
        let childs1 = this.node.children;
        for (let i = 0; i < childs1.length; i++) {
            if (childs1[i].getComponent(BaseCard).id == 1) {
                childs1[i].setPosition(this.node.position.x, this.node.position.y)
            } else {
                childs1[i].setPosition(this.node.position.x, this.node.position.y - i * 50);
            }
        }
    }
    SetPositionAllChild_cardEntermediary() {
        let childs1 = this.node.children;
        for (let i = 0; i < childs1.length; i++) {
            childs1[i].getComponent(BaseCard).imgSelect.getComponent(cc.Sprite).enabled = true;
            console.log(i);
        }
    }
    SetPositionAllChild_InputCardsEnterCellOld() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].getComponent(BaseCard).imgSelect.getComponent(cc.Sprite).enabled = false;
            childs[i].getComponent(CardMove).RegisterEvent();
        }
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
        console.log("cards trước khi tách cell", this.cards);
        if (this.successInit_index != cardIndex) {
            this.carts_intermediaryOutput = [];
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
                                this.carts_intermediaryOutput.push(childs[i].getComponent(BaseCard));
                            }
                        }
                    }
                    else if (i == childs.length - 1 && actualNumber == standardNumber - 1) {
                        this.carts_intermediaryOutput.push(childs[i].getComponent(BaseCard));
                        console.log("carts_intermediary" + this.carts_intermediaryOutput);
                        console.log("có thể chuyển");
                        if (this.carts_intermediaryOutput.length > 1) {
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
        console.log("cards full", this.cards);
        console.log("cards intermediary", this.carts_intermediaryOutput);
        this.RemoveCardInCards();
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_FOR_CARD_INTERMEDIARY, this.carts_intermediaryOutput, this.id);
    }
    RemoveCardInCards() {
        console.log("cards intermediary", this.carts_intermediaryOutput);
        this.cards_temporary = [];
        for (let i = 0; i < this.cards.length; i++) {
            if (!this.carts_intermediaryOutput.includes(this.cards[i])) {
                this.cards_temporary.push(this.cards[i]);
            }
        }
        console.log("new cards ", this.cards_temporary);
        this.cards = [];
        console.log('card rong', this.cards);
        for (let i = 0; i < this.cards_temporary.length; i++) {
            this.cards.push(this.cards_temporary[i]);
        }
        console.log('cards new update', this.cards);
    }
    public GetCardIndex(index: number) {
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
        console.log("cell tag", this.Tag);
        let childs = this.node.children;
        console.log("chiilds length", childs.length);
        for (let i = 0; i < childs.length; i++) {
            if (i == indexMax) {
                console.log("is moving True")
                console.log(childs[i].getComponent(BaseCard));
                childs[i].getComponent(CardMove).isMoving = true;
                console.log(childs[i].getComponent(CardMove).isMoving);
                console.log(childs[i].getComponent(CardMove));
                this.node.parent.setSiblingIndex(9);
            } else {
                console.log(childs[i].getComponent(BaseCard));
                console.log("is moving false")
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
    public SetOutputCell() {
        console.log("hay nha card ra khoi cell tra ve cell goc");
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN, this.id_cell_old);
    }
}
