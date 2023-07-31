
import Cell from "./Cell";
import { BaseCard } from "../CardGroup/BaseCard";
const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeCell extends Cell {
    public CardTypeGroup: number = 0;
    public setSbilingIndexCell() {
        let childs = this.node.children;
        this.node.parent.parent.setSiblingIndex(5);
        childs[0].setSiblingIndex(5);
    }
}
