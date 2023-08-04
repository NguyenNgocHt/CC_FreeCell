import WinGameContro from "../WinGame/WinGameContro";
import Main from "./Main";

const { ccclass, property } = cc._decorator;

@ccclass
export class GameControler extends cc.Component {
    @property(cc.Node)
    Home: cc.Node = null;
    @property(cc.Node)
    Loading: cc.Node = null;
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
    // bottom group contro
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
    //win  lose game contro
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
    public GamePlay_next_FromWinGame() {
        this.MainGame.getComponent(Main).SetNewGame();
        this.WinGame.active = false;
    }
    public GamePlay_next_FromLoseGame() {
        this.MainGame.getComponent(Main).SetNewGame();
        this.LoseGame.active = false;
    }
    public ComebackHomefromWinGame() {
        this.WinGame.active = false;
        this.MainGame.active = false;
        this.Home.active = true;
    }
    public ComebackHomefromLoseGame() {
        this.LoseGame.active = false;
        this.MainGame.active = false;
        this.Home.active = true;
    }
    //loading contro
    public OffLoading_onHome() {
        this.Loading.active = false;
        this.Home.active = true;
    }
    //home contro 
    public OffHomeAndOnMainGame() {
        this.Home.active = false;
    }
    public SetNewGameFromHome() {
        this.MainGame.getComponent(Main).SetNewGame();
        this.Home.active = false;
    }
    public SetContinueGamePlayFromHome() {
        this.Home.active = false;
        this.MainGame.getComponent(Main).newGame = false;
        this.MainGame.getComponent(Main).StartGame();
    }
}
