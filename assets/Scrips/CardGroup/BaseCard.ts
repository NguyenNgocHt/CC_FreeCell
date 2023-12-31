
import { CardTypeStatus } from "./CardType";
import Cell from "../cellGroup/Cell";
import { GameControler } from "../maingame/GameControler";
import { GameManager } from "../maingame/GameManager";
import Main from "../maingame/Main";
import { CardInfo } from "../gameData/SaveData";
import LoadImages from "../common/LoadImages";
import Helper from "./Helper";
import { PATH_TO_CARDS } from "../audio/config";
import CardMove from "./CardMove";
import CardColliders from "./CardColliders";
import FreeCell from "../cellGroup/FreeCell";
const { ccclass, property } = cc._decorator;
@ccclass
export class BaseCard extends cc.Component {
    private tempNode: cc.Node = null;
    public number_index: number;
    public type: CardTypeStatus;
    @property(cc.Node)
    SpriteCard: cc.Node = null;
    @property(cc.Node)
    public imgSelect: cc.Node = null;
    private mainGame: Main;
    private cell: Cell;
    private freeCell: FreeCell;
    public id: number;
    private imagesPath: PATH_TO_CARDS;
    private originIndex: number = 0;
    public tag_group: number = 0
    private colliderNode: cc.Node = null;
    private isInit: boolean = false;
    public isMoving: boolean = false;

    public Init(number: number, type: CardTypeStatus, temp: cc.Node, main: Main) {
        this.number_index = number;
        this.type = type;
        let nameImage = Helper.Instance.ParseCard(number, type);
        LoadImages.Instance.LoadingImages("Images/Card2/", nameImage, (spriteFrame) => {
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        this.imgSelect.getComponent(cc.Sprite).enabled = false;
        this.tempNode = temp;
        this.mainGame = main;
    }
    public Select(on: boolean) {
        this.imgSelect.getComponent(cc.Sprite).enabled = on;
    }
    public MaxMovableCards(): number {
        return this.mainGame.MaxMovableCard();
    }
    public GetCardInfo(): CardInfo {
        return new CardInfo(this.type, this.number_index, this.cell.id);
    }
    public Log() {
        this.mainGame.Log(this, this.cell);
    }
    public Belong(cell: cc.Node, id: number) {
        this.isInit = true;
        this.cell = cell.getComponent(Cell);
        this.tag_group = this.cell.Tag;
        this.id = id;
        if (this.node.getComponent(CardMove)) {
            let cardMove = this.node.getComponent(CardMove);
            cardMove.RegisterEvent();
            cardMove.isMoving = false;
        }
    }
    public IsInOrderWithCard(card: BaseCard): boolean {
        return this.IsInColor(card) && this.IsInOrder(card, false);
    }
    public IsInColor(card: BaseCard): boolean {
        if ((this.type == CardTypeStatus.CLUB || this.type == CardTypeStatus.SPADE) &&
            (card.type == CardTypeStatus.HEART || card.type == CardTypeStatus.DIAMOND)) {
            return true;
        }

        if ((this.type == CardTypeStatus.HEART || this.type == CardTypeStatus.DIAMOND) &&
            (card.type == CardTypeStatus.CLUB || card.type == CardTypeStatus.SPADE)) {
            return true;
        }
        return false;
    }
    public IsInOrder(card: BaseCard, smaller: boolean = true): boolean // true = this < card; false = this > card
    {
        return smaller ? this.number_index == (card.number_index - 1) : this.number_index == (card.number_index + 1);
    }
    public OnClick_AddCardMove() {
    }
    public ClearCardMove() {
        if (this.node.getComponent(CardMove)) {
            this.node.parent.parent.setSiblingIndex(this.originIndex);
            this.node.removeComponent(CardMove);
        }
    }
    private SetTagCollder() {
        let colliderNode = this.node.getChildByName("CardCollider");
        if (colliderNode.getComponent(cc.BoxCollider)) {
            let collider = colliderNode.getComponent(cc.BoxCollider);
            collider.tag = this.number_index;
        }
    }
    public CheckLastElementOfArray(): boolean {
        if (this.isInit) {
            let nodeIndex = this.node.getSiblingIndex();
            if (nodeIndex == this.node.parent.children.length - 1) {
                return true;
            }
        } else {
            return false;
        }
    }
    public GetIsMoving(): boolean {
        if (this.node.getComponent(CardMove)) {
            let cardMove = this.node.getComponent(CardMove);
            return cardMove.isMoving;
        } else {
            return false;
        }
    }
    public SetIsInputCell(isInput: boolean) {
        if (this.node.getComponent(CardMove)) {
            this.node.getComponent(CardMove).isInputCell = isInput;
            this.node.getComponent(CardMove).CardMovingOrigin();
        }
    }
    public AddCollider() {
        let colliderNode = this.node.getChildByName("CardCollider");
        if (!colliderNode.getComponent(CardColliders)) {
            colliderNode.addComponent(CardColliders);
        }
        this.SetTagCollder();
    }
    public RemoveCollider() {
        let colliderNode = this.node.getChildByName("CardCollider");
        if (colliderNode.getComponent(CardColliders)) {
            colliderNode.removeComponent(CardColliders);
        }
    }
}
