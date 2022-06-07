
var player;
var slimes_killed = 0;

class game_screen extends Phaser.Scene {


    constructor() {
        super("game_screen");
    }

    preload() {

       
        this.load.image("serene_village", "./assets/map/Serene_Village.png");
        this.load.tilemapTiledJSON("tilemap", "./assets/map/Serene_Village_Map.json");

    }

    create() {
        //this.createAnims();

        player = new Player(this,100,150,"run_up");
        slimes_killed = 0;
        this.createMap();
        player.setDepth(10);

        this.cameras.main.startFollow(player,false,0.2,0.2);
        this.cameras.main.setZoom(2);

        // player.body.setCollideWorldBounds(true);
        // player.body.onWorldBounds = true;   
 

    }

    createMap(){

        const map = this.make.tilemap({key: "tilemap" });
        const tileset = map.addTilesetImage("Serene_Village", "serene_village");
        let layerNames = ["Ground","4","3","2","1","Houses","Above Houses"];
        for(let name of layerNames){
            let layer = map.createLayer(name,tileset);
            layer.setCollisionByProperty({collides: true});
            this.physics.add.collider(player,layer);
        }
        this.enemyArray = map.createFromObjects("Enemy",{name: "Slime", key: "pink_idle", classType: Enemy});
        for(let slime of this.enemyArray){
            this.physics.add.collider(slime,player,()=>{
                this.scene.transition({target: "match_screen", duration: 0, sleep: true, data: {enemy: slime}});
            });
        }
        let entrances = map.createFromObjects("House Entrance",{name: "Entrance", classType: Entrance});
        this.cameras.main.setBounds(0, 0, map.widthInPixels,map.heightInPixels);
    }

    createAnims(){

    }

}