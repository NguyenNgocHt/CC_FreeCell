
import { BaseCard } from "../CardGroup/BaseCard";
import CardMove from "../CardGroup/CardMove";
import { CardTypeStatus } from "../CardGroup/CardType";
import { GAME_LISTEN_TO_EVENTS, MOUSE_ONCLICK_LEFT_RIGHT_STATUS } from "../audio/config";
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
    public id_cell_old: number;
    public posCell_intermediry: cc.Vec3 = new cc.Vec3(0, 0, 0);
    public id: number;
    private countCheckIndexMax: number = 0;
    private coutPushIndexCard: number = 0;
    private IndexCard_onclick: number = 0;
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
        if (!this.cards) {
            this.cards = [];
        }
        if (!this.cards.includes(card)) {
            this.cards.push(card);
        }
        let cardPositionInNodePrentOld = card.node.position;
        let wordPositionCardInNodeParenOld = card.node.parent.convertToWorldSpaceAR(cardPositionInNodePrentOld);
        let newPositionCardInNodeParentNew = this.node.convertToNodeSpaceAR(wordPositionCardInNodeParenOld);
        card.Belong(this.node, this.cards.length);
        card.node.setPosition(newPositionCardInNodeParentNew);
    }
    public SetPositionAllChildsAndOffActive() {
        this.SetPositionAllChild_InputCardsEnterCellOld();
    }
    SetPositionAllChild() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].getComponent(BaseCard).imgSelect.getComponent(cc.Sprite).enabled = false;
            if (childs[i].getComponent(BaseCard).id == 1) {
                childs[i].setPosition(this.node.position.x, this.node.position.y)
            } else {
                childs[i].setPosition(this.node.position.x, this.node.position.y - i * 50);
            }
        }
    }
    SetPositionAllChild_cardEntermediary() {
        let childs = this.node.children;
        console.log("childs.length", childs.length)
        for (let i = 0; i < childs.length; i++) {
            console.log("base card ", childs[i].getComponent(BaseCard));
            childs[i].getComponent(BaseCard).imgSelect.getComponent(cc.Sprite).enabled = true;
            if (i == 0) {
                childs[i].getComponent(CardMove).isMoving = true;
            }
            childs[i].getComponent(BaseCard).AddCollider();
        }
    }
    SetPositionAllChild_InputCardsEnterCellOld() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            childs[i].getComponent(BaseCard).imgSelect.getComponent(cc.Sprite).enabled = false;
            childs[i].getComponent(CardMove).RegisterEvent();
        }
        this.SetPositionAllChild();
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
    public CheckBaseCard(cardIndex: number): boolean {
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
                            return true;
                        }
                    }
                    else {
                        console.log("không thể chuyển");
                        return false;
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
    }
    public GetCardIndex(index: number, mouse_onclickStatus: MOUSE_ONCLICK_LEFT_RIGHT_STATUS) {
        console.log("Index", index);
        if (!this.cards_index) {
            this.cards_index = [];
        }
        this.cards_index.push(index);
        this.coutPushIndexCard += 1;
        if (this.coutPushIndexCard == 1) {
            this.IndexCard_onclick = index;
            this.CheckIndexMax(mouse_onclickStatus);
            this.Emit_onClickToMain();
        }
    }
    CheckIndexMax(mouse_onclickStatus: MOUSE_ONCLICK_LEFT_RIGHT_STATUS) {
        if (mouse_onclickStatus == MOUSE_ONCLICK_LEFT_RIGHT_STATUS.MOUSE_LEFT) {
            this.SetIsMovingCard(this.IndexCard_onclick);
        }
        else if (mouse_onclickStatus == MOUSE_ONCLICK_LEFT_RIGHT_STATUS.MOUSE_RIGHT) {
            this.SetMovingCardToCellTop(this.IndexCard_onclick);
        }
    }
    //gui du lieu cell va id card cho main de check xem cell top co chua duoc card bottom cell khong
    SetMovingCardToCellTop(indexMax: number) {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_BUTTON_RIGHT, this.id, indexMax);
    }
    //check index card de lay ra card nao duoc phep di chyuyen
    SetIsMovingCard(indexMax: number) {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            if (i == indexMax) {
                if (indexMax == childs.length - 1) {
                    // console.log(childs[i].getComponent(BaseCard));
                    childs[i].getComponent(CardMove).isMoving = true;
                    this.node.parent.setSiblingIndex(9);
                } else {
                    if (this.CheckBaseCard(i)) {

                    } else {
                        childs[i].getComponent(CardMove).isMoving = false;
                    }
                }
            } else {
                // console.log(childs[i].getComponent(BaseCard));
                childs[i].getComponent(CardMove).isMoving = false;
            }
        }
        this.ResetCardsIndex();
    }
    public ResetCardsIndex() {
        cc.tween(this.node)
            .delay(0.005)
            .call(() => {
                this.coutPushIndexCard = 0;
            })
            .start();
    }
    public SetOutputCell(id_cell_input: number) {
        console.log("hay nha card ra khoi cell tra ve cell goc");
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN, id_cell_input);
    }
    //add collider tai thoi diem khoi tao card , chi add cac doi tuong cuoi mang
    public AddColliderCards_gameStart() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            if (i == childs.length - 1) {
                this.AddCollider(i);
            }
            else {
                this.RemoveCollider(i);
            }
        }
    }
    public AddCollider(CardIndex: number) {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            if (i == CardIndex) {
                childs[i].getComponent(BaseCard).AddCollider();
            }
        }
    }
    public RemoveCollider(CardIndex: number) {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            if (i == CardIndex) {
                childs[i].getComponent(BaseCard).RemoveCollider();
            }
        }
    }
    Emit_onClickToMain() {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD);
    }
    Set_positionCell_intermediary(posStart: cc.Vec3) {
        this.posCell_intermediry = posStart;
    }
}
