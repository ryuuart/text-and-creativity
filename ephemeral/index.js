import { Application, Graphics, Shader, Program, defaultVertex, Renderer, Mesh, BatchPluginFactory, Text, Container } from "pixi.js"
import watercolorF from "./shaders/watercolor.frag"
import watercolorV from "./shaders/watercolor.vert"

const ALLOWABLE_HISTORY = 5;

const app = new Application({ width: window.innerWidth, height: window.innerHeight, backgroundAlpha: 1 });
let memories = [];

function addMemory() {
    memories.forEach((memory, i) => {
        memory.count++;

        if (memory.count >= ALLOWABLE_HISTORY) {
            if (memory.ingredient.clean)
                memory.ingredient.clean()
            else
                memory.ingredient.destroy();
        }
    })

    memories = memories.filter((memory) => memory.count < ALLOWABLE_HISTORY)

    let rect = new IngredientsRect();
    app.stage.addChild(rect)

    memories.push({ ingredient: rect, count: 0 })
}

window.addEventListener("load", () => {
    document.body.appendChild(app.view);
    app.loader.load(load)

    function load() {
        const mainIngredientsText = new Text("ingredients", { 'fontFamily': 'Decoy', fontSize: 72, fill: 0xffffff })
        mainIngredientsText.anchor.set(0.5)
        mainIngredientsText.x = app.screen.width / 2;
        mainIngredientsText.y = app.screen.height / 2;
        mainIngredientsText.interactive = true;
        mainIngredientsText.buttonMode = true;

        memories.push({ ingredient: mainIngredientsText, count: 0 })
        mainIngredientsText.on("pointerdown", function (event) {
            mainIngredientsText.interactive = false;
            mainIngredientsText.buttonMode = false;
            addMemory();
        })

        app.stage.addChild(mainIngredientsText)
    }
})

class IngredientsRect extends Container {
    constructor() {
        super();

        const RECT_PADDING = 24;

        this.ingredientsText = new Text("ingredients", { 'fontFamily': 'Decoy', fontSize: 24, fill: 0xffffff });
        this.ingredientsText.interactive = true;
        this.ingredientsText.buttonMode = true;

        this.rect = new Graphics();
        this.rect.beginFill(Math.random() * 0xFFFFFF, 0.9);
        this.rect.drawRect(Math.random() * (app.screen.width - RECT_PADDING) + RECT_PADDING, Math.random() * (app.screen.height - RECT_PADDING) + RECT_PADDING,
            Math.random() * (app.screen.width / 4 - this.ingredientsText.width) + 100 + this.ingredientsText.width,
            Math.random() * (app.screen.height / 4 - this.ingredientsText.height) + 100 + this.ingredientsText.height);
        this.rect.interactive = false;
        this.rect.endFill();

        let time = 0;

        this.timerFunc = (delta) => {
            this.rect.shader.uniforms.u_time += delta * 0.1;
        }

        app.ticker.add(this.timerFunc)
        const START_COLORS = [Math.random(), Math.random(), Math.random(), 1]
        const END_COLORS = [Math.random(), Math.random(), Math.random(), 1]
        let uniforms = { tint: [], u_time: 0, u_start_color: START_COLORS, u_end_color: END_COLORS, resolution: [this.rect.width, this.rect.height] }
        this.rect.shader = Shader.from(watercolorV, watercolorF, uniforms)
        this.rect.geometry.isBatchable = () => { return false };

        const TEXT_PADDING = 24;
        const rectPos = this.rect.getBounds();
        this.ingredientsText.x = rectPos.x + Math.random() * (rectPos.width - TEXT_PADDING - this.ingredientsText.width) + TEXT_PADDING;
        this.ingredientsText.y = rectPos.y + Math.random() * (rectPos.height - TEXT_PADDING - this.ingredientsText.height) + TEXT_PADDING;

        this.ingredientsText.on("pointerdown", (event) => {
            addMemory();
        })

        this.addChild(this.rect);
        this.addChild(this.ingredientsText);
    }

    clean() {
        app.ticker.remove(this.timerFunc)
        this.destroy({ children: true })
    }
}
