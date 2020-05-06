import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  title: 'King Treasure',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 450 },
      debug: false,
    },
  },
};
