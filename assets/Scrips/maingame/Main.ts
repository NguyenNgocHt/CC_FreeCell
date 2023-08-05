
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
import { CHECK_CELL_STATUS, CHECK_GAME_STATUS, GAMEPLAY_STATUS, GAME_LISTEN_TO_EVENTS } from "../audio/config";
import CardColliders from "../CardGroup/CardColliders";
import TopGroupManager from "../topGroup/TopGroupManager";
import { GameControler } from "./GameControler";
import PlayAudio from "../audio/PlayAuido";
import AudioLoader from "../audio/AudioLoader";
import BottomGroupManager from "../bottomGroup/BottomGroupManager";
import LoadImages from "../common/LoadImages";
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
    Cell_intermediary_test: cc.Node = null;
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
    @property(cc.Node)
    BottomGroupNode: cc.Node = null;
    @property(cc.Node)
    BG: cc.Node = null;
    private logs: Stack<CardLog>;
    public newGame: boolean = false;
    private isAuto: boolean = false;
    private gameData: GameData = new GameData();
    private cards: BaseCard[];
    private cards_Initintermediary: BaseCard[];
    private cards_entermediary: BaseCard[];
    private ID_cell_old: number = 0;
    private CounMovingAcecell: number = 0;
    private Count_checkAceCell: number = 0;
    private isMovingFreecell: boolean;
    private GameDataStack: SaveData[] = [];
    private currentGameStateIndex: number = -1;
    private audioPlay: PlayAudio = null;
    private isHindAuto: boolean = false;
    private startTimer_autoHind: number = 0;
    private startTimer_loseGame_newGame: number = 0;
    private startTimer_loseGame_loading: number = 0;
    private countSetHindAuto: number = 0;
    private timeDelayShowHind: number = 3;
    private isPauseCountHindAuto: boolean = false;
    private saveData: SaveData;
    private isAceCell14_Full: boolean = false;
    private isAceCell15_full: boolean = false;
    private isAceCell16_Full: boolean = false;
    private isAceCell17_full: boolean = false;
    private CheckGameState: CHECK_GAME_STATUS = CHECK_GAME_STATUS.NO_STATUS;
    private Check_CardsWithAllcell: boolean;
    private Check_cardWithCardInCells: boolean;
    private Check_cellWithfreeCell: boolean;
    private Check_cellWithAceCell: boolean;
    private Check_freeCellWithCell: boolean;
    private Check_freeCellWithAceCell: boolean;
    private check_cell_State: CHECK_CELL_STATUS = CHECK_CELL_STATUS.NO_STATUS;
    private count_checkCellWithCell: number = 0;
    private gamePlayState: GAMEPLAY_STATUS = GAMEPLAY_STATUS.NO_STATUS;
    private isLoseGame_newGame: boolean = false;
    private isLoseGame_loadinggame: boolean = false;
    private pointWinGames: number[] = [];
    private count_CheckCardWithCardInCell: number = 0;
    private PositionStartIndexPosition: number = 0;
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
        this.CheckSaveData();
        AudioLoader.preloadAllAudioClips(() => {
            cc.log("Đã tải xong toàn bộ âm thanh.");
            this.StartGame();
            this.PlayMusic();
        });
    }
    CheckSaveData() {
        let data = cc.sys.localStorage.getItem("GameScoreData");
        if (!data) {
            let a = 1;
            this.SavePointGame(a);
        }
    }
    start() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.EventRegister();
        this.audioPlay = this.node.getComponent(PlayAudio);
        this.PositionStartIndexPosition = this.StartPosition.getSiblingIndex();
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
            this.Cells[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_SETINDEX_CELL_TO_ORIGIN, this.SetIndexCellToOrigin, this);
        }
        for (let i = 0; i < this.FreeCell.length; i++) {
            this.FreeCell[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_BUTTON_RIGHT, this.CheckAceCell_inputCards, this);
            this.FreeCell[i].node.on(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD, this.SetCardsCollider, this);
        }
        this.Cell_intermediary.on(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN, this.SetInputCardsEnterCellOld, this);
        this.Cell_intermediary.on(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD, this.SetCardsCollider, this);
        this.Cell_intermediary.on(GAME_LISTEN_TO_EVENTS.DATA_UPDATE_COUNT_MOVE, this.UpdateCountMove, this);
        this.Cell_intermediary_test.on(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN, this.SetInputCardsEnterCellOld, this);
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
            this.Cells[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_SETINDEX_CELL_TO_ORIGIN);
        }
        for (let i = 0; i < this.FreeCell.length; i++) {
            this.FreeCell[i].node.off(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_BUTTON_RIGHT);
        }
        this.Cell_intermediary.off(GAME_LISTEN_TO_EVENTS.DATA_OUTPUT_CELL_MAIN);
        this.Cell_intermediary.off(GAME_LISTEN_TO_EVENTS.DATA_ONCLICK_CARD);
        this.Cell_intermediary.off(GAME_LISTEN_TO_EVENTS.DATA_UPDATE_COUNT_MOVE);
    }
    SaveDataGame() {
        this.saveData = this.SaveGame();
        let data = JSON.stringify(this.saveData, null, 2);
        cc.sys.localStorage.setItem("GamePlayData", data);
    }
    LoadDataGame(): SaveData {
        let data = localStorage.getItem("GamePlayData");
        if (data) {
            let gamedata = JSON.parse(data);
            return gamedata;
        }
        return null;
    }
    handleVisibilityChange() {
        if (document.hidden) {
            this.SaveDataGame();
        }
    }
    handleBeforeUnload() {
        this.SaveDataGame();
    }
    protected onDestroy(): void {
    }
    public StartGame() {
        this.InitCellID();
        if (this.newGame || !this.LoadGame()) {
            this.gamePlayState = GAMEPLAY_STATUS.NEW_GAME;
            this.InitTypeAceCell();
            this.InitCards();
            this.Shuffle();
            this.DealCard();
            this.startTimer_loseGame_newGame = new Date().getTime() / 1000;
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
        for (let i = 0; i < this.AceCell.length; i++) {
            this.AceCell[i].getComponent(AceCell).InitAceCell(i);
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
            let chidls = this.Cells[i].node.children;
            for (let j = 0; j < chidls.length; j++) {
                if (chidls[j].name != "ColliderNode") {
                    save.AddCardInfor_Arr(chidls[j].getComponent(BaseCard).GetCardInfo());
                }
            }
        }
        for (let i = 0; i < this.FreeCell.length; i++) // FCell
        {
            let chidls = this.FreeCell[i].node.children;
            for (let j = 0; j < chidls.length; j++) {
                if (chidls[j].name != "ColliderNode") {
                    save.AddCardInfor_Arr(chidls[j].getComponent(BaseCard).GetCardInfo());
                }
            }
        }
        for (let i = 0; i < this.AceCell.length; i++) // ACell
        {
            let chidls = this.AceCell[i].children;
            for (let j = 0; j < chidls.length; j++) {
                if (chidls[j].name != "ColliderNode") {
                    save.AddCardInfor_Arr(chidls[j].getComponent(BaseCard).GetCardInfo());
                }
            }
        }
        save.Init(this.gameData.score, this.gameData.time, this.gameData.move, this.gameData.undo, this.gameData.hint);
        return save;
    }
    public LoadGame(): boolean {
        let loadData: SaveData
        loadData = this.LoadDataGame();
        if (loadData != null) {
            this.RemoveAllChildsInCells();
            this.gamePlayState = GAMEPLAY_STATUS.LOADING_GAME;
            for (let i = 0; i < loadData.infos.length; i++) {
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
            this.UpdateTopGroup(loadData);
            this.CheckChildsIncell();
            this.GetDataGame();
            this.startTimer_loseGame_loading = new Date().getTime() / 1000;
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
    }
    public InitCell_Intermediary(cards: BaseCard[]) {
        if (!this.cards_Initintermediary) {
            this.cards_Initintermediary = [];
        }
        let tagCell = cards[0].tag_group;
        this.cards_Initintermediary.splice(0, this.cards_Initintermediary.length);
        this.Cell_intermediary_test.removeAllChildren();
        this.Cell_intermediary_test.getComponent(Cell).cards = [];
        for (let i = 0; i < cards.length; i++) {
            this.cards_Initintermediary.push(cards[i]);
        }
        for (let i = 0; i < this.cards_Initintermediary.length; i++) {
            let cardNode = cc.instantiate(this.CardPrefab);
            if (cardNode) {
                cardNode.position = this.Cell_intermediary_test.position;
                let card = cardNode.getComponent(BaseCard);
                if (card) {
                    card.Init(this.cards_Initintermediary[i].number_index, this.cards_Initintermediary[i].type, this.Cell_intermediary_test, this);
                }
                this.Cell_intermediary_test.getComponent(Cell).Add(card);
            }
        }
        this.Cell_intermediary_test.setPosition(0, -55);
        this.Cell_intermediary_test.getComponent(Cell).Set_positionCell_intermediary(this.Cell_intermediary_test.position);
        this.Cells[tagCell - 1].RemoveCards_intermediryOutput();
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
        this.AnimateDeal(0);
    }
    public AnimateDeal(i: number)// hoạt động phát bài
    {
        if (i >= this.cards.length) {
            this.SetCardsCollider();
            this.TopManager.getComponent(TopGroupManager).SettimerStart(true);
            this.GetDataGame();
            this.SaveDataGame();
            return;
        }
        PlayAudio.Instance.AudioEffect_deal();
        let worldPosition: cc.Vec3;
        let n = i % this.Cells.length;
        if (this.Cells[n].TopCard()) {
            worldPosition = this.Cells[n].TopCard().node.parent.convertToWorldSpaceAR(this.Cells[n].TopCard().node.position);
        } else {
            worldPosition = this.Cells[n].node.parent.convertToWorldSpaceAR(this.Cells[n].node.position);
        }
        let localTargetPosition = this.cards[i].node.parent.convertToNodeSpaceAR(worldPosition);
        cc.tween(this.cards[i].node)
            .to(0.05, { position: new cc.Vec3(localTargetPosition) })
            .call(() => {
                this.Cells[i % this.Cells.length].Add(this.cards[i]);
                this.AnimateDeal(i + 1);
            })
            .start();
    }
    public GetDataForCardsEntermediary(base_card: BaseCard[], ID_cell: number) {
        this.ID_cell_old = ID_cell;
        this.cards_entermediary = [];
        for (let i = 0; i < base_card.length; i++) {
            this.cards_entermediary.push(base_card[i]);
        }
        if (this.cards_entermediary) {
            this.SetDataToCardIntermediary();
            // this.SetDataToCardIntermediary_Test();
        }
    }
    SetDataToCardIntermediary_Test() {
        let worldPositionCard = this.cards_entermediary[0].node.parent.convertToWorldSpaceAR(this.cards_entermediary[0].node.position);
        let localPositionCard_entermediary_test = this.Cell_intermediary_test.parent.convertToNodeSpaceAR(worldPositionCard);
        this.Cell_intermediary_test.setPosition(localPositionCard_entermediary_test.x, localPositionCard_entermediary_test.y + 55);
        this.Cell_intermediary_test.setSiblingIndex(9);
        this.Cell_intermediary_test.getComponent(Cell).Cards_intermediaryInput = [];
        this.Cell_intermediary_test.getComponent(Cell).Set_positionCell_intermediary(this.Cell_intermediary_test.position);
        this.InitCell_Intermediary(this.cards_entermediary);

    }
    public SetDataToCardIntermediary() {
        let worldPositionCard = this.cards_entermediary[0].node.parent.convertToWorldSpaceAR(this.cards_entermediary[0].node.position);
        let localPositionCard_entermediary = this.Cell_intermediary.parent.convertToNodeSpaceAR(worldPositionCard);
        this.Cell_intermediary.setPosition(localPositionCard_entermediary.x, localPositionCard_entermediary.y + 55);
        this.Cell_intermediary.setSiblingIndex(9);
        this.Cell_intermediary.getComponent(Cell).Cards_intermediaryInput = [];
        this.Cell_intermediary.getComponent(Cell).Set_positionCell_intermediary(this.Cell_intermediary.position);
        for (let i = 0; i < this.cards_entermediary.length; i++) {
            this.Cell_intermediary.getComponent(Cell).Add_cardEntermediary(this.cards_entermediary[i], this.ID_cell_old);
        }
    }
    public SetInputCardsEnterCellOld(id_CellOld: number) {
        console.log("nhay vao day main");
        this.ID_cell_old = id_CellOld;
        let childs = this.Cell_intermediary.children;
        let test = [];
        for (let i = 0; i < childs.length; i++) {
            this.Cells[this.ID_cell_old].Add_InputCardsEnterCellOld(childs[i].getComponent(BaseCard));
            test.push(childs[i])
        }
        this.Cell_intermediary.removeAllChildren();
        for (let i = 0; i < test.length; i++) {
            this.Cells[this.ID_cell_old].node.addChild(test[i]);
            this.Cells[this.ID_cell_old].SetPositionAllChildsAndOffActive();
        }
    }
    public SetCardsCollider() {
        for (let i = 0; i < this.Cells.length; i++) {
            this.Cells[i].AddColliderCards_gameStart();
        }
        for (let i = 0; i < this.FreeCell.length; i++) {
            this.FreeCell[i].AddColliderCards_gameStart();
        }
        this.RemoveAllCardGlow()
    }
    public CheckAceCell_inputCards(TagCellBottom: number, indexCard: number) {
        let Cell_child: cc.Node[] = [];
        if (TagCellBottom == 10 || TagCellBottom == 11 || TagCellBottom == 12 || TagCellBottom == 13) {
            for (let i = 0; i < this.FreeCell.length; i++) {
                if (i == TagCellBottom - 10) {
                    Cell_child = this.FreeCell[i].node.children;
                }
            }
        } else {
            Cell_child = this.Cells[TagCellBottom - 1].node.children;
        }
        let baseCard = Cell_child[indexCard].getComponent(BaseCard);
        this.InitTypeAceCell();
        for (let i = 0; i < this.AceCell.length; i++) {
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
                            PlayAudio.Instance.AudioEffect_swap();
                            this.AceCell[i].getComponent(AceCell).Add(baseCard);
                            this.GetDataGame();
                            if (TagCellBottom == 10 || TagCellBottom == 11 || TagCellBottom == 12 || TagCellBottom == 13) {
                                this.FreeCell[TagCellBottom - 10].ResetCardsIndex();
                                this.RemoveCardFreeCell(TagCellBottom);
                            } else {
                                this.Cells[TagCellBottom - 1].ResetCardsIndex();
                                this.Cells[TagCellBottom - 1].EmitCheckChildsInCell(TagCellBottom);
                                this.Cells[TagCellBottom - 1].ResetCardsIndex();
                                this.CheckChildsIncell();
                                this.SetIndexCellToOrigin(TagCellBottom);
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
                            PlayAudio.Instance.AudioEffect_swap();
                            this.AceCell[i].getComponent(AceCell).Add(baseCard);
                            this.GetDataGame();
                            if (TagCellBottom == 10 || TagCellBottom == 11 || TagCellBottom == 12 || TagCellBottom == 13) {
                                this.FreeCell[TagCellBottom - 10].ResetCardsIndex();
                                this.RemoveCardFreeCell(TagCellBottom);
                            } else {
                                this.Cells[TagCellBottom - 1].ResetCardsIndex();
                                this.Cells[TagCellBottom - 1].EmitCheckChildsInCell(TagCellBottom);
                                this.Cells[TagCellBottom - 1].ResetCardsIndex();
                                this.CheckChildsIncell();
                                this.SetIndexCellToOrigin(TagCellBottom);
                            }
                        })
                        .start();
                }
            }
        }
        if (this.CounMovingAcecell == 0) {
            if (TagCellBottom == 1 || TagCellBottom == 2 || TagCellBottom == 3 || TagCellBottom == 4 ||
                TagCellBottom == 5 || TagCellBottom == 6 || TagCellBottom == 7 || TagCellBottom == 8)
                this.CardMoveToInputFreeCell(baseCard, TagCellBottom);
        } else {
            this.CounMovingAcecell = 0;
        }
    }
    public CardMoveToInputFreeCell(baseCard: BaseCard, TagCellBottom: number) {
        for (let i = 0; i < this.FreeCell.length; i++) {
            if (this.FreeCell[i].cards.length == 0) {
                let worldPosFreeCell = this.FreeCell[i].node.parent.convertToWorldSpaceAR(this.FreeCell[i].node.position);
                let converToLocalCard = baseCard.node.parent.convertToNodeSpaceAR(worldPosFreeCell);
                baseCard.node.getChildByName("CardCollider").removeComponent(CardColliders);
                cc.tween(baseCard.node)
                    .to(0.1, { position: new cc.Vec3(converToLocalCard) })
                    .call(() => {
                        PlayAudio.Instance.AudioEffect_swap();
                        this.FreeCell[i].Add(baseCard);
                        this.Cells[TagCellBottom - 1].ResetCardsIndex();
                        this.Cells[TagCellBottom - 1].EmitCheckChildsInCell(TagCellBottom);
                        this.SetCardsCollider();
                        this.TopManager.getComponent(TopGroupManager).ShowCountMove(1);
                        this.GetDataGame();
                        this.SetIndexCellToOrigin(TagCellBottom);
                    })
                    .start();
                break;
            } else {
                this.Cells[TagCellBottom - 1].ResetCardsIndex();
                this.Cells[TagCellBottom - 1].EmitCheckChildsInCell(TagCellBottom);
                this.SetCardsCollider();
                this.SetIndexCellToOrigin(TagCellBottom);
            }
        }
    }
    public RemoveCardFreeCell(tagCell: number) {
        for (let i = 0; i < this.FreeCell.length; i++) {
            if (this.FreeCell[i].Tag == tagCell) {
                this.FreeCell[i].RemoveCards_freecell();
                if (this.FreeCell[i].cards.length == 0) {
                }
            }
        }
    }
    public CheckChildsIncell() {
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                for (let i = 0; i < this.Cells.length; i++) {
                    if (this.Cells[i].node.children.length === 0) {
                        this.Cells[i].RemoveCards_cell();
                        let colliderNode = cc.instantiate(this.CardPrefab);
                        if (colliderNode) {
                            colliderNode.position = this.Cells[i].node.position;
                            this.Cells[i].node.addChild(colliderNode);
                            colliderNode.setPosition(0, -30);
                            colliderNode.addComponent(CardColliders);
                            colliderNode.name = "ColliderNode";
                            colliderNode.getComponent(BaseCard).tag_group = this.Cells[i].Tag;
                        }
                    }
                }
            })
            .start();
    }
    SetIndexCellToOrigin(tag_cell: number) {
        for (let i = 0; i < this.Cells.length; i++) {
            if (i == tag_cell - 1) {
                this.Cells[i].SetOriginCellIndex();
            }
        }
    }
    public DeleteColliderNodeInCell(tagCell: number) {
        for (let i = 0; i < this.Cells.length; i++) {
            if (this.Cells[i].Tag == tagCell) {
                let colliderNode = this.Cells[i].node.getChildByName("ColliderNode");
                this.Cells[i].node.removeChild(colliderNode);
            }
        }
    }
    //*******************************************SET UNDO***************************************************//
    UpdateCountMove() {
        this.TopManager.getComponent(TopGroupManager).ShowCountMove(1);
        this.GetDataGame();
    }
    GetDataGame() {
        this.Check_WINLOSE_game();
        this.currentGameStateIndex++;
        let data_game = this.TopManager.getComponent(TopGroupManager).Game_Data;
        if (data_game) {
            this.gameData.Init(data_game.score, data_game.time, data_game.move, data_game.undo, data_game.hint);
        }
        let saveGame = this.SaveGame();
        this.SaveDataGame();
        this.GameDataStack.push(saveGame);
        if (this.isHindAuto) {
            this.startTimer_autoHind = new Date().getTime() / 1000;
            this.isPauseCountHindAuto = true;
        }
    }
    LoadEndShowGameData(saveGameData: SaveData) {
        this.RemoveAllChildsInCells();
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
    }
    //undo onclick button
    public onUndoButtonClick() {
        if (this.GameDataStack.length > 1) {
            let gameData = this.GameDataStack[this.GameDataStack.length - 2]
            this.GameDataStack.pop();
            this.LoadEndShowGameData(gameData);
        } else if (this.GameDataStack.length == 1) {
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
        this.TopManager.getComponent(TopGroupManager).initAllInfo(saveGameData.score, saveGameData.move, saveGameData.time);
    }
    //****************************************SET HIND********************************************//
    //cell with cell
    public CheckHindCellWithCell() {
        this.CheckGameState = CHECK_GAME_STATUS.CHECK_HIND;
        this.CheckAllCell();
    }
    CheckAllCell() {
        let cardsComparison: BaseCard[] = [];
        for (let i = 0; i < this.Cells.length; i++) {
            cardsComparison = this.Cells[i].CheckConsecutiveCards();
            if (cardsComparison) {
                this.CheckCardInAllCell(cardsComparison);
            }
        }
        if (this.count_checkCellWithCell == 0) {
            this.Check_CardsWithAllcell = false;
        } else {
            this.count_checkCellWithCell = 0;
        }
        this.CheckCardWithCard();
        this.CheckCellWithAceCells();
        this.CheckCellWithFreeCells();
        this.CheckFreeCellWithCells();
        this.CheckFreeCellWithAceCell();
    }
    CheckCardInAllCell(cardsCheck: BaseCard[]) {
        let CardTopCells: BaseCard = new BaseCard();
        let cardCheck = cardsCheck[0];
        for (let i = 0; i < this.Cells.length; i++) {
            let chidls = this.Cells[i].node.children;
            let chidlsLength = chidls.length;
            if (chidlsLength > 0) {
                CardTopCells = chidls[chidlsLength - 1].getComponent(BaseCard);
            }
            if (this.Cells[i].Tag != cardCheck.tag_group && CardTopCells.number_index - 1 == cardCheck.number_index) {
                if (((CardTopCells.type == CardTypeStatus.CLUB || CardTopCells.type == CardTypeStatus.SPADE) &&
                    (cardCheck.type == CardTypeStatus.DIAMOND || cardCheck.type == CardTypeStatus.HEART)) ||
                    ((CardTopCells.type == CardTypeStatus.DIAMOND || CardTopCells.type == CardTypeStatus.HEART) &&
                        (cardCheck.type == CardTypeStatus.CLUB || cardCheck.type == CardTypeStatus.SPADE))) {
                    if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_HIND) {
                        this.count_checkCellWithCell++;
                        CardTopCells.Select(true);
                        for (let j = 0; j < cardsCheck.length; j++) {
                            cardsCheck[j].Select(true);
                        }
                    }
                    else if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_LOSE) {
                        this.count_checkCellWithCell++;
                        this.Check_CardsWithAllcell = true;
                    }
                }
            }
        }
    }
    CheckCardWithCard() {
        let cardTopInCell_A: BaseCard = new BaseCard();
        for (let i = 0; i < this.Cells.length - 1; i++) {
            let chidls = this.Cells[i].node.children;
            let chidlsLength = chidls.length;
            if (chidlsLength > 0) {
                cardTopInCell_A = chidls[chidlsLength - 1].getComponent(BaseCard);
            }
            this.CardWithCard(cardTopInCell_A);
        }
        if (this.count_CheckCardWithCardInCell == 0) {
            this.Check_cardWithCardInCells = false;
        } else {
            this.count_CheckCardWithCardInCell = 0;
        }
    }
    CardWithCard(Card_A: BaseCard) {
        let cardTopInCell_B: BaseCard = new BaseCard();
        for (let j = 1; j < this.Cells.length; j++) {
            let chidls = this.Cells[j].node.children;
            let chidlsLength = chidls.length;
            if (chidlsLength > 0) {
                cardTopInCell_B = chidls[chidlsLength - 1].getComponent(BaseCard);
            }
            if (Card_A.tag_group != cardTopInCell_B.tag_group &&
                (Card_A.number_index - 1 == cardTopInCell_B.number_index ||
                    Card_A.number_index == cardTopInCell_B.number_index - 1)) {
                if (((Card_A.type == CardTypeStatus.CLUB || Card_A.type == CardTypeStatus.SPADE) &&
                    (cardTopInCell_B.type == CardTypeStatus.DIAMOND || cardTopInCell_B.type == CardTypeStatus.HEART)) ||
                    ((Card_A.type == CardTypeStatus.DIAMOND || Card_A.type == CardTypeStatus.HEART) &&
                        (cardTopInCell_B.type == CardTypeStatus.CLUB || cardTopInCell_B.type == CardTypeStatus.SPADE))) {
                    if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_HIND) {
                        this.count_CheckCardWithCardInCell++;
                        Card_A.Select(true);
                        cardTopInCell_B.Select(true);
                    } else if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_LOSE) {
                        this.count_CheckCardWithCardInCell++;
                        this.Check_cardWithCardInCells = true;
                    }
                }
            }
        }
    }
    //cell with freeCell
    CheckCellWithFreeCells() {
        let count_checkCell = 0;
        let cardTopCells: BaseCard = new BaseCard();
        for (let i = 0; i < this.Cells.length; i++) {
            let chidls = this.Cells[i].node.children;
            let chidlsLength = chidls.length;
            if (chidlsLength > 0) {
                cardTopCells = chidls[chidlsLength - 1].getComponent(BaseCard);
            }
            for (let j = 0; j < this.FreeCell.length; j++) {
                if (this.FreeCell[j].node.children.length == 0) {
                    if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_HIND) {
                        count_checkCell++;
                        cardTopCells.Select(true);
                        this.InstantiateGlowCell(this.FreeCell[j].Tag);
                    } else if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_LOSE) {
                        count_checkCell++;
                        this.Check_cellWithfreeCell = true;
                    }
                }
            }
        }
        if (count_checkCell == 0) {
            this.Check_cellWithfreeCell = false;
        } else {
            count_checkCell = 0;
        }
    }
    //cell with aceCell
    CheckCellWithAceCells() {
        let cardTopCells: BaseCard = new BaseCard();
        this.check_cell_State = CHECK_CELL_STATUS.CHECK_CELL_WITH_ACECELL;
        this.InitTypeAceCell();
        for (let i = 0; i < this.Cells.length; i++) {
            let childs = this.Cells[i].node.children;
            let chidlsLength = childs.length;
            if (chidlsLength > 0) {
                cardTopCells = childs[chidlsLength - 1].getComponent(BaseCard);
            }
            this.CheckCardAceCell(cardTopCells);
        }
        if (this.Count_checkAceCell == 0) {
            if (this.check_cell_State == CHECK_CELL_STATUS.CHECK_CELL_WITH_ACECELL) {
                this.Check_cellWithAceCell = false;
            }
        } else {
            this.Count_checkAceCell = 0;
        }
    }
    //free cell with cell
    CheckFreeCellWithCells() {
        let count_checkCell = 0;
        let cardTopInCell_B: BaseCard = new BaseCard();
        for (let i = 0; i < this.FreeCell.length; i++) {
            let chidls = this.FreeCell[i].node.children;
            if (this.FreeCell[i].node.children.length != 0 && chidls[0].name != "ColliderNode") {
                let Card_A = chidls[0].getComponent(BaseCard);
                for (let j = 1; j < this.Cells.length; j++) {
                    let childs = this.Cells[j].node.children;
                    let chidlsLength = childs.length;
                    if (chidlsLength > 0) {
                        cardTopInCell_B = childs[chidlsLength - 1].getComponent(BaseCard);
                    }
                    if (Card_A.tag_group != cardTopInCell_B.tag_group &&
                        (Card_A.number_index == cardTopInCell_B.number_index - 1)) {
                        if (((Card_A.type == CardTypeStatus.CLUB || Card_A.type == CardTypeStatus.SPADE) &&
                            (cardTopInCell_B.type == CardTypeStatus.DIAMOND || cardTopInCell_B.type == CardTypeStatus.HEART)) ||
                            ((Card_A.type == CardTypeStatus.DIAMOND || Card_A.type == CardTypeStatus.HEART) &&
                                (cardTopInCell_B.type == CardTypeStatus.CLUB || cardTopInCell_B.type == CardTypeStatus.SPADE))) {
                            if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_HIND) {
                                count_checkCell++;
                                Card_A.Select(true);
                                cardTopInCell_B.Select(true);
                            }
                            else if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_LOSE) {
                                count_checkCell++;
                                this.Check_freeCellWithCell = true;
                            }
                        }
                    } else {
                    }
                }
            }
        }
        if (count_checkCell == 0) {
            this.Check_freeCellWithCell = false;
        }
    }
    //free cell with aceCell
    CheckFreeCellWithAceCell() {
        let cardTopCells: BaseCard = new BaseCard();
        this.check_cell_State = CHECK_CELL_STATUS.CHECK_FREECELL_WITH_ACECELL;
        this.InitTypeAceCell();
        for (let i = 0; i < this.FreeCell.length; i++) {
            let childs = this.Cells[i].node.children;
            let chidlsLength = childs.length;
            if (chidlsLength > 0) {
                cardTopCells = childs[chidlsLength - 1].getComponent(BaseCard);
            }
            this.CheckCardAceCell(cardTopCells);
        }
        if (this.Count_checkAceCell == 0) {

            if (this.check_cell_State == CHECK_CELL_STATUS.CHECK_FREECELL_WITH_ACECELL) {
                this.Check_freeCellWithAceCell = false;
            }
        } else {
            this.Count_checkAceCell = 0;
        }
    }
    CheckCardAceCell(cardTopCells: BaseCard) {
        for (let j = 0; j < this.AceCell.length; j++) {
            if (!this.AceCell[j].getComponent(AceCell).cards) {
                if (cardTopCells.type == this.AceCell[j].getComponent(AceCell).CardTypeGroup &&
                    cardTopCells.number_index == 1) {
                    if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_HIND) {
                        this.Count_checkAceCell++;
                        cardTopCells.Select(true);
                        this.InstantiateGlowCell(this.AceCell[j].getComponent(AceCell).Tag);
                    } else if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_LOSE) {
                        this.Count_checkAceCell++;
                        if (this.check_cell_State == CHECK_CELL_STATUS.CHECK_CELL_WITH_ACECELL) {
                            this.Check_cellWithAceCell = true;
                        }
                        else if (this.check_cell_State == CHECK_CELL_STATUS.CHECK_FREECELL_WITH_ACECELL) {
                            this.Check_freeCellWithAceCell = true;
                        }
                    }
                }
            }
            else if (this.AceCell[j].getComponent(AceCell).cards.length >= 1) {
                if (this.AceCell[j].getComponent(AceCell).CardTypeGroup == cardTopCells.type &&
                    this.AceCell[j].getComponent(AceCell).GetTopCell().number_index + 1 == cardTopCells.number_index) {
                    if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_HIND) {
                        if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_HIND) {
                            this.Count_checkAceCell++;
                            cardTopCells.Select(true);
                            this.AceCell[j].getComponent(AceCell).Select(true);
                        } else if (this.CheckGameState == CHECK_GAME_STATUS.CHECK_LOSE) {
                            if (this.check_cell_State == CHECK_CELL_STATUS.CHECK_CELL_WITH_ACECELL) {
                                this.Count_checkAceCell++;
                                this.Check_cellWithAceCell = true;
                            }
                            else if (this.check_cell_State == CHECK_CELL_STATUS.CHECK_FREECELL_WITH_ACECELL) {
                                this.Count_checkAceCell++;
                                this.Check_freeCellWithAceCell = true;
                            }
                        }
                    }
                }
            }
        }
    }
    //instantiateSGlowCell
    public InstantiateGlowCell(tagCell: number) {
        if (tagCell >= 10 && tagCell <= 13) {
            for (let i = 0; i < this.FreeCell.length; i++) {
                if (this.FreeCell[i].node.children.length === 0) {
                    this.FreeCell[i].RemoveCards_cell();
                    let GlowNode = cc.instantiate(this.CardPrefab);
                    if (GlowNode) {
                        GlowNode.position = this.Cells[i].node.position;
                        this.FreeCell[i].node.addChild(GlowNode);
                        GlowNode.setPosition(0, 0);
                        GlowNode.name = "ColliderNode";
                    }
                }
            }
        }
        else if (tagCell >= 14 && tagCell <= 17) {
            for (let i = 0; i < this.AceCell.length; i++) {
                if (this.AceCell[i].children.length === 0 && i == tagCell - 14) {
                    this.AceCell[i].getComponent(AceCell).RemoveCards_cell();
                    let GlowNode = cc.instantiate(this.CardPrefab);
                    if (GlowNode) {
                        GlowNode.position = this.Cells[i].node.position;
                        this.AceCell[i].addChild(GlowNode);
                        GlowNode.setPosition(0, 0);
                        GlowNode.name = "ColliderNode";
                    }
                }
            }
        }
    }
    //removeGlowCell
    public RemoveGlowCell(tagCell: number) {
        if (tagCell >= 10 && tagCell <= 13) {
            for (let i = 0; i < this.FreeCell.length; i++) {
                if (this.FreeCell[i].node.children.length != 0) {
                    let chidls = this.FreeCell[i].node.children;
                    for (let j = 0; j < chidls.length; j++) {
                        if (chidls[j].name == "ColliderNode") {
                            this.FreeCell[i].node.removeChild(chidls[j]);
                        }
                    }
                }
            }
        }
        else if (tagCell >= 14 && tagCell <= 17) {
            for (let i = 0; i < this.AceCell.length; i++) {
                if (this.AceCell[i].children.length != 0) {
                    let chidls = this.AceCell[i].children;
                    for (let j = 0; j < chidls.length; j++) {
                        if (chidls[j].name == "ColliderNode") {
                            this.AceCell[i].removeChild(chidls[j]);
                        }
                    }
                }
            }
        }
    }
    public RemoveAllCardGlow() {
        for (let i = 0; i < this.Cells.length; i++) {
            let chidls = this.Cells[i].node.children;
            for (let j = 0; j < chidls.length; j++) {
                chidls[j].getComponent(BaseCard).Select(false);
            }
        }
        for (let i = 0; i < this.FreeCell.length; i++) {
            let chidls = this.FreeCell[i].node.children;
            for (let j = 0; j < chidls.length; j++) {
                chidls[j].getComponent(BaseCard).Select(false);
                if (chidls[j].name == "ColliderNode") {
                    this.FreeCell[i].node.removeChild(chidls[j]);
                }
            }
        }
        for (let i = 0; i < this.AceCell.length; i++) {
            let chidls = this.AceCell[i].children;
            for (let j = 0; j < chidls.length; j++) {
                chidls[j].getComponent(BaseCard).Select(false);
                if (chidls[j].name == "ColliderNode") {
                    this.AceCell[i].removeChild(chidls[j]);
                }
            }
        }
    }
    /***************************************************HIND AUTO START********************************************* */
    SetHindAuto() {
        if (this.isHindAuto) {
            this.BottomGroupNode.getComponent(BottomGroupManager).SetHindGame();
        }
    }
    public HindAutoStart() {
        this.isHindAuto = true;
        this.isPauseCountHindAuto = true;
        this.startTimer_autoHind = new Date().getTime() / 1000;
    }
    public HindAutoStop() {
        this.isHindAuto = false;
        this.isPauseCountHindAuto = false;
    }
    //***************************************************MENU GAME ************************************************** */
    InitIndexAllCell() {
        for (let i = 0; i < this.Cells.length; i++) {
            this.Cells[i].SetOriginCellIndex();
        }
        for (let i = 0; i < this.FreeCell.length; i++) {
            this.FreeCell[i].SetOriginFreeCellIndex();
        }
        this.StartPosition.setSiblingIndex(4);
    }
    public ToParentNode_showMenuGame() {
        this.node.parent.getComponent(GameControler).ShowMenuGame();
    }
    public SetNewGame() {
        this.RemoveAllChildsInCells();
        this.TopManager.getComponent(TopGroupManager).InitTopInfo();
        this.GameDataStack = [];
        this.newGame = true;
        this.InitCellStatus();
        this.InitIndexAllCell();
        this.StartGame();
    }
    public InitCellStatus() {
        this.isAceCell14_Full = false;
        this.isAceCell15_full = false;
        this.isAceCell16_Full = false;
        this.isAceCell17_full = false;
        this.Check_CardsWithAllcell = true;
        this.Check_cardWithCardInCells = true;
        this.Check_cellWithAceCell = true;
        this.Check_cellWithfreeCell = true;
        this.Check_freeCellWithCell = true;
        this.Check_freeCellWithAceCell = true;
        this.isLoseGame_loadinggame = false;
        this.isLoseGame_newGame = false;

    }
    public SetOptions() {
        this.node.parent.getComponent(GameControler).SetOptions();
    }
    //************************************************THEMES SETTING**********************************************/
    public ThemesSetting(themesIndex: number) {
        let pathBackground = "Images/BG/";
        LoadImages.Instance.LoadingImages(pathBackground, themesIndex.toString(), (spriteFrame) => {
            this.BG.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    }
    //************************************************PLAY AUDIO***************************************************/
    public PlayMusic() {
        PlayAudio.Instance.AudioMusic_background();
    }
    //**************************************************CHECK WIN GAME*************************************************/
    CheckWinGame() {
        for (let i = 0; i < this.AceCell.length; i++) {
            let chidls = this.AceCell[i].children;
            if (chidls.length >= 1) {
                for (let j = 0; j < chidls.length; j++) {
                    let chilsLength = chidls.length;
                    if (j == chilsLength - 1) {
                        if (chidls[j].getComponent(BaseCard).number_index == 13) {
                            if (this.AceCell[i].getComponent(AceCell).Tag == 14) {
                                this.isAceCell14_Full = true;
                            }
                            if (this.AceCell[i].getComponent(AceCell).Tag == 15) {
                                this.isAceCell15_full = true;
                            }
                            if (this.AceCell[i].getComponent(AceCell).Tag == 16) {
                                this.isAceCell16_Full = true;
                            }
                            if (this.AceCell[i].getComponent(AceCell).Tag == 17) {
                                this.isAceCell17_full = true;
                            }
                        }
                    }
                }
            }
        }
        this.IsWinGame();
    }
    IsWinGame() {
        if (this.isAceCell14_Full == true && this.isAceCell15_full == true && this.isAceCell16_Full == true && this.isAceCell17_full == true) {
            PlayAudio.Instance.AuidoEffect_WinGame();
            this.ShowWinGame();
        }
    }
    SavePointGame(gameScore: number) {
        this.pointWinGames.push(gameScore)
        let data = JSON.stringify(this.pointWinGames, null, 2);
        cc.sys.localStorage.setItem("GameScoreData", data);
    }
    LoadPointGame(): number[] {
        let data = localStorage.getItem("GameScoreData");
        if (data) {
            let gamedata = JSON.parse(data);
            return gamedata;
        }
        return null;
    }
    GetRankScoreGame(currentScore: number): number {
        //sao chep sang một mảng khác 
        let arr_score: number[] = [];
        let countRank: number = 0;
        for (let i = 0; i < this.pointWinGames.length; i++) {
            arr_score.push(this.pointWinGames[i]);
        }
        //sắp xếp từ lớn đến bé
        for (let i = 0; i < arr_score.length - 1; i++) {
            for (let j = i + 1; j < arr_score.length; j++) {
                if (arr_score[i] <= arr_score[j]) {
                    let score = arr_score[i];
                    arr_score[i] = arr_score[j];
                    arr_score[j] = score;
                }
            }
        }
        //đếm từ phần tử lớn nhất đến phần tử == số điểm hiện tại => rank của trận đấu 
        for (let i = 0; i < arr_score.length - 1; i++) {
            countRank++;
            if (arr_score[i] == currentScore) {
                break;
            }
        }
        return countRank;
    }
    ShowWinGame() {
        this.pointWinGames = this.LoadPointGame();
        if (!this.pointWinGames) {
            this.pointWinGames = [];
        }
        let game_data = this.TopManager.getComponent(TopGroupManager).Game_Data;
        this.SavePointGame(game_data.score);
        this.pointWinGames = this.LoadPointGame();
        let TopScore = Math.max(...this.pointWinGames);
        let rankPoint = this.GetRankScoreGame(game_data.score);
        this.node.parent.getComponent(GameControler).OnWinGame(game_data.move, game_data.time, game_data.score, rankPoint, TopScore);
    }
    ShowLoseGame() {
        this.node.parent.getComponent(GameControler).OnLoseGame();
    }
    CheckLoseGame() {
        this.Check_Lose_Game();
    }
    public Check_Lose_Game() {
        this.CheckGameState = CHECK_GAME_STATUS.CHECK_LOSE;
        this.CheckAllCell()
    }
    IsLoseGame() {
        if (!this.Check_CardsWithAllcell && !this.Check_cardWithCardInCells && !this.Check_cellWithAceCell &&
            !this.Check_cellWithfreeCell && !this.Check_freeCellWithCell && !this.Check_freeCellWithAceCell ||
            this.isLoseGame_loadinggame || this.isLoseGame_newGame) {
            this.gamePlayState = GAMEPLAY_STATUS.NO_STATUS;
            this.isLoseGame_loadinggame = false;
            this.isLoseGame_newGame = false;
            PlayAudio.Instance.AudioEffect_LoseGame();
            this.ShowLoseGame();
            this.InitCellStatus()
        } else {
            this.Check_CardsWithAllcell = true;
            this.Check_cardWithCardInCells = true;
            this.Check_cellWithAceCell = true;
            this.Check_cellWithfreeCell = true;
            this.Check_freeCellWithCell = true;
            this.Check_freeCellWithAceCell = true;
            this.isLoseGame_loadinggame = false;
            this.isLoseGame_newGame = false;
        }
        if (this.Check_CardsWithAllcell || this.Check_cardWithCardInCells || this.Check_cellWithAceCell ||
            this.Check_cellWithfreeCell || this.Check_freeCellWithCell || this.Check_freeCellWithAceCell) {
            this.Check_CardsWithAllcell = true;
            this.Check_cardWithCardInCells = true;
            this.Check_cellWithAceCell = true;
            this.Check_cellWithfreeCell = true;
            this.Check_freeCellWithCell = true;
            this.Check_freeCellWithAceCell = true;
        }
    }
    Check_WINLOSE_game() {
        this.CheckWinGame();
        this.CheckLoseGame();
    }
    CheckTimerNewGame(timer: number) {
        if (timer >= 800) {
            this.isLoseGame_newGame = true;
            this.IsLoseGame();
        } else {
            this.isLoseGame_newGame = false;
        }
    }
    checkTimerGameLoading(timer: number) {
        if (timer >= 800) {
            this.isLoseGame_loadinggame = true;
            this.IsLoseGame();
        } else {
            this.isLoseGame_loadinggame = false;
        }
    }
    //*************************************************UPDATE GAME***************************************** */
    protected update(dt: number) {
        if (this.isHindAuto && this.isPauseCountHindAuto) {
            let currentTime = new Date().getTime() / 1000;
            let elapsedTime = currentTime - this.startTimer_autoHind;
            let intElapsedTime = parseInt(elapsedTime.toString(), 10);
            if (intElapsedTime == 15 && this.isPauseCountHindAuto) {
                this.isPauseCountHindAuto = false;
                this.SetHindAuto();
            }
        }
        if (this.gamePlayState == GAMEPLAY_STATUS.NEW_GAME) {
            let currentTime = new Date().getTime() / 1000;
            let elapsedTime = currentTime - this.startTimer_loseGame_newGame;
            let intElapsedTime = parseInt(elapsedTime.toString(), 10);
            this.CheckTimerNewGame(intElapsedTime);
        }
        if (this.gamePlayState == GAMEPLAY_STATUS.LOADING_GAME) {
            let currentTime = new Date().getTime() / 1000;
            let elapsedTime = currentTime - this.startTimer_loseGame_loading;
            let intElapsedTime = parseInt(elapsedTime.toString(), 10);
            this.checkTimerGameLoading(intElapsedTime);
        }
    }
}

