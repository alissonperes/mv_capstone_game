import "phaser";
import config from "./Config/config";
import GameScene from "./Scenes/GameScene";
import BootScene from "./Scenes/BootScene";
import PreloaderScene from "./Scenes/PreloaderScene";
import TitleScene from "./Scenes/TitleScene";
import OptionsScene from "./Scenes/OptionsScene";
import CreditsScene from "./Scenes/CreditsScene";
import Model from "./Model";

const get = () => JSON.parse(localStorage.getItem("Score"));
const set = (value) => {
  localStorage.setItem("Score", value);
  return get();
};
get() || set(0);

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const model = new Model();
    this.globals = {
      model,
      bgMusic: null,
      jumpSound: null,
      downSound: null,
      catchStar: null,
      highScore: get(),
    };
    this.scene.add("Boot", BootScene);
    this.scene.add("Preloader", PreloaderScene);
    this.scene.add("Title", TitleScene);
    this.scene.add("Options", OptionsScene);
    this.scene.add("Credits", CreditsScene);
    this.scene.add("Game", GameScene);
    this.scene.start("Boot");
  }
}
window.game = new Game();
