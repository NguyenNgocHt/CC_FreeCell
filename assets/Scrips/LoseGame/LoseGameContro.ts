import PlayAudio from "../audio/PlayAuido";
import { GameControler } from "../maingame/GameControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    OnClickComeBackHome() {
        this.node.parent.getComponent(GameControler).ComebackHomefromLoseGame();
    }
    OnClickNextPlayGame() {
        this.node.parent.getComponent(GameControler).GamePlay_next_FromLoseGame();
    }
    OnclickSound() {
        PlayAudio.Instance.AudioEffect_touch();
    }
}
