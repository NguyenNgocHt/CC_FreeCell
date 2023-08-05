
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
