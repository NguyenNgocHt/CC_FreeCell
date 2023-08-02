import PlayAudio from "../audio/PlayAuido";
import LoadImages from "../common/LoadImages";
import { GameControler } from "../maingame/GameControler";
const { ccclass, property } = cc._decorator;

@ccclass
export default class OptisonContro extends cc.Component {
    @property(cc.Node)
    ThemesSetting: cc.Node = null;
    private countPlayMusic: number = 0;
    private countPlaySound: number = 0;
    private countPlayHind: number = 0;
    OnClickButtonMusic() {
        this.countPlayMusic += 1;
        if (this.countPlayMusic == 1) {
            PlayAudio.Instance.AudioMusic_pause();
        }
        else if (this.countPlayMusic == 2) {
            PlayAudio.Instance.AudioMusic_resume();
            this.countPlayMusic = 0;
        }
    }
    OnClickButtonSound() {
        this.countPlaySound += 1;
        if (this.countPlaySound == 1) {
            PlayAudio.Instance.AudioEffect_pauseAll();
        }
        else if (this.countPlaySound == 2) {
            PlayAudio.Instance.AudioEffect_resumeAll();
            this.countPlaySound = 0;
        }
    }
    OnClickButtonThemes() {
        this.ThemesSetting.active = true;
    }
    CloseThemesPopup() {
        this.ThemesSetting.active = false;
    }
    OnClickButtonHind() {
        this.countPlayHind += 1;
        if (this.countPlayHind == 1) {
            this.node.parent.getComponent(GameControler).SetHindAutoStart();
        }
        else if (this.countPlayHind == 2) {
            this.node.parent.getComponent(GameControler).SetHindAutoStop();
            this.countPlayHind = 0;
        }
    }
    OnClickButton_close() {
        this.node.parent.getComponent(GameControler).CloseOptions();
    }
    OnClick_Sound() {
        PlayAudio.Instance.AudioEffect_touch();
    }
    public SetThemesToGameControler(themesIndex: number) {
        this.node.parent.getComponent(GameControler).SetThemesToMainGame(themesIndex)
    }
}
