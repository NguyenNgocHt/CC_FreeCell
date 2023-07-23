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
    private logs: Stack<CardLog>;
    private newGame: boolean = false;
    private isAuto: boolean = false;
    private gameData: GameData;
    private cards: BaseCard[];
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
        this.StartGame();
        // this.AddDataListener();
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
                    cardNode.setContentSize(85, 110);
                    cardNode.setScale(0.5, 0.5, 0.5);
                    this.Temptransform.addChild(cardNode);
                    let card = cardNode.getComponent(BaseCard);
                    if (card) {
                        card.Init(i, j, this.Temptransform, this);
                    }
                    this.cards.push(card);
                }
            }
        }
    }
    public Shuffle() {
        console.log("Bat dau trao bai");
        this.cards = this.cards !== null && this.cards !== undefined ? this.cards : this.cards = [];
        let n = this.cards.length;
        while (n >= 1) {
            console.log("trao bai");
            let k = CheckRandomNumber.Instance.getRandomValidNumber(0, n);
            n--;
            let value = this.cards[k];
            this.cards[k] = this.cards[n];
            this.cards[n] = value;
        }
        for (let i = 0; i < this.cards.length; i++) {
            console.log(this.cards[i]);
            console.log(this.cards[i].node.position);
        }
        for (let i = this.cards.length - 1; i >= 0; i--) {
            let cardNode = this.cards[i].node;
            if (cardNode.parent) {
                cardNode.removeFromParent();
            }
            this.StartPosition.addChild(this.cards[i].node);
            this.cards[i].node.setPosition(0, 0);
            this.cards[i].node.setScale(0.5, 0.5, 0.5);
            console.log("add child lan " + `${i}`, i);
        }
        console.log("da nhay vao day");
    }
    public DealCard()//phát bài 
    {
        // GameManager.Instance.ShowLoading();
        // SoundManager.Instance.OnPlaySound("deal");
        this.AnimateDeal(0);
    }
    public AnimateDeal(i: number)// hoạt động phát bài
    {
        console.log("chia bai");
        if (i >= this.cards.length) {
            // GameManager.Instance.CloseLoading();// nếu mà i >= lượng quân bài trên bàn thì return không làm gi hết
            return;
        }
        console.log("chia bai start");
        let Position: cc.Vec3;
        let worldPosition: cc.Vec3;
        //nếu như i < só lượng quân bài thì cho phép chia bài
        let n = i % this.Cells.length;// n bắt đầu từ 0 sau một vong i chạy từ 0 đến 7 thì n tăng lên 1 vậy list cell sẽ chạy từ n = 0 cho đến n = 7;
        // worldPosition = this.Cells[n].TopCard() == null ? this.Cells[n].node.position : this.Cells[n].TopCard().node.position;
        if (this.Cells[n].TopCard()) {
            Position = this.Cells[n].TopCard().node.position;
            worldPosition = this.Cells[n].TopCard().node.parent.convertToWorldSpaceAR(this.Cells[n].TopCard().node.position);
        } else {
            Position = this.Cells[n].node.position;
            worldPosition = this.Cells[n].node.parent.convertToWorldSpaceAR(this.Cells[n].node.position);
        }
        let localTargetPosition = this.cards[i].node.parent.convertToNodeSpaceAR(worldPosition);
        console.log("position start", Position);
        console.log("world position start", worldPosition);
        console.log(this.Cells[n].node.position);
        cc.tween(this.cards[i].node)
            .to(0.1, { position: new cc.Vec3(localTargetPosition) })
            .call(() => {
                let cardNode = this.cards[i].node;
                if (cardNode.parent) {
                    cardNode.removeFromParent();
                }
                this.Cells[i % this.Cells.length].Add(this.cards[i]);
                this.AnimateDeal(i + 1);
            })
            .start();
    }
}
