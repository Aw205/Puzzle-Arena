
var player;

class game_screen extends Phaser.Scene {


    constructor() {
        super("game_screen");
    }

    preload() {

        this.load.atlas("player_run","./assets/player/Alex_run_16x16.png","./assets/player/player_run.json");
        this.load.atlas("slime_idle1","./assets/enemy/slime_idle1.png","./assets/enemy/slime_idle1.json");
        this.load.atlas("slime_idle","./assets/enemy/slime_idle3.png","./assets/enemy/slime_idle.json");
        this.load.atlas("slime_hit","./assets/enemy/slime_hit.png","./assets/enemy/slime_hit.json");
        this.load.atlas("slime_swallow","./assets/enemy/slime_swallow.png","./assets/enemy/slime_swallow.json");
        this.load.image("serene_village", "./assets/map/Serene_Village.png");
        this.load.tilemapTiledJSON("tilemap", "./assets/map/Serene_Village_Map.json");

    }

    create() {
        this.createAnims();

        player = new Player(this,100,150,"run_up");
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

        this.anims.create({
            key: "pink_idle",
            frames: this.anims.generateFrameNames("slime_idle1",{
                prefix: "pink_",
                start:0,
                end: 1
            }),
            frameRate: 3,
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

        this.anims.create({
            key: "run_left",
            frames: this.anims.generateFrameNames("player_run",{
                prefix: "run_left_",
                start: 0,
                end:5
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run_right",
            frames: this.anims.generateFrameNames("player_run",{
                prefix: "run_right_",
                start: 0,
                end:5
            }),
            frameRate:10,
            repeat: -1
        });
        this.anims.create({
            key: "run_up",
            frames: this.anims.generateFrameNames("player_run",{
                prefix: "run_up_",
                start: 0,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run_down",
            frames: this.anims.generateFrameNames("player_run",{
                prefix: "run_down_",
                start: 0,
                end:2
            }),
            frameRate:5,
            repeat: -1
        });

        this.anims.create({
            key: "pink_swallow",
            frames: this.anims.generateFrameNames("slime_swallow",{
                prefix: "pink_",
                start: 0,
                end:13
            }),
            frameRate:12
        });

    }

}