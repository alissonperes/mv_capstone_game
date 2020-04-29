import "phaser";
import config from "../Config/config";
import { Button } from "../Objects/Button";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
    this.player;
    this.stars;
    this.bombs;
    this.dragons;
    this.platforms;
    this.cursors;
    this.score;
    this.collectedStars;
    this.gameOver;
    this.scoreText;
    this.highScoreText;
  }

  create() {
    this.score = 0;
    this.collectedStars = 0;
    this.gameOver = false;
    this.highScore = this.sys.game.globals.highScore;

    this.add.image(400, 300, "sky");
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

    //  Now let's create some ledges
    this.platforms.create(600, 390, "ground");
    this.platforms.create(50, 240, "ground");
    this.platforms.create(750, 240, "ground");

    // The player and its settings
    this.player = this.physics.add.sprite(100, 450, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.bgMusic = this.sys.game.globals.bgMusic;

    this.jumpSound = this.sys.game.globals.jumpSound;
    this.downSound = this.sys.game.globals.downSound;
    this.catchStar = this.sys.game.globals.catchStar;

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate(function (child) {
      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.bombs = this.physics.add.group();
    this.dragons = this.physics.add.group();

    //  The score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    this.highscoreText = this.add.text(
      380,
      16,
      `High Score: ${this.highScore}`,
      {
        fontSize: "32px",
        fill: "#000",
      }
    );

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.dragons, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.dragons,
      this.takePoints,
      null,
      this
    );
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-190);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(190);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-390);
      this.jumpSound.play();
    }

    if (this.cursors.down.isDown && !this.player.body.touching.down) {
      if (!this.downSound.isPlaying) {
        this.downSound.play();
      }
      this.player.setVelocityY(390);
      this.player.setBounceY(0.1);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.catchStar.play();
    //  Add and update the score
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.score > this.highScore) {
      this.sys.game.globals.highScore = this.score;
    }

    if (this.stars.countActive(true) === 0) {
      this.collectedStars += 1;
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var dragon = this.dragons.create(x, 16, "dragonblue");
      dragon.setBounce(1);
      dragon.setCollideWorldBounds(true);
      dragon.setVelocity(Phaser.Math.Between(-200, 200), 20);
      dragon.allowGravity = false;
      if (this.collectedStars % 2 === 0) {
        var bomb = this.bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
      }
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");

    this.gameOver = true;
    // this.scene.start("Title");
    this.restartButton = new Button(
      this,
      config.width / 2,
      config.height / 2,
      "blueButton1",
      "blueButton2",
      "Restart",
      "Game"
    );
  }

  takePoints(player, dragon) {
    dragon.destroy();

    this.score = Math.floor(this.score / 2);
    this.scoreText.setText("Score: " + this.score);
  }
}
