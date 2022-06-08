
class victory_screen extends Phaser.Scene{

    constructor(){
        super("victory_screen");

    }

    create(){
        this.cameras.main.fadeIn(1000);
        this.scene.stop("game_screen");
        this.sound.play("victory");

        this.add.image(game.config.width/2,game.config.height/2,"puzzle_arena_victory");
        const restartButton = new TextButton(this,game.config.width/2-10,350,"Restart",{fontSize: 22},()=> this.scene.start("game_screen")).setOrigin(0.5);
        const menuButton = new TextButton(this,game.config.width/2-10,420,"Menu",{fontSize: 30},()=> this.scene.start("Menu")).setOrigin(0.5);

        this.comboText = this.add.text(-225,180,"Average Combo: ",{fontSize:27,fontFamily: "Monaco", color: "#000000"}).setData("value",total_combos.reduce((a,b) => (a+b)) / total_combos.length);
        this.totalDamageText = this.add.text(-210,230,"Total Damage: ",{fontSize: 27, fontFamily: "Monaco", color: "#000000"}).setData("value",total_damage);
        this.maxDamageText = this.add.text(-180,280,"Max Damage: ",{fontSize:27, fontFamily: "Monaco",color: "#000000"}).setData("value",max_damage);
        
        this.textArr = [this.comboText,this.totalDamageText,this.maxDamageText];
        this.displayStats();
    }

    displayStats(){

        this.time.addEvent({
            callback: ()=> {
                let text = this.textArr.shift();
                let desc = text.text;
                this.add.tween({
                    targets: text,
                    x: 100,
                    duration: 1000,
                    ease: Phaser.Math.Easing.Circular.InOut,
                    onComplete: () =>{
                        this.tweens.addCounter({
                            from: 0,
                            to: text.getData("value"),
                            duration: 2000,
                            onUpdate: tween => {
                                text.setText(desc.concat(tween.getValue().toFixed(2))); 
                            }
                        });
                    }
                });
            },
            repeat: 2,
            delay:1000
        });
    }
}