
import PlayAudio from "../audio/PlayAuido";
import ThemesContro from "./ThemesContro";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ConClickThemesContro extends cc.Component {
    OnClickIsThemes() {
        let themesNumber = parseInt(this.node.name, 10);
        this.node.parent.parent.parent.getComponent(ThemesContro).EmitToOptions(themesNumber);
    }
    OnClickSound() {
        PlayAudio.Instance.AudioEffect_touch();
        PlayAudio.Instance.AudioEffect_hind();
    }
}
