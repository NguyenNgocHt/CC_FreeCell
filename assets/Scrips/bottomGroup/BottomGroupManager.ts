import PlayAudio from "../audio/PlayAuido";
import Main from "../maingame/Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BottomGroupManager extends cc.Component {
    @property(cc.Button)
    Button_Undo: cc.Button = null;
    @property(cc.Button)
    Button_Hind: cc.Button = null;
    @property(cc.Button)
    Button_Game: cc.Button = null;
    @property(cc.Button)
    Button_Challenge: cc.Button = null;
    @property(cc.Button)
    Button_Options: cc.Button = null;
    private MainGame: Main = null;
    start() {
    }
    SetUndoGame() {
        this.MainGame = this.node.parent.parent.getComponent(Main);
        this.MainGame.onUndoButtonClick();
    }
    public SetHindGame() {
        PlayAudio.Instance.AudioEffect_hind();
        this.MainGame = this.node.parent.parent.getComponent(Main);
        this.MainGame.CheckHindCellWithCell();
    }
    SetPopupGame() {
        this.MainGame = this.node.parent.parent.getComponent(Main);
        this.MainGame.ToParentNode_showMenuGame();
    }
    SetChallenge() {
        this.MainGame = this.node.parent.parent.getComponent(Main);
    }
    SetOptions() {
        this.MainGame = this.node.parent.parent.getComponent(Main);
        this.MainGame.SetOptions();
    }
    OnClickButtonSound() {
        PlayAudio.Instance.AudioEffect_touch();
    }
}
