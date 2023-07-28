export type PATH_TO_CARDS = {
    CARD_GROUP_1: "Images/Card1";
    CARD_GROUP_2: "Images/Card2";
};
export enum MOUSE_STATUS {
    NO_STATUS = 0,
    MOUSE_DOWN = 1,
    MOUSE_UP = 2,
}
export const GAME_LISTEN_TO_EVENTS = {
    DATA_FOR_CARD_INTERMEDIARY: "data-for-card-intermediary",
    DATA_INDEX_FOR_CARD: "data-index-for-card",
    DATA_OUTPUT_CELL: "data-output-cell",
    DATA_OUTPUT_CELL_MAIN: "data-output-cell-main",
    DATA_ONCLICK_CARD: "data-on-click-card",
    DATA_ONCLICK_BUTTON_RIGHT: "data-onclick-button-right",
}
export enum MOUSE_ONCLICK_LEFT_RIGHT_STATUS {
    NO_STATUS = 0,
    MOUSE_RIGHT = 1,
    MOUSE_LEFT = 2,
}