
import MenuGameContro from "./MenuGameContro";
import LoadImages from "../common/LoadImages";
import { GAME_LISTEN_TO_EVENTS } from "../audio/config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NexPageContro extends cc.Component {
    @property(cc.Node)
    ImageNext: cc.Node = null;
    private nextPageImg: number = 1;
    OnClickButton_close() {
        // this.node.parent.parent.getComponent(MenuGameContro).CloseNexPageNode();
        this.node.emit(GAME_LISTEN_TO_EVENTS.DATA_CLOSE_HELP_POPUP);
    }
    OnClickNextPage() {
        console.log("nex page");
        this.nextPageImg += 1;
        let path = "Images/IU/help/"
        LoadImages.Instance.LoadingImages(path, this.nextPageImg.toString(), (spriteFrame) => {
            this.ImageNext.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        if (this.nextPageImg == 6) {
            this.nextPageImg = 1;
        }
    }
}
