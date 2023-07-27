import CardType, { CardTypeStatus } from "./CardType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helper extends cc.Component {
    //singleTon
    private static instance: Helper | null = null;
    public static get Instance(): Helper {
        if (this.instance == null) {
            this.instance = new Helper();
        }
        return this.instance;
    }
    public ParseCard(number: number, type: CardTypeStatus, kind: number = 0) {
        let result = "";
        if (kind == 1) {
            switch (number) {
                case 1: result += "ACE"; break;
                case 2: result += "TWO"; break;
                case 3: result += "THREE"; break;
                case 4: result += "FOUR"; break;
                case 5: result += "FIVE"; break;
                case 6: result += "SIX"; break;
                case 7: result += "SEVEN"; break;
                case 8: result += "EIGHT"; break;
                case 9: result += "NINE"; break;
                case 10: result += "TEN"; break;
                case 11: result += "JACK"; break;
                case 12: result += "QUEEN"; break;
                case 13: result += "KING"; break;
            }
            result += "_of_" + CardType.Instance.getStringToCardType(type);
            result = result;
        } else {
            switch (type) {
                case CardTypeStatus.CLUB: result += "a"; break;
                case CardTypeStatus.DIAMOND: result += "b"; break;
                case CardTypeStatus.SPADE: result += "c"; break;
                case CardTypeStatus.HEART: result += "d"; break;
            }
            result += number.toString();
            result = result;
        }
        return result;
    }
    public static ParseTime(time: number): string {
        let result = "";

        let min = time / 60;
        let second = time % 60;
        let minInt = parseInt(min.toString(), 10);
        let secondInt = parseInt(second.toString(), 10);
        result = minInt.toString() + ":" + second.toString();
        return result;
    }
}
