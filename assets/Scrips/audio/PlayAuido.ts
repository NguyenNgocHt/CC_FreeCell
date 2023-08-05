
import { GameControler } from "../maingame/GameControler";
import Main from "../maingame/Main";
import AudioLoader from "./AudioLoader";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayAudio extends cc.Component {
    public isPlayAudioLoadingEND: boolean = false;
    private static instance: PlayAudio | null = null;
    private isPlayEffect: boolean = true;
    public static get Instance(): PlayAudio {
        if (this.instance == null) {
            this.instance = new PlayAudio();
        }
        return this.instance;
    }
    onLoad() {
        // AudioLoader.preloadAllAudioClips(() => {
        //     cc.log("Đã tải xong toàn bộ âm thanh.");
        //     this.isPlayAudioLoadingEND = true;
        // });
    }
    getAudioClip() {
        let audioClip = AudioLoader.getAudioClip("background");
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
    public AudioMusic_background() {
        this.PlayAudioMusic("background");
    }
    public AudioMusic_pause() {
        cc.audioEngine.pauseMusic();
    }
    public AudioMusic_resume() {
        cc.audioEngine.resumeMusic();
    }
    public AudioEffect_hind() {
        if (this.isPlayEffect) {
            this.playAudioOneShot("congrat");
        }
    }
    public AudioEffect_touch() {
        if (this.isPlayEffect) {
            this.playAudioOneShot("touch");
        }
    }
    public AudioEffect_swap() {
        if (this.isPlayEffect) {
            this.playAudioOneShot("swap");
        }
    }
    public AudioEffect_deal() {
        if (this.isPlayEffect) {
            this.playAudioOneShot("deal");
        }
    }
    public AuidoEffect_WinGame() {
        if (this.isPlayEffect) {
            this.playAudioOneShot("victory");
        }
    }
    public AudioEffect_LoseGame() {
        if (this.isPlayEffect) {
            this.playAudioOneShot("losegame");
        }
    }
    public AudioEffect_pauseAll() {
        this.isPlayEffect = false;
    }
    public AudioEffect_resumeAll() {
        this.isPlayEffect = true;
    }
}
