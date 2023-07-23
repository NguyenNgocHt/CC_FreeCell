
const { ccclass, property } = cc._decorator;

@ccclass
export class GameManager extends cc.Component {
    private static instance: GameManager | null = null;
    public static get Instance(): GameManager {
        if (this.instance == null) {
            this.instance = new GameManager();
        }
        return this.instance;
    }
}
