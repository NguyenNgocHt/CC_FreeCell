import Main from "../maingame/Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
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
        console.log("onclick set undo game");
        this.MainGame.onUndoButtonClick();
    }
    SetHindGame() {
        this.MainGame = this.node.parent.parent.getComponent(Main);
        console.log("onclick set Hind game");
    }
    SetPopupGame() {
        this.MainGame = this.node.parent.parent.getComponent(Main);
        console.log("onclick set Popup game");
    }
    SetChallenge() {
        this.MainGame = this.node.parent.parent.getComponent(Main);
        console.log("onclick set Challenge game");
    }
    SetOptions() {
        this.MainGame = this.node.parent.parent.getComponent(Main);
        console.log("onclick set options");
    }
}
