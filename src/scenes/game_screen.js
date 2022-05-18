class game_screen extends Phaser.Scene{


    constructor(){
        super("game_screen");
    }
    
    create() {
        // const gui = new dat.GUI();

        // variables and settings
        this.AVATAR_SCALE = 2;
        this.VELOCITY = 150;
        this.ROOMWIDTH = 640;
        this.ROOMHEIGHT = 480;

        // Set background color
        this.cameras.main.setBackgroundColor('#666');

        // Set main camera to be 3 rooms wide, 2 rooms tall
        this.cameras.main.setBounds(0, 0, this.ROOMWIDTH*3, this.ROOMHEIGHT*2);

        // Everything is 1:1 scale
        this.cameras.main.setZoom(1.0);
    
        // setScroll moves the viewport to the starting room (1 down, 1 over)
        this.cameras.main.setScroll(this.ROOMWIDTH, this.ROOMHEIGHT);

        // Set up animations
        this.createAnimations();

        // make player avatar 🧍
        this.player = this.physics.add.sprite(this.ROOMWIDTH*1.5, this.ROOMHEIGHT*1.5, 'link_atlas', 'idle_down_0001').setScale(this.AVATAR_SCALE);
        this.player.body.allowGravity = false;
        this.player.body.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;   
        this.enemy = this.physics.add.sprite(this.ROOMWIDTH*1.8, this.ROOMHEIGHT*1.5, 'enemy').setScale(this.AVATAR_SCALE/8); 

        // set world boundaries
        this.physics.world.setBounds(this.ROOMWIDTH-this.player.displayWidth/2, this.ROOMHEIGHT-this.player.displayHeight/2, 
            this.ROOMWIDTH+this.player.displayWidth, this.ROOMHEIGHT+this.player.displayHeight/2);


        // Use Phaser-provided cursor key creation function
        cursors = this.input.keyboard.createCursorKeys();

    }

    update() {

        // check keyboard input
        if(cursors.left.isDown) {
            this.player.body.setVelocity(-this.VELOCITY, 0);
            this.player.anims.play('run_left', true);

        } else if(cursors.right.isDown) {
            this.player.body.setVelocity(this.VELOCITY, 0);
            this.player.anims.play('run_right', true);

        } else if(cursors.up.isDown) {
            this.player.body.setVelocity(0, -this.VELOCITY);
            this.player.anims.play('run_up', true);

        } else if(cursors.down.isDown) {
            this.player.body.setVelocity(0, this.VELOCITY);
            this.player.anims.play('run_down', true);

        } else if (!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.player.body.setVelocity(0, 0);

            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run_left') {
                this.player.anims.play('idle_left');
            }
            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run_right') {
               this.player.anims.play('idle_right');
            }
            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run_up') {
                this.player.anims.play('idle_up');
            }
            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run_down') {
                this.player.anims.play('idle_down');
            }

            
        }
        if(this.checkCollision(this.player, this.enemy)){
            this.scene.start("match_screen");
        }

        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.player, 0);
    }

    // Function to create all of the animations used in this scene
    createAnimations() {
        this.anims.create({
            key: 'idle_left',
            defaultTextureKey: 'link_atlas',
            frames: [
                { frame: 'idle_left_0001' }
            ],
            repeat: -1
        });

        // Idle right
        this.anims.create({
            key: 'idle_right',
            defaultTextureKey: 'link_atlas',
            frames: [
                { frame: 'idle_right_0001' }
            ],
            repeat: -1
        });

        // Idle down
        this.anims.create({
            key: 'idle_down',
            defaultTextureKey: 'link_atlas',
            frames: [
                { frame: 'idle_down_0001' }
            ],
            repeat: -1
        });

        // Idle up
        this.anims.create({
            key: 'idle_up',
            defaultTextureKey: 'link_atlas',
            frames: [
                { frame: 'idle_up_0001' }
            ],
            repeat: -1
        });


        // Run left
        this.anims.create({
            key: 'run_left',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'run_left_',
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        // Run right
        this.anims.create({
            key: 'run_right',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'run_right_',
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        // Run up
        this.anims.create({
            key: 'run_up',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'run_up_',
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        // Run down
        this.anims.create({
            key: 'run_down',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'run_down_',
                start: 1,
                end: 5,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });
    }
    checkCollision(player, enemy) {
        // simple AABB checking
        if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x && player.y < enemy.y + enemy.height && player.height + player.y > enemy.y) {
            return true;
        } else {
            return false;
        }
    }


}