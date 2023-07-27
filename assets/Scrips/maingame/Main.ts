// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
import Cell from "../cellGroup/Cell";
import FreeCell from "../cellGroup/FreeCell";
import { AceCell } from "../cellGroup/AceCell";
import { BaseCard } from "../CardGroup/BaseCard";
import { GameSave, SaveData } from "../gameData/SaveData";
import GameData from "../gameData/GameData";
import { CardTypeStatus } from "../CardGroup/CardType";
import CheckRandomNumber from "../common/CheckRandomNumber";
import { GameManager } from "./GameManager";
import CardMove from "../CardGroup/CardMove";
import { GAME_LISTEN_TO_EVENTS } from "../audio/config";
const { ccclass, property } = cc._decorator;
export class CardLog {
    public card: BaseCard;
    public cell: Cell;
    constructor(card: BaseCard, cell: Cell) {
        this.card = card;
        this.cell = cell;
    }
}
@ccclass
export default class Main extends cc.Component {
    @property(cc.Node)
    Temptransform: cc.Node = null;
    @property(cc.Prefab)
    CardPrefab: cc.Prefab = null;
    @property(cc.Node)
    StartPosition: cc.Node = null;
    @property(Cell)
    Cells: Cell[] = [];
    @property(FreeCell)
    FreeCell: FreeCell[] = [];
    @property(AceCell)
    AceCell: AceCell[] = [];
    @property(cc.Node)
    Cell_intermediary: cc.Node = null;
    private logs: Stack<CardLog>;
    private newGame: boolean = false;
    private isAuto: boolean = false;
    private gameData: GameData;
    private cards: BaseCard[];
    private cards_entermediary: BaseCard[];
    private ID_cell_old: number = 0;
    // LIFE-CYCLE CALLBACKS:
    //singleTon
    private static instance: Main | null = null;
    public static get Instance(): Main {
        if (this.instance == null) {
            this.instance = new Main();
        }
        return this.instance;
    }
    // onLoad () {}

    start() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.StartGame();
        // this.AddDataListener();
        this.EventRegister();

    }
    public EventRegister() {
        for (let i = 0; i < this.Cells.length; i++) {
            this.Cells[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_FOR_CARD_INTERMEDIARY, this.GetDataForCardsEntermediary, this);
        }
        this.Cell_intermediary.on(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN, this.SetInputCardsEnterCellOld, this);
    }
    protected onDisable(): void {
        for (let i = 0; i < this.Cells.length; i++) {
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_FOR_CARD_INTERMEDIARY);
        }
        this.Cell_intermediary.off(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN);
    }
    StartGame() {
        console.log("new game");
        this.InitCellID();
        if (this.newGame || !this.LoadGame()) {
            this.InitCards();
            this.Shuffle();
            this.DealCard();
        }
        this.newGame = false;
        this.isAuto = false;
    }
    public InitCellID()// khởi tạo ID cho từng nhóm cell
    {
        for (let i = 0; i < this.Cells.length; i++) {
            this.Cells[i].id = i;// ID cells tư 0 đến 7;
        }
        for (let i = 0; i < this.FreeCell.length; i++) {
            this.FreeCell[i].id = i + 8; // ID freeCell từ 8 đến 11
        }
        for (let i = 0; i < this.AceCell.length; i++) {
            this.AceCell[i].id = i + 12;// ID aceCells từ 12 đến 15;
        }
    }
    public MaxMovableCard(): number {
        let f = 0;
        let c = 0;
        for (let i = 0; i < this.FreeCell.length; i++) {
            c += this.FreeCell[i].getFree() ? 1 : 0;
        }
        for (let i = 0; i < this.Cells.length; i++) {
            f += this.Cells[i].getFree() ? 1 : 0;
        }

        const result = f === 0 ? c + 1 : (c + 1) * Math.round(Math.pow(2, f));
        return result;
    }
    public Log(card: BaseCard, cell: Cell) {
        this.logs = new Stack<CardLog>;
        this.logs.push(new CardLog(card, cell));
    }
    public SaveGame(): SaveData {
        let save: SaveData;
        save = new SaveData();
        for (let i = 0; i < this.Cells.length; i++) // Cell
        {
            for (let j = 0; j < this.Cells[i].Length(); j++) {
                save.AddCardInfor_Arr(this.Cells[i][j].GetCardInfo());
            }
        }
        for (let i = 0; i < this.FreeCell.length; i++) // FCell
        {
            for (let j = 0; j < this.FreeCell[i].Length(); j++) {
                save.AddCardInfor_Arr(this.FreeCell[i][j].GetCardInfo());
            }
        }
        for (let i = 0; i < this.AceCell.length; i++) // ACell
        {
            for (let j = 0; j < this.AceCell[i].Length(); j++) {
                save.AddCardInfor_Arr(this.AceCell[i][j].GetCardInfo());
            }
        }
        save.Init(this.gameData.score, this.gameData.time, this.gameData.move, this.gameData.undo, this.gameData.hint);
        return save;
    }
    public LoadGame(): boolean {
        let loadData: SaveData
        loadData = GameSave.Instance.LoadGame();
        if (loadData != null) {
            for (let i = 0; i < loadData.Count(); i++) {
                let cardNode = cc.instantiate(this.CardPrefab);
                if (cardNode) {
                    cardNode.position = this.StartPosition.position;
                    this.Temptransform.addChild(cardNode);
                    let card = cardNode.getComponent(BaseCard);
                    if (card) {
                        card.Init(loadData.infos[i].numberIndex, loadData.infos[i].type, this.Temptransform, this);
                    }
                    let cell = this.ParseCell(loadData.infos[i].cell);
                    cell.Add(card);
                }
            }
            this.gameData = new GameData();
            this.gameData.Init(loadData.score, loadData.time, loadData.move, loadData.undo, loadData.hint);
            return true;
        }
        return false;
    }
    public ParseCell(i: number): Cell {
        if (i < 8) {
            return this.Cells[i];
        }
        else if (i < 12) {
            return this.FreeCell[i - 8];
        }
        else {
            return this.AceCell[i - 12];
        }
    }
    public InitCards()//khoi tao 52 lá bài tương ứng với id mỗi lá từ 1 - 52, sau đó add vào list<BaseCard>
    {
        if (!this.cards) {
            this.cards = [];
        }
        this.cards.splice(0, this.cards.length);

        for (let i = 1; i < 14; i++) {
            for (let j = 0; j < 4; j++) {
                let cardNode = cc.instantiate(this.CardPrefab);
                if (cardNode) {
                    cardNode.position = this.StartPosition.position;
                    this.Temptransform.addChild(cardNode);
                    let card = cardNode.getComponent(BaseCard);
                    if (card) {
                        card.Init(i, j, this.Temptransform, this);
                    }
                    this.cards.push(card);
                }
            }
        }
        let childs = this.Temptransform.children;
    }
    public Shuffle() {
        this.cards = this.cards !== null && this.cards !== undefined ? this.cards : this.cards = [];
        let n = this.cards.length;
        while (n >= 1) {
            let k = CheckRandomNumber.Instance.getRandomValidNumber(0, n);
            n--;
            let value = this.cards[k];
            this.cards[k] = this.cards[n];
            this.cards[n] = value;
        }
        for (let i = this.cards.length - 1; i >= 0; i--) {
            let cardNode = this.cards[i].node;
            if (this.cards[i].node.parent) {
                this.cards[i].node.removeFromParent();
            }
            this.StartPosition.addChild(this.cards[i].node);
            this.cards[i].node.setPosition(0, 0);
        }
    }
    public DealCard()//phát bài 
    {
        // GameManager.Instance.ShowLoading();
        // SoundManager.Instance.OnPlaySound("deal");
        this.AnimateDeal(0);
    }
    public AnimateDeal(i: number)// hoạt động phát bài
    {
        if (i >= this.cards.length) {
            // GameManager.Instance.CloseLoading();
            return;
        }
        let worldPosition: cc.Vec3;
        let n = i % this.Cells.length;
        if (this.Cells[n].TopCard()) {
            worldPosition = this.Cells[n].TopCard().node.parent.convertToWorldSpaceAR(this.Cells[n].TopCard().node.position);
        } else {
            worldPosition = this.Cells[n].node.parent.convertToWorldSpaceAR(this.Cells[n].node.position);
        }
        let localTargetPosition = this.cards[i].node.parent.convertToNodeSpaceAR(worldPosition);
        cc.tween(this.cards[i].node)
            .to(0.1, { position: new cc.Vec3(localTargetPosition) })
            .call(() => {
                this.Cells[i % this.Cells.length].Add(this.cards[i]);
                this.AnimateDeal(i + 1);
            })
            .start();
    }
    GetDataForCardsEntermediary(base_card: BaseCard[], ID_cell: number) {
        this.ID_cell_old = ID_cell;
        console.log("id cell old", this.ID_cell_old);
        this.cards_entermediary = [];
        for (let i = 0; i < base_card.length; i++) {
            this.cards_entermediary.push(base_card[i]);
        }
        console.log(this.cards_entermediary);
        if (this.cards_entermediary) {
            this.SetDataToCardIntermediary();
        }
    }
    SetDataToCardIntermediary() {
        let worldPositionCard = this.cards_entermediary[0].node.parent.convertToWorldSpaceAR(this.cards_entermediary[0].node.position);
        let localPositionCard_entermediary = this.Cell_intermediary.parent.convertToNodeSpaceAR(worldPositionCard);
        this.Cell_intermediary.setPosition(localPositionCard_entermediary.x, localPositionCard_entermediary.y + 55);
        this.Cell_intermediary.setSiblingIndex(10);
        for (let i = 0; i < this.cards_entermediary.length; i++) {
            this.Cell_intermediary.getComponent(Cell).Add_cardEntermediary(this.cards_entermediary[i], this.ID_cell_old);
        }
    }
    SetInputCardsEnterCellOld(id_CellOld: number) {
        this.ID_cell_old = id_CellOld;
        let childs = this.Cell_intermediary.children;
        let test = [];
        for (let i = 0; i < childs.length; i++) {
            this.Cells[this.ID_cell_old].Add_InputCardsEnterCellOld(childs[i].getComponent(BaseCard));
            test.push(childs[i])
        }
        this.Cell_intermediary.removeAllChildren();
        for (let i = 0; i < test.length; i++) {
            console.log("add children ", i);
            this.Cells[this.ID_cell_old].node.addChild(test[i]);
            this.Cells[this.ID_cell_old].SetPositionAllChildsAndOffActive();
        }
        console.log("cell old", this.Cells[this.ID_cell_old].node.children);
    }
}

