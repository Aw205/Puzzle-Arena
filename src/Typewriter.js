class Typewriter extends Phaser.GameObjects.GameObject {


    constructor(scene) {
        super(scene);
        this.label = this.scene.add.text(100, 100, "");

    }


    typewriteText(text) {

        const length = text.length;
        let i = 0;
        this.scene.time.addEvent({
            callback: () => {
                this.label.text += text[i++];
            },
            repeat: length - 1,
            delay: 200
        });
    }

    typewriteTextWrapped(text) {

        const lines = this.label.getWrappedText(text);
        const wrappedText = lines.join('\n');s
        this.typewriteText(wrappedText);
    }







}