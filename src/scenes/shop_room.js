class shop_room extends Phaser.Scene{

    constructor(){
        super("shop_room");
    }

    preload(){

        this.load.image("interiors", "./assets/map/Interiors.png");
        this.load.image("room_builder", "./assets/map/Room_Builder.png");
        this.load.tilemapTiledJSON("shop_map", "./assets/map/Shop_room.json");
    }

    create(){

        this.player = new Player(this,50,50,"knight");
        this.createMap();
    }

    createMap(){

        const map = this.make.tilemap({key: "shop_map" });
        const interiorTileset = map.addTilesetImage("Interior", "interiors");
        const roomTileset = map.addTilesetImage("Room", "room_builder");
        let layerNames = ["Floor","Furniture","Above Furniture","Border"];
        for(let name of layerNames){
            let layer = map.createLayer(name,[interiorTileset,roomTileset]);
            layer.setCollisionByProperty({collides: true});
            this.physics.add.collider(this.player,layer);
        }

        this.player.setDepth(10);
        this.cameras.main.startFollow(this.player,false,0.2,0.2);
        this.cameras.main.setZoom(2);
        //this.cameras.main.setBounds(0, 0, map.widthInPixels,map.heightInPixels);
    }



}