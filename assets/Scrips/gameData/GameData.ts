// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
type ActionFloat = (value: number) => void;
type ActionInt = (value: number) => void;
@ccclass
export default class GameData extends cc.Component {
    public score: number;
    public time: number;
    public move: number;
    public undo: number;
    public hint: number;
    public TrueScore: number;
    timeCallback: ActionFloat | null = null;
    scoreCallback: ActionInt | null = null;
    moveCallback: ActionInt | null = null;
    protected start(): void {
        this.score = 0;
        this.time = 0;
        this.move = 0;
        this.undo = 0;
        this.hint = 0;
    }
    invokeScoreCallback(): void {
        if (this.scoreCallback) {
            this.scoreCallback(this.TrueScore);
        }
    }

    invokeTimeCallback(): void {
        if (this.timeCallback) {
            this.timeCallback(this.time);
        }
    }

    invokeMoveCallback(): void {
        if (this.moveCallback) {
            this.moveCallback(this.move);
        }
    }
    public Init(score: number, time: number, move: number, undo: number, hint: number) {
        this.score = score;
        this.time = time;
        this.move = move;
        this.undo = undo;
        this.hint = hint;
    }
    public GetTrueScore(): number {

        const result: number = this.score - Math.floor(this.time / 10);
        return result <= 0 ? 0 : result;
    }
    public AddHint() {
        this.hint += 1;
    }
    public AddUndo() {
        this.undo += 1;
    }
}
