import PlayAudio from "../audio/PlayAuido";
import { GameControler } from "../maingame/GameControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    OnClickButton_Play() {
        this.node.parent.getComponent(GameControler).OffHomeAndOnMainGame();
    }
    OnClickNewGame() {
        this.node.parent.getComponent(GameControler).SetNewGameFromHome();
    }
    OnClickButtonContinuePlay() {
        this.node.parent.getComponent(GameControler).SetContinueGamePlayFromHome();
    }
    onClickSound() {
        PlayAudio.Instance.AudioEffect_touch();
    }
}
