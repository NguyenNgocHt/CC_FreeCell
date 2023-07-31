import GameData from "../gameData/GameData";
import Main from "../maingame/Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TopGroupManager extends cc.Component {
    @property(cc.Node)
    Score: cc.Node = null;
    @property(cc.Node)
    Timer: cc.Node = null;
    @property(cc.Node)
    Move: cc.Node = null;
    public Game_Data: GameData = new GameData();
    private lableScore: cc.Label = null;
    private labelTimer: cc.Label = null;
    private labelMove: cc.Label = null;
    private number_score: number = 0;
    private startTime: number = 0;
    private isTimerStart: boolean = false;
    private countMove: number = 0;
    private totalSecond: number = 0;
    private countMinusScore: number = 0;
    //singleTon
    private static instance: TopGroupManager | null = null;
    public static get Instance(): TopGroupManager {
        if (this.instance == null) {
            this.instance = new TopGroupManager();
        }
        return this.instance;
    }
    onLoad() {
    }
    start() {
        this.initTopManager();
    }
    initTopManager() {
        let pointNode = this.Score.getChildByName("point");
        this.lableScore = pointNode.getComponent(cc.Label);
        let showTimerNode = this.Timer.getChildByName("showTimer");
        this.labelTimer = showTimerNode.getComponent(cc.Label);
        let moveNode = this.Move.getChildByName("pointMove");
        this.labelMove = moveNode.getComponent(cc.Label);
    }
    public InitScore(NumberIndex_card: number) {
        if (NumberIndex_card != 0) {
            this.number_score += NumberIndex_card * 20;
            this.ShowScore(this.number_score);
        }
    }
    CheckMinusScore() {
        if (this.totalSecond != 0) {
            if (this.totalSecond % 5 == 0) {
                this.countMinusScore += 1;
                if (this.countMinusScore == 1) {
                    this.number_score -= 1;
                }
            } else {
                this.countMinusScore = 0;
            }
        }
    }
    private ShowScore(score: number) {
        this.lableScore.string = "" + score;
    }
    //timer
    public SettimerStart(isTime_Start: boolean) {
        this.startTime = new Date().getTime() / 1000;
        this.isTimerStart = isTime_Start;
    }
    public ParseTime(time: number): string {
        this.totalSecond = parseInt(time.toString(), 10);
        let result = "";
        let minString: string;
        let seconString: string;
        let min = time / 60;
        let second = time % 60;
        let minInt = parseInt(min.toString(), 10);
        let secondInt = parseInt(second.toString(), 10);
        if (minInt >= 0 && minInt < 10) {
            minString = "0" + minInt.toString();
        } else {
            minString = minInt.toString();
        }
        if (secondInt >= 0 && secondInt < 10) {
            seconString = "0" + secondInt.toString();
        } else {
            seconString = secondInt.toString();
        }
        result = minString + ":" + seconString;
        return result;
    }
    public ShowCountTimer(Timer: string) {
        this.labelTimer.string = Timer;
    }
    public ShowCountMove(moveNumber: number) {
        this.countMove += moveNumber;
        this.labelMove.string = this.countMove.toString();
        this.UpdateGameGata();
    }
    UpdateGameGata() {
        this.Game_Data.Init(this.number_score, this.totalSecond, this.countMove, this.countMove, this.countMove);
        console.log("Game_data", this.Game_Data);
    }
    protected update(dt: number): void {
        if (this.isTimerStart) {
            let currentTime = new Date().getTime() / 1000;
            let elapsedTime = currentTime - this.startTime;
            let showTimerString = this.ParseTime(elapsedTime);
            this.ShowCountTimer(showTimerString);
            this.CheckMinusScore();
            this.ShowScore(this.number_score);
        }
    }

}
