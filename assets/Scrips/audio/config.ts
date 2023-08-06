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
    DATA_REMOVE_CARD_FREECELL: "data-remove-card-free-cell",
    DATA_CHECK_CHILDS_FOR_CELL: "data-check-childs-for-cell",
    DATA_DELETE_COLLIDER_CHILD_NODE: "data-delete-collider-child-node",
    DATA_UPDATE_COUNT_MOVE: "data-update-count-move",
    DATA_CLOSE_HELP_POPUP: "data-close-help-popup",
    DATA_THEMES_NUMBER_SET: "data-themes-number-set",
    DATA_SETINDEX_CELL_TO_ORIGIN: "data-setIndex-cell-to-origin",
    DATA_CHILDREN_FOR_CELL_TAG20: "data-children-for-cell-tag20",
}
export enum MOUSE_ONCLICK_LEFT_RIGHT_STATUS {
    NO_STATUS = 0,
    MOUSE_RIGHT = 1,
    MOUSE_LEFT = 2,
}
export enum CHECK_GAME_STATUS {
    NO_STATUS = 0,
    CHECK_HIND = 1,
    CHECK_LOSE = 2,
};
export enum CHECK_CELL_STATUS {
    NO_STATUS = 0,
    CHECK_CELL_WITH_FREECELL = 1,
    CHECK_CELL_WITH_ACECELL = 2,
    CHECK_FREECELL_WITH_ACECELL = 3,
}
export enum GAMEPLAY_STATUS {
    NO_STATUS = 0,
    LOADING_GAME = 1,
    NEW_GAME = 2,
}
export enum TOUCH_STATUS {
    NO_STATUS = 0,
    TOUCH = 1,
    DOUBLE_TOUCH = 2,
}