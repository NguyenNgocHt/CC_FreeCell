
const { ccclass, property } = cc._decorator;
export enum CardTypeStatus {
    SPADE,
    CLUB,
    DIAMOND,
    HEART
};
@ccclass
export default class CardType extends cc.Component {
    //singleTon
    private static instance: CardType | null = null;
    public static get Instance(): CardType {
        if (this.instance == null) {
            this.instance = new CardType();
        }
        return this.instance;
    }
    public getStringToCardType(type: CardTypeStatus): string {
        switch (type) {
            case CardTypeStatus.SPADE: return "SPADE"; break;
            case CardTypeStatus.CLUB: return "CLUB"; break;
            case CardTypeStatus.DIAMOND: return "DIAMOND"; break;
            case CardTypeStatus.HEART: return "HEART"; break;
            default: return "UNKNOWN";
        }
    }
}
