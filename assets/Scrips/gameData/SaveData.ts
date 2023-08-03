// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CardTypeStatus } from "../CardGroup/CardType";
import Main from "../maingame/Main";
const { ccclass, property } = cc._decorator;
enum CellType { CELL, FREE, ACE }
export class CardInfo {
    public type: CardTypeStatus;
    public numberIndex: number;
    public cell: number;

    constructor(type: CardTypeStatus, number: number, cell: number) {
        this.type = type;
        this.numberIndex = number;
        this.cell = cell;
    }
}
@ccclass
export class SaveData extends cc.Component {
    public infos: CardInfo[];
    public score: number;
    public time: number;
    public move: number;
    public undo: number;
    public hint: number;
    constructor() {
        super();
        this.infos = [];
        this.score = 0;
        this.time = 0;
        this.move = 0;
        this.undo = 0;
        this.hint = 0;
    }
    Init(score: number, time: number, move: number, undo: number, hint: number) {
        this.score = score;
        this.time = time;
        this.move = move;
        this.undo = undo;
        this.hint = hint;
    }
    public Count(): number {
        return this.infos.length;
    }
    public getInfosArr(i: number): CardInfo {
        return this.infos[i];
    }
    public setInfosArr(i: number, card: CardInfo) {
        this.infos[i] = card;
    }
    public AddCardInfor_Arr(card_info: CardInfo) {
        this.infos.push(card_info);
    }
    public AddCardInfo(type: CardTypeStatus, number: number, cell: number) {
        let info: CardInfo;
        info = new CardInfo(type, number, cell);
        this.AddCardInfor_Arr(info);
    }
}
export class GameSave {
    private saveData: SaveData;
    private loadData: SaveData;
    private static instance: GameSave | null = null;
    public static get Instance(): GameSave {
        if (this.instance == null) {
            this.instance = new GameSave();
        }
        return this.instance;
    }
    constructor() {
        document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        window.addEventListener("beforeunload", this.handleBeforeUnload.bind(this));
    }
    public SaveGame() {
        this.saveData = Main.Instance.SaveGame();
        let data = JSON.stringify(this.saveData, null, 2);
        cc.sys.localStorage.setItem("GamePlayData", data);
    }
    public LoadGame(): SaveData {
        let data = localStorage.getItem("GamePlayData");
        if (data) {
            let gamedata = JSON.parse(data);
            return gamedata;
        }
        return null;
    }
    handleVisibilityChange() {
        if (document.hidden) {
            this.SaveGame();
        }
    }
    handleBeforeUnload() {

        this.SaveGame();

    }
}
