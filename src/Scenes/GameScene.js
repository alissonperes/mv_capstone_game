import "phaser";
import config from "../Config/config";
import { Button } from "../Objects/Button";
import { saveScore } from "../../src/api";

const get = () => JSON.parse(localStorage.getItem("Score"));
const set = (value) => {
  localStorage.setItem("Score", value);
  return get();
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
    this.player;
    this.stars;
    this.blueCrystals;
    this.pinkCrystals;
    this.yellowCrystals;
    this.bombs;
    this.dragons;
    this.platforms;
    this.cursors;
    this.scoreText;
    this.highScoreText;
    this.score;
    this.gameRound;
    this.gameOver;
    this.highScore;
    this.playerName;
    this.soundOn;
  }

  create() {
    this.score = 0;
    this.gameRound = 1;
    this.gameOver = false;
    this.soundOn = this.sys.game.globals.model.soundOn;

    this.highScore = this.sys.game.globals.highScore;
    this.playerName = this.sys.game.globals.playerName;

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

    this.blueCrystals = this.physics.add.group({
      key: "blueCrystal",
      repeat: 2,
      setXY: { x: 12, y: 0, stepX: 266 },
    });

    this.blueCrystals.children.iterate(function (child) {
      //  Give each star a slightly different bounce
      child.setBounce(1);
      child.setCollideWorldBounds(true);
      child.setVelocity(Phaser.Math.Between(-200, 200), 20);
      child.allowGravity = false;
    });

    this.bombs = this.physics.add.group();
    this.dragons = this.physics.add.group();
    this.pinkCrystals = this.physics.add.group();
    this.yellowCrystals = this.physics.add.group();

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
    // this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.blueCrystals, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.dragons, this.platforms);
    this.physics.add.collider(this.pinkCrystals, this.platforms);
    this.physics.add.collider(this.yellowCrystals, this.platforms);
    this.physics.add.collider(this.bombs, this.dragons);
    this.physics.add.collider(this.bombs);

    this.physics.add.overlap(
      this.player,
      this.blueCrystals,
      this.collectCrystals,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.pinkCrystals,
      this.specialCrystals,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.yellowCrystals,
      this.specialCrystals,
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
      this.player.setVelocityX(-190 - this.gameRound * 10);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(190 + this.gameRound * 10);
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

  collectCrystals(player, crystal) {
    crystal.disableBody(true, true);

    this.catchStar.play();

    this.score += 20;
    this.scoreText.setText("Score: " + this.score);

    if (this.score > this.highScore) {
      this.sys.game.globals.highScore = this.score;
      set(this.score);
    }

    if (this.blueCrystals.countActive(true) === 0) {
      this.gameRound += 1;
      this.blueCrystals.children.iterate(function (child) {
        child.enableBody(true, child.x, 100, true, true);
        child.setBounce(1);
        child.setCollideWorldBounds(true);
        child.setVelocity(Phaser.Math.Between(-200, 200), 20);
        child.allowGravity = false;
      });

      let x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      let dragon = this.dragons.create(x, 16, "dragonblue");
      dragon.setBounce(1);
      dragon.setCollideWorldBounds(true);
      dragon.setVelocity(Phaser.Math.Between(-200, 200), 20);
      dragon.allowGravity = false;

      if (this.gameRound % 2 === 0) {
        let yellowCrystal = this.yellowCrystals.create(x, 16, "yellowCrystal");
        yellowCrystal.setBounce(1);
        yellowCrystal.setCollideWorldBounds(true);
        yellowCrystal.setVelocity(Phaser.Math.Between(-200, 200), 20);
        yellowCrystal.allowGravity = false;

        let bomb = this.bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-25, 25), 20);
        bomb.allowGravity = false;
      }

      if (this.gameRound % 5 === 0) {
        let pinkCrystal = this.pinkCrystals.create(x, 16, "pinkCrystal");
        pinkCrystal.setBounce(1);
        pinkCrystal.setCollideWorldBounds(true);
        pinkCrystal.setVelocity(Phaser.Math.Between(-200, 200), 20);
        pinkCrystal.allowGravity = false;
      }
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    if (this.score > this.highScore) {
      this.sys.game.globals.highScore = this.score;
      set(this.score);
      saveScore(this.playerName, this.score);
    }
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
    dragon.disableBody(true, true);
    this.score -= 50;
    this.scoreText.setText("Score: " + this.score);
  }

  specialCrystals(player, crystal) {
    crystal.disableBody(true, true);
    this.catchStar.play();
    crystal.texture.key === "pinkCrystal"
      ? (this.score += 100)
      : (this.score += 40);

    this.scoreText.setText("Score: " + this.score);
  }
}
