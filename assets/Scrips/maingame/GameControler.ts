import Main from "./Main";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameControler extends cc.Component {
    @property(cc.Node)
    MainGame: cc.Node = null;
    @property(cc.Node)
    MenuGame: cc.Node = null;
    @property(cc.Node)
    Options: cc.Node = null;
    public ShowMenuGame() {
        this.MenuGame.active = true;
    }
    public CloseMenuGame() {
        this.MenuGame.active = false;
    }
    public SetNewGameToMain() {
        this.MainGame.getComponent(Main).SetNewGame();
        this.MenuGame.active = false;
    }
    public SetReplay() {
        this.MainGame.getComponent(Main).SetNewGame();
        this.MenuGame.active = false;
    }
    public SetOptions() {
        this.Options.active = true;
    }
}
