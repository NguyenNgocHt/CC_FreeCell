
import Main from "../maingame/Main";
import { BaseCard } from "../CardGroup/BaseCard";
import Cell from "./Cell";
const { ccclass, property } = cc._decorator;

@ccclass
export default class CellColliders extends cc.Component {
    private _baseCard_other: BaseCard = new BaseCard();
    private _cell_self: Cell = new Cell();
    private self_cards_freecell: BaseCard[];
    private isInputOK: boolean = false;
    onCollisionEnter(other, self) {
    }
    onCollisionStay(other, self) {

    }
    onCollisionExit(other, self) {
    }
    GetCardInfo(other: any, self: any) {
    }

}
