import { GameControler } from "../maingame/GameControler";
import AudioLoader from "../audio/AudioLoader";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingContro extends cc.Component {
    @property(cc.ProgressBar)
    bar: cc.ProgressBar = null;
    private BarMaxValue: number = 20000;
    private isbarStart: boolean = false;
    private countUpdate: number = 0;
    private number_checkbar: number = 0;
    protected onLoad(): void {
        AudioLoader.preloadAllAudioClips(() => {
            cc.log("Đã tải xong toàn bộ âm thanh.");
        });
    }
    protected start(): void {
        this.isbarStart = true;
    }
    InitBar() {
        let randomNumber = this.getRandomInteger(50, 500);
        this.number_checkbar += randomNumber;
        let barRun = randomNumber / this.BarMaxValue;
        this.bar.progress += barRun;
        if (this.number_checkbar >= 20000) {
            this.isbarStart = false;
            cc.tween(this.node)
                .delay(1)
                .call(() => {
                    this.node.parent.getComponent(GameControler).OffLoading_onHome();
                })
                .start();
        }
    }
    protected update(dt: number): void {
        if (this.isbarStart) {
            this.countUpdate++;
            if (this.countUpdate % 5 == 0) {
                this.InitBar();
            }
        }
    }
    getRandomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
