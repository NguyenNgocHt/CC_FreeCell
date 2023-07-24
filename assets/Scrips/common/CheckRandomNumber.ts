//get random number
const { ccclass, property } = cc._decorator;

@ccclass
export default class CheckRandomNumber {
    //singleTon
    private readonly min: number;
    private readonly max: number;
    private static instance: CheckRandomNumber | null = null;
    public static get Instance(): CheckRandomNumber {
        if (this.instance == null) {
            this.instance = new CheckRandomNumber();
        }
        return this.instance;
    }
    public getRandomNumberInRange(min: number, max: number): number {
        const randomNum = Math.floor(Math.random() * (max - min)) + min;
        return randomNum;
    }

    public getRandomValidNumber(min: number, max: number): number {
        let randomNum = this.getRandomNumberInRange(min, max);
        while (randomNum >= max) {
            randomNum = this.getRandomNumberInRange(min, max);
        }
        return randomNum;
    }
}
