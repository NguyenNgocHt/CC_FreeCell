// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
import Cell from "../cellGroup/Cell";
import FreeCell from "../cellGroup/FreeCell";
import AceCell from "../cellGroup/AceCell";
import { BaseCard } from "../CardGroup/BaseCard";
import { GameSave, SaveData } from "../gameData/SaveData";
import GameData from "../gameData/GameData";
import { CardTypeStatus } from "../CardGroup/CardType";
import CheckRandomNumber from "../common/CheckRandomNumber";
import { GameManager } from "./GameManager";
import CardMove from "../CardGroup/CardMove";
import { GAME_LISTEN_TO_EVENTS } from "../audio/config";
import CellMove from "../cellGroup/CellMove";
import CardColliders from "../CardGroup/CardColliders";
import singleTon from "./Sigleton";
import TopGroupManager from "../topGroup/TopGroupManager";
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
    TopManager: cc.Node = null;
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
    @property(cc.Node)
    AceCell: cc.Node[] = [];
    @property(cc.Node)
    Cell_intermediary: cc.Node = null;
    private logs: Stack<CardLog>;
    private newGame: boolean = false;
    private isAuto: boolean = false;
    private gameData: GameData = new GameData();
    private cards: BaseCard[];
    private cards_entermediary: BaseCard[];
    private ID_cell_old: number = 0;
    private CounMovingAcecell: number = 0;
    private isMovingFreecell: boolean;
    private singleTon: singleTon = null;
    private GameDataStack: SaveData[] = [];
    private currentGameStateIndex: number = -1;
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
    protected onLoad(): void {
    }
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
            this.Cells[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD, this.SetCardsCollider, this);
            this.Cells[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_BUTTON_RIGHT, this.CheckAceCell_inputCards, this);
            this.Cells[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_REMOVE_CARD_FREECELL, this.RemoveCardFreeCell, this);
            this.Cells[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_CHECK_CHILDS_FOR_CELL, this.CheckChildsIncell, this);
            this.Cells[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_DELETE_COLLIDER_CHILD_NODE, this.DeleteColliderNodeInCell, this);
            this.Cells[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_UPDATE_COUNT_MOVE, this.UpdateCountMove, this);
        }
        this.Cell_intermediary.on(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN, this.SetInputCardsEnterCellOld, this);
        this.Cell_intermediary.on(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD, this.SetCardsCollider, this);
        this.Cell_intermediary.on(GAME_LISTEN_TO_EVENTS.DATA_UPDATE_COUNT_MOVE, this.UpdateCountMove, this);
    }
    protected onDisable(): void {
        for (let i = 0; i < this.Cells.length; i++) {
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_FOR_CARD_INTERMEDIARY);
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD);
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_BUTTON_RIGHT);
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_REMOVE_CARD_FREECELL);
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_CHECK_CHILDS_FOR_CELL);
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_DELETE_COLLIDER_CHILD_NODE);
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_UPDATE_COUNT_MOVE);
        }
        this.Cell_intermediary.off(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN);
        this.Cell_intermediary.off(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD);
        this.Cell_intermediary.off(GAME_LISTEN_TO_EVENTS.DATA_UPDATE_COUNT_MOVE);
    }
    StartGame() {
        console.log("new game");
        this.InitCellID();
        if (this.newGame || !this.LoadGame()) {
            this.InitTypeAceCell();
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
            this.AceCell[i].getComponent(AceCell).id = i + 12;// ID aceCells từ 12 đến 15;
        }
    }
    public InitTypeAceCell() {
        console.log(this.AceCell);
        for (let i = 0; i < this.AceCell.length; i++) {
            this.AceCell[i].getComponent(AceCell).InitAceCell(i);
        }
        console.log(this.AceCell);
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
            let chidls = this.Cells[i].node.children;
            for (let j = 0; j < chidls.length; j++) {
                save.AddCardInfor_Arr(chidls[j].getComponent(BaseCard).GetCardInfo());
            }
            // for (let j = 0; j < this.Cells[i].Length(); j++) {

            //     save.AddCardInfor_Arr(this.Cells[i][j].GetCardInfo());
            // }
        }
        for (let i = 0; i < this.FreeCell.length; i++) // FCell
        {
            let chidls = this.FreeCell[i].node.children;
            for (let j = 0; j < chidls.length; j++) {
                save.AddCardInfor_Arr(chidls[j].getComponent(BaseCard).GetCardInfo());
            }
            // for (let j = 0; j < this.FreeCell[i].Length(); j++) {
            //     save.AddCardInfor_Arr(this.FreeCell[i][j].GetCardInfo());
            // }
        }
        for (let i = 0; i < this.AceCell.length; i++) // ACell
        {
            let chidls = this.AceCell[i].children;
            for (let j = 0; j < chidls.length; j++) {
                save.AddCardInfor_Arr(chidls[j].getComponent(BaseCard).GetCardInfo());
            }
            // for (let j = 0; j < this.AceCell[i].getComponent(AceCell).Length(); j++) {
            //     save.AddCardInfor_Arr(this.AceCell[i][j].GetCardInfo());
            // }
        }
        save.Init(this.gameData.score, this.gameData.time, this.gameData.move, this.gameData.undo, this.gameData.hint);
        return save;
    }
    public LoadGame(): boolean {
        // let loadData: SaveData
        // loadData = GameSave.Instance.LoadGame();
        // if (loadData != null) {
        //     for (let i = 0; i < loadData.Count(); i++) {
        //         let cardNode = cc.instantiate(this.CardPrefab);
        //         if (cardNode) {
        //             cardNode.position = this.StartPosition.position;
        //             this.Temptransform.addChild(cardNode);
        //             let card = cardNode.getComponent(BaseCard);
        //             if (card) {
        //                 card.Init(loadData.infos[i].numberIndex, loadData.infos[i].type, this.Temptransform, this);
        //             }
        //             let cell = this.ParseCell(loadData.infos[i].cell);
        //             cell.Add(card);
        //         }
        //     }
        //     this.gameData = new GameData();
        //     this.gameData.Init(loadData.score, loadData.time, loadData.move, loadData.undo, loadData.hint);
        //     return true;
        // }
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
            return this.AceCell[i - 12].getComponent(AceCell);
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
            this.SetCardsCollider();
            this.TopManager.getComponent(TopGroupManager).SettimerStart(true);
            this.GetDataGame();
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
    public GetDataForCardsEntermediary(base_card: BaseCard[], ID_cell: number) {
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
    public SetDataToCardIntermediary() {
        let worldPositionCard = this.cards_entermediary[0].node.parent.convertToWorldSpaceAR(this.cards_entermediary[0].node.position);
        let localPositionCard_entermediary = this.Cell_intermediary.parent.convertToNodeSpaceAR(worldPositionCard);
        this.Cell_intermediary.setPosition(localPositionCard_entermediary.x, localPositionCard_entermediary.y + 55);
        this.Cell_intermediary.setSiblingIndex(10);
        this.Cell_intermediary.getComponent(Cell).Cards_intermediaryInput = [];
        this.Cell_intermediary.getComponent(Cell).Set_positionCell_intermediary(this.Cell_intermediary.position);
        for (let i = 0; i < this.cards_entermediary.length; i++) {
            this.Cell_intermediary.getComponent(Cell).Add_cardEntermediary(this.cards_entermediary[i], this.ID_cell_old);
        }
    }
    public SetInputCardsEnterCellOld(id_CellOld: number) {
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
    public SetCardsCollider() {
        for (let i = 0; i < this.Cells.length; i++) {
            this.Cells[i].AddColliderCards_gameStart();
        }
        for (let i = 0; i < this.FreeCell.length; i++) {
            this.FreeCell[i].AddColliderCards_gameStart();
        }
    }
    public CheckAceCell_inputCards(idCellBottom: number, indexCard: number) {
        let Cell_child: cc.Node[] = [];
        if (idCellBottom == 10 || idCellBottom == 11 || idCellBottom == 12 || idCellBottom == 13) {
            Cell_child = this.FreeCell[idCellBottom].node.children;
        } else {
            Cell_child = this.Cells[idCellBottom].node.children;
        }
        let baseCard = Cell_child[indexCard].getComponent(BaseCard);
        console.log('no day roi', baseCard);
        this.InitTypeAceCell();
        for (let i = 0; i < this.AceCell.length; i++) {
            console.log("nhay vao day", this.AceCell[i].getComponent(AceCell));
            if (this.AceCell[i].getComponent(AceCell).cards.length == 0) {
                if (baseCard.type == this.AceCell[i].getComponent(AceCell).CardTypeGroup &&
                    baseCard.number_index == 1) {
                    this.CounMovingAcecell++;
                    this.TopManager.getComponent(TopGroupManager).InitScore(baseCard.number_index);
                    this.TopManager.getComponent(TopGroupManager).ShowCountMove(1);
                    let worldPosAceCell = this.AceCell[i].parent.convertToWorldSpaceAR(this.AceCell[i].position);
                    let PosAceCellConvertToCard = baseCard.node.parent.convertToNodeSpaceAR(worldPosAceCell);
                    baseCard.node.getChildByName("CardCollider").removeComponent(CardColliders);
                    cc.tween(baseCard.node)
                        .to(0.1, { position: new cc.Vec3(PosAceCellConvertToCard) })
                        .call(() => {
                            this.AceCell[i].getComponent(AceCell).Add(baseCard);
                            this.GetDataGame();
                            this.Cells[idCellBottom].ResetCardsIndex();
                            this.Cells[idCellBottom].EmitCheckChildsInCell(idCellBottom);
                            if (idCellBottom == 10 || idCellBottom == 11 || idCellBottom == 12 || idCellBottom == 13) {
                                this.FreeCell[idCellBottom].ResetCardsIndex();
                                this.CheckChildsIncell(idCellBottom);
                                this.RemoveCardFreeCell(idCellBottom);
                            } else {
                                this.Cells[idCellBottom].ResetCardsIndex();
                                this.CheckChildsIncell(idCellBottom);
                            }
                        })
                        .start();
                }
            }
            else if (this.AceCell[i].getComponent(AceCell).cards.length >= 1) {
                if (baseCard.type == this.AceCell[i].getComponent(AceCell).CardTypeGroup &&
                    this.AceCell[i].getComponent(AceCell).GetBaseCardForEndOfArr().number_index == baseCard.number_index - 1) {
                    this.TopManager.getComponent(TopGroupManager).InitScore(baseCard.number_index);
                    this.TopManager.getComponent(TopGroupManager).ShowCountMove(1);
                    this.CounMovingAcecell++;
                    let worldPosAceCell = this.AceCell[i].parent.convertToWorldSpaceAR(this.AceCell[i].position);
                    let PosAceCellConvertToCard = baseCard.node.parent.convertToNodeSpaceAR(worldPosAceCell);
                    baseCard.node.getChildByName("CardCollider").removeComponent(CardColliders);
                    cc.tween(baseCard.node)
                        .to(0.1, { position: new cc.Vec3(PosAceCellConvertToCard) })
                        .call(() => {
                            this.AceCell[i].getComponent(AceCell).Add(baseCard);
                            this.GetDataGame();
                            if (idCellBottom == 10 || idCellBottom == 11 || idCellBottom == 12 || idCellBottom == 13) {
                                this.FreeCell[idCellBottom].ResetCardsIndex();
                                this.CheckChildsIncell(idCellBottom);
                                this.RemoveCardFreeCell(idCellBottom);
                            } else {
                                this.Cells[idCellBottom].ResetCardsIndex();
                                this.CheckChildsIncell(idCellBottom);
                            }

                            console.log("add được");
                        })
                        .start();
                }
            }
        }
        if (this.CounMovingAcecell == 0) {
            console.log("add free cell");
            this.CardMoveToInputFreeCell(baseCard, idCellBottom);
        } else {
            this.CounMovingAcecell = 0;
        }
    }
    public CardMoveToInputFreeCell(baseCard: BaseCard, IDCellBottom: number) {
        for (let i = 0; i < this.FreeCell.length; i++) {
            console.log("free cell", this.FreeCell[i]);
            if (this.FreeCell[i].cards.length == 0) {
                let worldPosFreeCell = this.FreeCell[i].node.parent.convertToWorldSpaceAR(this.FreeCell[i].node.position);
                let converToLocalCard = baseCard.node.parent.convertToNodeSpaceAR(worldPosFreeCell);
                baseCard.node.getChildByName("CardCollider").removeComponent(CardColliders);
                cc.tween(baseCard.node)
                    .to(0.1, { position: new cc.Vec3(converToLocalCard) })
                    .call(() => {
                        this.FreeCell[i].Add(baseCard);
                        this.Cells[IDCellBottom].ResetCardsIndex();
                        this.Cells[IDCellBottom].EmitCheckChildsInCell(IDCellBottom);
                        this.SetCardsCollider();
                        this.TopManager.getComponent(TopGroupManager).ShowCountMove(1);
                        this.GetDataGame();
                    })
                    .start();
                break;
            } else {
                this.Cells[IDCellBottom].ResetCardsIndex();
                this.Cells[IDCellBottom].EmitCheckChildsInCell(IDCellBottom);
                this.SetCardsCollider();
            }
        }
    }
    public RemoveCardFreeCell(tagCell: number) {
        console.log("giet thang nay", tagCell);
        for (let i = 0; i < this.FreeCell.length; i++) {
            if (this.FreeCell[i].Tag == tagCell) {
                this.FreeCell[i].RemoveCards_freecell();
                if (this.FreeCell[i].cards.length == 0) {
                    console.log(this.FreeCell[i].cards);
                }
            }
        }
    }
    public CheckChildsIncell(tagCell: number) {
        console.log("kiem tra thang nay");
        for (let i = 0; i < this.Cells.length; i++) {
            if (this.Cells[i].node.children.length === 0) {
                console.log("ep cho thằng này một cái collider vào mồm");
                this.Cells[i].RemoveCards_cell();
                let colliderNode = cc.instantiate(this.CardPrefab);
                if (colliderNode) {
                    colliderNode.position = this.Cells[i].node.position;
                    this.Cells[i].node.addChild(colliderNode);
                    colliderNode.setPosition(0, -30);
                    colliderNode.addComponent(CardColliders);
                    colliderNode.name = "ColliderNode";
                    // colliderNode.addComponent(BaseCard);
                    colliderNode.getComponent(BaseCard).tag_group = this.Cells[i].Tag;
                    let childs = this.Cells[i].node.children;
                    console.log(this.Cells[i].node.children);
                }
            }
        }
    }
    public DeleteColliderNodeInCell(tagCell: number) {
        console.log("delete collider node for cell");
        for (let i = 0; i < this.Cells.length; i++) {
            if (this.Cells[i].Tag == tagCell) {
                let colliderNode = this.Cells[i].node.getChildByName("ColliderNode");
                this.Cells[i].node.removeChild(colliderNode);
            }
        }
    }
    //*******************************************SET UNDO***************************************************//
    UpdateCountMove() {
        console.log("an 1 diem vao mom");
        this.TopManager.getComponent(TopGroupManager).ShowCountMove(1);
        this.GetDataGame();
    }
    GetDataGame() {
        this.currentGameStateIndex++;
        console.log(this.TopManager.getComponent(TopGroupManager).Game_Data);
        let data_game = this.TopManager.getComponent(TopGroupManager).Game_Data;
        if (data_game) {
            this.gameData.Init(data_game.score, data_game.time, data_game.move, data_game.undo, data_game.hint);
        }
        let saveGame = this.SaveGame();
        this.GameDataStack.push(saveGame);
        console.log(this.GameDataStack);
    }
    LoadEndShowGameData(saveGameData: SaveData) {
        this.RemoveAllChildsInCells();
        console.log("load game data");
        for (let i = 0; i < saveGameData.Count(); i++) {
            let cardNode = cc.instantiate(this.CardPrefab);
            if (cardNode) {
                cardNode.position = this.StartPosition.position;
                this.Temptransform.addChild(cardNode);
                let card = cardNode.getComponent(BaseCard);
                if (card) {
                    card.Init(saveGameData.infos[i].numberIndex, saveGameData.infos[i].type, this.Temptransform, this);
                }
                let cell = this.ParseCell(saveGameData.infos[i].cell);
                cell.Add(card);
            }
        }
        this.gameData = new GameData();
        this.gameData.Init(saveGameData.score, saveGameData.time, saveGameData.move, saveGameData.undo, saveGameData.hint);
        this.SetCardsCollider();
        this.UpdateTopGroup(saveGameData);
        console.log("saveGameData", this.GameDataStack);
    }
    //undo onclick button
    public onUndoButtonClick() {
        console.log("gamedata leght", this.GameDataStack.length)
        console.log("onclick to main");
        if (this.GameDataStack.length > 1) {
            let gameData = this.GameDataStack[this.GameDataStack.length - 2]
            console.log("gamedata > 1", gameData)
            this.GameDataStack.pop();
            this.LoadEndShowGameData(gameData);
        } else if (this.GameDataStack.length == 1) {
            console.log("gamedata = 1", this.GameDataStack[0])
            this.LoadEndShowGameData(this.GameDataStack[0]);
        }
    }
    RemoveAllChildsInCells() {
        for (let i = 0; i < this.Cells.length; i++) {
            this.Cells[i].RemoveAllChildsAndCard();
        }
        for (let i = 0; i < this.FreeCell.length; i++) {
            this.FreeCell[i].RemoveAllChildsAndCard();
        }
        for (let i = 0; i < this.AceCell.length; i++) {
            this.AceCell[i].getComponent(AceCell).RemoveAllChildsAndCard();
        }
    }
    UpdateTopGroup(saveGameData: SaveData) {
        this.TopManager.getComponent(TopGroupManager).initAllInfo(saveGameData.score, saveGameData.move);
    }
    //****************************************SET HIND********************************************//
    //cell with cell
    public CheckHindCellWithCell() {
        let cardsComparison: BaseCard[] = [];
        for (let i = 0; i < this.Cells.length; i++) {
            cardsComparison = this.Cells[i].CheckConsecutiveCards();
            if (cardsComparison) {
                console.log("tim duoc em để anh mang đi bán rồi ", cardsComparison);
                for (let j = 0; j < cardsComparison.length; j++) {
                    cardsComparison[j].Select(true);
                }
                this.CheckCardInAllCell(cardsComparison[0]);
            }
        }
        this.CheckCardWithCard();
        this.CheckCellWithAceCells();
        this.CheckCellWithFreeCells();
        this.CheckFreeCellWithCells();
        this.CheckFreeCellWithAceCell();
    }
    CheckCardInAllCell(cardCheck: BaseCard) {
        for (let i = 0; i < this.Cells.length; i++) {
            let CardTopCells = this.Cells[i].GetTopCell();
            if (this.Cells[i].Tag != cardCheck.tag_group && CardTopCells.number_index - 1 == cardCheck.number_index) {
                if (((CardTopCells.type == CardTypeStatus.CLUB || CardTopCells.type == CardTypeStatus.SPADE) &&
                    (cardCheck.type == CardTypeStatus.DIAMOND || cardCheck.type == CardTypeStatus.HEART)) ||
                    ((CardTopCells.type == CardTypeStatus.DIAMOND || CardTopCells.type == CardTypeStatus.HEART) &&
                        (cardCheck.type == CardTypeStatus.CLUB || cardCheck.type == CardTypeStatus.SPADE))) {
                    console.log("may gan vao em nay");
                    CardTopCells.Select(true);
                }
            } else {
                console.log("khong co dau em oi");
            }
        }
    }
    CheckCardWithCard() {
        for (let i = 0; i < this.Cells.length - 1; i++) {
            let cardTopInCell_A = this.Cells[i].GetTopCell();
            for (let j = 1; j < this.Cells.length; j++) {
                let cardTopInCell_B = this.Cells[j].GetTopCell();
                if (cardTopInCell_A.tag_group != cardTopInCell_B.tag_group &&
                    (cardTopInCell_A.number_index - 1 == cardTopInCell_B.number_index ||
                        cardTopInCell_A.number_index == cardTopInCell_B.number_index - 1)) {
                    if (((cardTopInCell_A.type == CardTypeStatus.CLUB || cardTopInCell_A.type == CardTypeStatus.SPADE) &&
                        (cardTopInCell_B.type == CardTypeStatus.DIAMOND || cardTopInCell_B.type == CardTypeStatus.HEART)) ||
                        ((cardTopInCell_A.type == CardTypeStatus.DIAMOND || cardTopInCell_A.type == CardTypeStatus.HEART) &&
                            (cardTopInCell_B.type == CardTypeStatus.CLUB || cardTopInCell_B.type == CardTypeStatus.SPADE))) {
                        console.log("may gan vao em nay");
                        cardTopInCell_A.Select(true);
                        cardTopInCell_B.Select(true);
                    }
                } else {
                    console.log("khong co dau em oi");
                }
            }
        }
    }
    //cell with freeCell
    CheckCellWithFreeCells() {

    }
    //cell with aceCell
    CheckCellWithAceCells() {

    }
    //free cell with cell
    CheckFreeCellWithCells() {

    }
    //free cell with aceCell
    CheckFreeCellWithAceCell() {

    }
}

