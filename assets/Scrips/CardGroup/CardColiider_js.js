// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },
    start() {

    },
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        if (self.tag === other.tag) {
            Global.GameController.nodeTarget = self.node;
        }

    },

    onCollisionStay: function (other, self) {
        console.log('on collision stay');
        if (self.tag === other.tag) {
            Global.GameController.nodeTarget = self.node;
        }

    },

    onCollisionExit: function (other, self) {
        console.log('on collision exit');
        Global.GameController.nodeTarget = null;
        // if (self.tag === other.tag) {
        //     cc.log("cham roi", self.node.getComponent(cc.Sprite))
        //     self.node.getComponent(cc.Sprite).spriteFrame = other.node.getComponent(cc.Sprite).spriteFrame;
        //     other.node.destroy();
        //     Global.GameController.audioCorrect.play();
        // }
        // else{
        //     cc.log("sai roi")
        //     Global.GameController.audioFail.play();
        // }
    }
});
