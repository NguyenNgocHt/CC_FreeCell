
import { BaseCard } from "../CardGroup/BaseCard";
import CardColliders from "../CardGroup/CardColliders";
import CardMove from "../CardGroup/CardMove";
import { CardTypeStatus } from "../CardGroup/CardType";
import { GAME_LISTEN_TO_EVENTS, MOUSE_ONCLICK_LEFT_RIGHT_STATUS } from "../audio/config";
import Main from "../maingame/Main";
import singleTon from "../maingame/Sigleton";
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
    private card_copyComparison: BaseCard[];
    private successInit_index: number;
    public id_cell_old: number;
    public posCell_intermediry: cc.Vec3 = new cc.Vec3(0, 0, 0);
    public id: number;
    private countCheckIndexMax: number = 0;
    private countPushIndexCard: number = 0;
    private IndexCard_onclick: number = 0;
    private IndexCell_origin: number = 0;
    start() {
        this.successInit_index = 0;
        this.cards = [];
        this.card_copyComparison = [];
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
        cc.tween(this.node)
            .delay(0.01)
            .call(() => {
                this.SetPositionAllChild_cardEntermediary();
            })
            .start();
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
        if (this.Tag == 1 || this.Tag == 2 || this.Tag == 3 || this.Tag == 4 || this.Tag == 5 || this.Tag == 6 || this.Tag == 7 || this.Tag == 8) {
            let childs = this.node.children;
            for (let i = 0; i < childs.length; i++) {
                childs[i].getComponent(BaseCard).imgSelect.getComponent(cc.Sprite).enabled = false;
                if (childs[i].getComponent(BaseCard).id == 1) {
                    childs[i].setPosition(this.node.position.x, this.node.position.y)
                } else {
                    childs[i].setPosition(this.node.position.x, this.node.position.y - i * 50);
                }
            }
        } else if (this.Tag == 10 || this.Tag == 11 || this.Tag == 12 || this.Tag == 13) {
            let childs = this.node.children;
            for (let i = 0; i < childs.length; i++) {
                childs[i].setPosition(0, 0);
            }
        } else if (this.Tag == 14 || this.Tag == 15 || this.Tag == 16 || this.Tag == 17) {
            let childs = this.node.children;
            for (let i = 0; i < childs.length; i++) {
                childs[i].setPosition(0, 0);
                childs[i].removeComponent(CardMove);
                childs[i].removeComponent(CardColliders);
            }
        }
    }
    SetPositionAllChild_cardEntermediary() {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
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
        this.carts_intermediaryOutput = [];
        this.card_copyComparison = [];
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
                            this.card_copyComparison.push(childs[i].getComponent(BaseCard));
                        }
                    }
                }
                else if (i == childs.length - 1 && actualNumber == standardNumber - 1) {
                    this.carts_intermediaryOutput.push(childs[i].getComponent(BaseCard));
                    this.card_copyComparison.push(childs[i].getComponent(BaseCard));
                    if (this.card_copyComparison.length >= 2) {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
        }
    }
    RemoveCardInCards() {
        this.cards_temporary = [];
        for (let i = 0; i < this.cards.length; i++) {
            if (!this.carts_intermediaryOutput.includes(this.cards[i])) {
                this.cards_temporary.push(this.cards[i]);
            }
        }
        this.cards = [];
        for (let i = 0; i < this.cards_temporary.length; i++) {
            this.cards.push(this.cards_temporary[i]);
        }
    }
    public GetCardIndex(index: number, mouse_onclickStatus: MOUSE_ONCLICK_LEFT_RIGHT_STATUS) {
        this.countPushIndexCard += 1;
        if (this.countPushIndexCard == 1) {
            this.IndexCard_onclick = index;
            this.CheckIndexMax(mouse_onclickStatus);
            this.Emit_onClickToMain();
        }
        cc.tween(this.node)
            .delay(0.02)
            .call(() => {
                this.countPushIndexCard = 0;
            })
            .start();
    }
    CheckIndexMax(mouse_onclickStatus: MOUSE_ONCLICK_LEFT_RIGHT_STATUS) {
        if (mouse_onclickStatus == MOUSE_ONCLICK_LEFT_RIGHT_STATUS.MOUSE_LEFT) {
            this.SetIsMovingCard(this.IndexCard_onclick);
        }
        else if (mouse_onclickStatus == MOUSE_ONCLICK_LEFT_RIGHT_STATUS.MOUSE_RIGHT) {
            this.SetMovingCardToCellTop(this.IndexCard_onclick);
        }
    }
    //check index card de lay ra card nao duoc phep di chyuyen
    SetIsMovingCard(indexMax: number) {
        let childs = this.node.children;
        for (let i = 0; i < childs.length; i++) {
            if (i == indexMax) {
                if (indexMax == childs.length - 1) {
                    childs[i].getComponent(CardMove).isMoving = true;
                    cc.tween(this.node)
                        .delay(0.01)
                        .call(() => {
                            childs[i].getComponent(BaseCard).Select(true);
                        })
                        .start();
                    this.IndexCell_origin = this.node.parent.getSiblingIndex();
                    this.node.parent.setSiblingIndex(9);
                    this.ResetCardsIndex();
                } else {
                    if (this.CheckBaseCard(i)) {
                        this.Emit_data_toMain();
                        this.ResetCardsIndex();
                    } else {
                        childs[i].getComponent(CardMove).isMoving = false;
                        this.ResetCardsIndex();
                    }
                }
            } else {
                childs[i].getComponent(CardMove).isMoving = false;
                this.ResetCardsIndex();
            }
        }
    }
    public SetOriginCellIndex() {
        this.node.parent.setSiblingIndex(this.IndexCell_origin);
    }
    public ResetCardsIndex() {
        cc.tween(this.node)
            .delay(0.005)
            .call(() => {
                this.countPushIndexCard = 0;
            })
            .start();
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
    Set_positionCell_intermediary(posStart: cc.Vec3) {
        this.posCell_intermediry = posStart;
    }
    public RemoveCards_freecell() {
        this.cards = [];
    }
    public RemoveCards_cell() {
        this.cards = [];
    }
    public RemoveAllChildsAndCard() {
        this.node.removeAllChildren();
        this.cards = [];
        this.carts_intermediaryOutput = [];
        this.Cards_intermediaryInput = [];
        this.cards_inputCardEnterCellOld = [];
    }
    public CheckConsecutiveCards(): BaseCard[] {
        let chidls = this.node.children;
        this.card_copyComparison = [];
        for (let i = 0; i < chidls.length; i++) {
            if (this.CheckBaseCard(i)) {
                return this.card_copyComparison;
            }
        }
    }
    public GetTopCell(): BaseCard {
        let childs = this.node.children;
        if (childs) {
            let chidlsLength = childs.length;
            if (chidlsLength > 0) {
                return childs[chidlsLength - 1].getComponent(BaseCard);
            }
        }
    }
    //emit to main
    Emit_data_toMain() {
        this.RemoveCardInCards();
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_FOR_CARD_INTERMEDIARY, this.carts_intermediaryOutput, this.id);
    }
    //gui du lieu cell va id card cho main de check xem cell top co chua duoc card bottom cell khong
    SetMovingCardToCellTop(indexMax: number) {
        let childs = this.node.children;
        if (indexMax == childs.length - 1) {
            this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_BUTTON_RIGHT, this.id, indexMax);
        } else {
            this.ResetCardsIndex();
        }
    }
    public SetOutputCell(id_cell_input: number) {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN, id_cell_input);
    }
    private Emit_onClickToMain() {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD);
    }
    public EmitToMain_removeCardFreecell(tagCell: number) {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_REMOVE_CARD_FREECELL, tagCell);
    }
    //check xem cell rong chua
    public EmitCheckChildsInCell(tagCell: number) {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_CHECK_CHILDS_FOR_CELL, tagCell);
    }
    //xoa collider tam cua cell
    public EmitDeleteColliderInCell(TagCell: number) {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_DELETE_COLLIDER_CHILD_NODE, TagCell);
    }
    public EmitUpdateCountMove() {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_UPDATE_COUNT_MOVE);
    }
    public EmitSetIndexCellToorigin(tagCell: number) {
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_SETINDEX_CELL_TO_ORIGIN, tagCell);
    }
}
