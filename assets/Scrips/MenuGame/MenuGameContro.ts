import { GameControler } from "../maingame/GameControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuGameContro extends cc.Component {
    // @property(cc.Node)
    // PopupHelps: cc.Node = null;
    onClickBackground() {
        this.node.parent.getComponent(GameControler).CloseMenuGame();
    }
    OnClickButton_NewGame() {
        this.node.parent.getComponent(GameControler).SetNewGameToMain();
    }
    OnClickButton_replay() {
        this.node.parent.getComponent(GameControler).SetReplay();
    }
    // OnClickButton_helps() {
    //     this.PopupHelps.active = true;
    // }
    // public CloseNexPageNode() {
    //     this.PopupHelps.active = false;
    // }
}
