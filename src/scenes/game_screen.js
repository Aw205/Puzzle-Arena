var controls;
var player;

class game_screen extends Phaser.Scene {


    constructor() {
        super("game_screen");
    }

    preload() {
        
        this.load.atlas("slime_idle","./assets/enemy/slime_idle3.png","./assets/enemy/slime_idle.json");
        this.load.atlas("slime_hit","./assets/enemy/slime_hit.png","./assets/enemy/slime_hit.json");
        this.load.image("serene_village", "./assets/map/Serene_Village.png");
        this.load.image("knight", "./assets/knight.png");
        this.load.tilemapTiledJSON("tilemap", "./assets/map/Serene_Village_Map.json");

    }

    create() {
        this.createAnims();

        player = new Player(this,100,150,"knight");
        this.createMap();
        player.setDepth(10);

        this.cameras.main.startFollow(player,false,0.2,0.2);
        this.cameras.main.setZoom(2);

        // this.player.body.setCollideWorldBounds(true);
        // this.player.body.onWorldBounds = true;   
 

    }

    createMap(){

        const map = this.make.tilemap({key: "tilemap" });
        const tileset = map.addTilesetImage("Serene_Village", "serene_village");
        let layerNames = ["Ground","3","2","1","Houses","Above Houses"];
        for(let name of layerNames){
            let layer = map.createLayer(name,tileset);
            layer.setCollisionByProperty({collides: true});
            this.physics.add.collider(player,layer);
        }
        
        let enemyArray = map.createFromObjects("Enemy",{name: "Slime", key: "pink_idle", classType: Enemy});
        this.physics.add.collider(enemyArray[0],player,()=>{
            this.scene.start("match_screen",{enemy: enemyArray[0]});
        });

        let entrances = map.createFromObjects("House Entrance",{name: "Entrance", classType: Entrance});

        this.cameras.main.setBounds(0, 0, map.widthInPixels,map.heightInPixels);
    }

    createAnims(){

        this.anims.create({
            key: "pink_idle",
            frames: this.anims.generateFrameNames("slime_idle",{
                prefix: "pink_",
                start:0,
                end: 6
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: "pink_hit",
            frames: this.anims.generateFrameNames("slime_hit",{
                prefix: "pink_",
                end: 1
            }),
            frameRate: 2,
            repeat: 0
        });

    }

}