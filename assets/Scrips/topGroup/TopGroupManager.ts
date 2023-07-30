
const { ccclass, property } = cc._decorator;

@ccclass
export default class TopGroupManager extends cc.Component {
    @property(cc.Node)
    Score: cc.Node = null;
    @property(cc.Node)
    Timer: cc.Node = null;
    @property(cc.Node)
    Move: cc.Node = null;
    private lableScore: cc.Label = null;
    private labelTimer: cc.Label = null;
    private labelMove: cc.Label = null;
    private number_score: number = 0;
    private startTime: number = 0;
    private isTimerStart: boolean = false;
    private countMove: number = 0;
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
        console.log("start top manager");
        let pointNode = this.Score.getChildByName("point");
        console.log("pointNode", pointNode);
        this.lableScore = pointNode.getComponent(cc.Label);
        let showTimerNode = this.Timer.getChildByName("showTimer");
        console.log("showtimerNode", showTimerNode);
        this.labelTimer = showTimerNode.getComponent(cc.Label);
        let moveNode = this.Move.getChildByName("pointMove");
        console.log("moveNode", moveNode);
        this.labelMove = moveNode.getComponent(cc.Label);
        console.log(this.labelMove, this.labelTimer, this.lableScore);
    }
    public InitScore(NumberIndex_card: number) {
        if (NumberIndex_card != 0) {
            this.number_score += NumberIndex_card * 20;
            console.log("this.number_score", this.number_score);
            this.ShowScore(this.number_score);
        }
    }
    private ShowScore(score: number) {
        console.log("show score");
        this.lableScore.string = "" + score;
    }
    //timer
    public SettimerStart(isTime_Start: boolean) {
        this.startTime = new Date().getTime() / 1000;
        this.isTimerStart = isTime_Start;
    }
    public ParseTime(time: number): string {
        let result = "";

        let min = time / 60;
        let second = time % 60;
        let minInt = parseInt(min.toString(), 10);
        let secondInt = parseInt(second.toString(), 10);
        result = minInt.toString() + ":" + secondInt.toString();
        return result;
    }
    public ShowCountTimer(Timer: string) {
        console.log("show timer");
        this.labelTimer.string = Timer;
    }
    public ShowCountMove(moveNumber: number) {
        console.log("show move number", moveNumber);
        this.countMove += moveNumber;
        this.labelMove.string = this.countMove.toString();
    }
    protected update(dt: number): void {
        if (this.isTimerStart) {
            let currentTime = new Date().getTime() / 1000;
            let elapsedTime = currentTime - this.startTime;
            let showTimerString = this.ParseTime(elapsedTime);
            this.ShowCountTimer(showTimerString);
        }
    }

}
