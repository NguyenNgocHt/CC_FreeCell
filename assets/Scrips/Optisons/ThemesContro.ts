// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import PlayAudio from "../audio/PlayAuido";
import OptisonContro from "./OptisonContro";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThemesContro extends cc.Component {
    @property(cc.Node)
    CloseButton: cc.Node = null;
    public EmitToOptions(themesNumber: number) {
        this.node.parent.getComponent(OptisonContro).SetThemesToGameControler(themesNumber);
    }
    CloseThemesSetting() {
        this.node.parent.getComponent(OptisonContro).CloseThemesPopup();
    }
    OnClickSound() {
        PlayAudio.Instance.AudioEffect_touch();
    }
}
