import WinGameContro from "../WinGame/WinGameContro";
import Main from "./Main";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameControler extends cc.Component {
    @property(cc.Node)
    WinGame: cc.Node = null;
    @property(cc.Node)
    LoseGame: cc.Node = null;
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
    public CloseOptions() {
        this.Options.active = false;
    }
    public SetHindAutoStart() {
        this.MainGame.getComponent(Main).HindAutoStart();
    }
    public SetHindAutoStop() {
        this.MainGame.getComponent(Main).HindAutoStop()
    }
    public SetThemesToMainGame(themesIndex: number) {
        this.MainGame.getComponent(Main).ThemesSetting(themesIndex);
    }
    public OnWinGame(movePoint: number, timePoint: number, scorePoint: number, RankPoint: number, topPoint: number) {
        this.WinGame.active = true;
        this.WinGame.getComponent(WinGameContro).ShowAllPointGame(movePoint, timePoint, scorePoint, RankPoint, topPoint);

    }
    public OnLoseGame() {
        this.LoseGame.active = true;
    }
    public OffWinGame() {
        this.WinGame.active = false;
    }
    public OffLosegame() {
        this.LoseGame.active = false;
    }
}
