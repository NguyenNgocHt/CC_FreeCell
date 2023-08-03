// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioLoader extends cc.Component {

    private static loadedAudioClips: { [key: string]: cc.AudioClip } = {};
    static preloadAllAudioClips(callback: () => void) {
        cc.resources.loadDir("Sound", cc.AudioClip, (err, clips: cc.AudioClip[]) => {
            if (err) {
                cc.error("Lỗi tải âm thanh:", err);
                return;
            }
            for (const clip of clips) {
                const audioFileName = cc.path.basename(clip.name);
                AudioLoader.loadedAudioClips[audioFileName] = clip;
            }

            callback();
        });
    }

    static getAudioClip(audioFileName: string): cc.AudioClip {
        return AudioLoader.loadedAudioClips[audioFileName] || null;
    }
}
