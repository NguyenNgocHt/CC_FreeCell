// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadImages extends cc.Component {
    private static instance: LoadImages | null = null;
    public static get Instance(): LoadImages {
        if (this.instance == null) {
            this.instance = new LoadImages();
        }
        return this.instance;
    }
    public LoadingImages(path: string, nameImage: string, callback: (spriteFrame: cc.SpriteFrame) => void) {
        let fullPath = path + nameImage;
        console.log("Name image " + nameImage);
        console.log("FULL PATH " + fullPath);
        cc.loader.loadRes(fullPath, cc.Texture2D, (err, texture) => {
            if (err) {
                console.error("Error loading sprite frame:", err);
                return;
            } else {
                let spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(texture);
                callback(spriteFrame);
            }
        });
    }
}
