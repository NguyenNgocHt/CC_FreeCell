import PlayAudio from "../audio/PlayAuido";
import LoadImages from "../common/LoadImages";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SwapImgButonContro extends cc.Component {
    private pathImgSwap: string = "Images/IU/";
    private buttonOff: string = "toggleOff_on";
    private buttonOn: string = "toggleOn_on";
    private buttonImg: string = "";
    private countSwap: number = 0;
    OnClickSwapButtonImg() {
        PlayAudio.Instance.AudioEffect_touch();
        if (this.node.name == "Button_hind") {
            this.countSwap += 1;
            if (this.countSwap == 1) {
                this.buttonImg = this.buttonOn;
            }
            else if (this.countSwap == 2) {
                this.buttonImg = this.buttonOff;
            }
            LoadImages.Instance.LoadingImages(this.pathImgSwap, this.buttonImg, (spriteFrame) => {
                this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            if (this.countSwap == 2) {
                this.countSwap = 0;
            }
        } else {
            this.countSwap += 1;
            if (this.countSwap == 1) {
                this.buttonImg = this.buttonOff;
            }
            else if (this.countSwap == 2) {
                this.buttonImg = this.buttonOn;
            }
            LoadImages.Instance.LoadingImages(this.pathImgSwap, this.buttonImg, (spriteFrame) => {
                this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            if (this.countSwap == 2) {
                this.countSwap = 0;
            }
        }
    }
}
