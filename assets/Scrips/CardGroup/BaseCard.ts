
import { CardTypeStatus } from "./CardType";
import Cell from "../cellGroup/Cell";
import { GameControler } from "../maingame/GameControler";
import { GameManager } from "../maingame/GameManager";
import Main from "../maingame/Main";
import { CardInfo } from "../gameData/SaveData";
import LoadImages from "../common/LoadImages";
import Helper from "./Helper";
import { PATH_TO_CARDS } from "../audio/config";
const { ccclass, property } = cc._decorator;
@ccclass
export class BaseCard extends cc.Component {
    private tempNode: cc.Node = null;
    public number_index: number;
    public type: CardTypeStatus;
    @property(cc.Node)
    SpriteCard: cc.Node = null;
    @property(cc.Node)
    imgSelect: cc.Node = null;
    private mainGame: Main;
    private cell: Cell;
    private id: number;
    private imagesPath: PATH_TO_CARDS;
    private width: number = 85;
    private hight: number = 110;
    
    public SetContentSize() {
        this.node.setContentSize(this.width, this.hight);
    }
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
        this.node.setContentSize(this.width, this.hight);
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
    public Belong(cell: Cell, id: number) {
        console.log("CARD ID ", id);
        this.cell = cell;
        this.id = id;
        cell.node.addChild(this.node);
        this.node.setContentSize(this.width, this.hight);
        let parentNode = this.node.parent;
        // parentNode.getComponent(cc.Layout).updateLayout();
        if (id == 1) {
            this.node.setPosition(cell.node.position.x, this.node.position.y + 133);
        }
        else {
            this.node.setPosition(cell.node.position.x, this.node.position.y + 80);
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
}
