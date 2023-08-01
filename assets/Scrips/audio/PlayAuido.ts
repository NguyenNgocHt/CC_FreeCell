
import Main from "../maingame/Main";
import AudioLoader from "./AudioLoader";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayAudio extends cc.Component {
    public isPlayAudioLoadingEND: boolean = false;
    onLoad() {
        AudioLoader.preloadAllAudioClips(() => {
            cc.log("Đã tải xong toàn bộ âm thanh.");
            this.isPlayAudioLoadingEND = true;
            this.node.getComponent(Main).PlayMusic();
        });
    }
    getAudioClip() {
        let audioClip = AudioLoader.getAudioClip("background");
        console.log(audioClip);
    }
    public playAudioOneShot(audioFileName: string) {
        const audioClip = AudioLoader.getAudioClip(audioFileName);
        if (audioClip) {
            cc.audioEngine.playEffect(audioClip, false);
        } else {
            cc.error("Không tìm thấy âm thanh!");
        }
    }
    public PlayAudioMusic(audioFileName: string) {
        const audioClip = AudioLoader.getAudioClip(audioFileName);
        if (audioClip) {
            cc.audioEngine.playMusic(audioClip, true);
        } else {
            cc.error("Không tìm thấy âm thanh!");
        }
    }
}
