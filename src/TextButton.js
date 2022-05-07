class TextButton extends Phaser.GameObjects.Text{

    constructor(scene,x,y,text,style,callback){

        super(scene,x,y,text,style);
        this.callback = callback;
        this.setInteractive({useHandCursor: true})
            .on("pointerdown", ()=> this.onClick())
            .on("pointerover",()=> this.enterButtonHoverState())
            .on("pointerout",()=> this.enterButtonRestState());
        this.scene.add.existing(this);
             
    }

      onClick(){
        this.scene.sound.play("button_click",{volume:0.3});
        this.callback();
      }

      enterButtonHoverState() {
        this.setStyle({ fill: "#ffff00"});
      }
    
      enterButtonRestState() {
        this.setStyle({ fill: "#ffffff"});
      }
    
      enterButtonActiveState() {
        this.setStyle({ fill: '#0ff' });
      }

}