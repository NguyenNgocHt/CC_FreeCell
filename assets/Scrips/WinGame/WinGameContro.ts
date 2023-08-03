
const { ccclass, property } = cc._decorator;

@ccclass
export default class WinGameContro extends cc.Component {
    private totalSecond: number = 0;
    @property(cc.Label)
    MovePoint: cc.Label = null;
    @property(cc.Label)
    TimePoint: cc.Label = null;
    @property(cc.Label)
    ScorePoint: cc.Label = null;
    @property(cc.Label)
    RankPoint: cc.Label = null;
    @property(cc.Label)
    TopScorePoint: cc.Label = null;
    public ShowAllPointGame(movePoint: number, timePoint: number, scorePoint: number, RankPoint: number, topPoint: number) {
        this.MovePoint.string = movePoint.toString();
        this.TimePoint.string = this.ConverPointToTimeString(timePoint);
        this.ScorePoint.string = scorePoint.toString();
        this.RankPoint.string = RankPoint.toString();
        this.TopScorePoint.string = topPoint.toString();
    }
    ConverPointToTimeString(time: number): string {
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

}
