import { God } from "@18nguyenl/artificer";

import Paper from "paper";
import AlloyFinger from "alloyfinger";

function hitTestItem(evt) {
    return Paper.project.getItems({
        // ...keep those containing event point...
        match: function (item) {
            return item.contains(evt.point);
        }
        // ...and retrieve the last one (the more on top)
    }).pop();
}

export default class Visio extends God {
    constructor() {
        super("Visio");
        this.canvas = document.getElementById('canvas');
        Paper.setup(this.canvas);

        this.selected = [];
        this.cleanSelected.bind(this)

        // Gesture Interaction Controls
        {
            let zoom = 1.0;
            let rotation = 0.0;

            this.gestures = new AlloyFinger(canvas, {
                rotate: function (evt) {
                    let delta = evt.angle + rotation;
                    Paper.view.rotation += delta;
                    rotation = evt.angle;
                },
                pinch: function (evt) {
                    let delta = evt.zoom - zoom;
                    Paper.view.zoom += delta;
                    zoom = evt.zoom;
                },
                pressMove: (evt) => {
                    let evtDelta = new Paper.Point(evt.deltaX, evt.deltaY);
                    evtDelta = evtDelta.rotate(-Paper.view.rotation);
                    Paper.view.center = Paper.view.center.subtract(evtDelta)
                }
            })
        }

        // Setup Spell Actions
        {
            const CircleAction = new Paper.Tool();
            const CircleActionButton = document.getElementById("CircleAction");
            CircleActionButton.addEventListener("click", (evt) => {
                console.log("Casting Circle Spell Action...");
                this.cleanSelected()
                CircleAction.activate();
            })
            CircleAction.on("mouseup", evt => {
                this.createCircle([evt.point.x, evt.point.y]);
                this.world.pantheon["Communi"].act((god) => {

                })
            })

            const LineAction = new Paper.Tool();
            const LineActionButton = document.getElementById("LineAction");
            LineActionButton.addEventListener("click", evt => {
                console.log("Casting Line Spell Action...");
                this.cleanSelected()
                LineAction.activate();
            })
            LineAction.on("mouseup", evt => {
                const item = hitTestItem(evt)

                if (!!item && this.selected.length < 2 && (item.data.type === "outline" || item.data.type === "circle") && !item.data.selected) {
                    item.strokeWidth = 5
                    item.data.selected = true;
                    this.selected.push(item)
                }

                if (this.selected.length === 2) {
                    this.createLine(this.selected[0], this.selected[1])
                    this.cleanSelected()
                }
            })

            const OutlineAction = new Paper.Tool();
            const OutlineActionButton = document.getElementById("OutlineAction");
            OutlineActionButton.addEventListener("click", evt => {
                console.log("Casting Outline Spell Action...");
                this.cleanSelected()
                OutlineAction.activate();
            })
            OutlineAction.on("mouseup", (evt) => {
                const item = evt.item || hitTestItem(evt);

                if (!!item && !item.data.selected && (item.data.type === "circle" || item.data.type === "line" || item.data.type === "outline")) {
                    this.selected.push(item);
                    item.data.selected = true;

                    this.createOutline(item);
                }
                this.cleanSelected()
            })

            const LabelAction = new Paper.Tool();
            const LabelActionButton = document.getElementById("LabelAction");
            LabelActionButton.addEventListener("click", evt => {
                console.log("Casting Label Spell Action...");
                this.cleanSelected()
                LabelAction.activate();
            })
            LabelAction.on("mouseup", (evt) => {
                const item = evt.item || hitTestItem(evt);

                if (!!item && !item.data.selected && !item.data.label && (item.data.type === "circle" || item.data.type === "line" || item.data.type === "outline")) {
                    this.selected.push(item)
                    item.data.selected = true;

                    const text = prompt("Speak your words");
                    if (!text) {
                        return;
                    }
                    item.data.label = text;

                    this.createAlignedText(text, item, { fontSize: 10 }, item.data.scale)
                    this.data.scale += 0.15;
                }
                this.cleanSelected()
            })

            // Clear the default tool used
            Paper.tool = undefined;
        }
    }

    cleanSelected() {
        while (this.selected.length > 0) {
            const item = this.selected[this.selected.length - 1]
            item.strokeWidth = 1;
            item.data.selected = false;
            this.selected.pop();
        }
    }

    createOutline(item) {
        const outline = item.clone()
        outline.data.label = undefined
        outline.data.selected = false;

        item.data.scale += .35;
        if (outline.data.type === "circle" || outline.data.type === "outline") {
            outline.scale(item.data.scale);
        }
        outline.data.type = "outline"

    }

    createCircle(point) {
        const newCircle = new Paper.Path.Circle(new Paper.Point(point), 32);
        newCircle.strokeColor = (0, 0, 0);
        newCircle.closed = true;
        newCircle.data.type = "circle"
        newCircle.data.selected = false;
        newCircle.data.scale = 1.15;

        return newCircle;
    }

    createLine(startCircle, endCircle) {
        const line = Paper.Path.Line(startCircle.position, endCircle.position);

        const intersect1 = line.getIntersections(startCircle);
        const intersect2 = line.getIntersections(endCircle);

        const finalLine = Paper.Path.Line(intersect1[0].point.clone(), intersect2[0].point.clone())
        finalLine.strokeColor = (0, 0, 0);
        line.remove()

        finalLine.data.scale = 1.15;
        finalLine.data.type = "line"

        return finalLine;
    }

    createPointText(str, style) {
        const text = new Paper.PointText();
        text.content = str;
        if (style) {
            if (style.font) text.font = style.font;
            if (style.fontFamily) text.fontFamily = style.fontFamily;
            if (style.fontSize) text.fontSize = style.fontSize;
            if (style.fontWieght) text.fontWeight = style.fontWeight;
        }
        return text;
    }

    createAlignedText(str, path, style, scale) {
        const pathClone = path.clone()
        pathClone.scale(scale);

        if (str && str.length > 0 && path) {
            // create PointText object for each glyph
            const glyphTexts = [];
            for (let i = 0; i < str.length; i++) {
                glyphTexts[i] = this.createPointText(str.substring(i, i + 1), style);
                glyphTexts[i].justification = "center";
            }

            // for each glyph find center xOffset
            const xOffsets = [0];
            for (let i = 1; i < str.length; i++) {
                const pairText = this.createPointText(str.substring(i - 1, i + 1), style);
                pairText.remove();
                xOffsets[i] = xOffsets[i - 1] + pairText.bounds.width - glyphTexts[i - 1].bounds.width / 2 - glyphTexts[i].bounds.width / 2;
            }
            // set point for each glyph and rotate glyph aorund the point
            for (let i = 0; i < str.length; i++) {
                let centerOffs = xOffsets[i];
                if (pathClone.length < centerOffs) {
                    if (pathClone.closed) {
                        centerOffs = centerOffs % pathClone.length;
                    } else {
                        centerOffs = undefined;
                    }
                }
                if (centerOffs === undefined) {
                    glyphTexts[i].remove();
                } else {
                    const pathPoint = pathClone.getPointAt(centerOffs);
                    glyphTexts[i].point = pathPoint;
                    const tan = pathClone.getTangentAt(centerOffs);
                    glyphTexts[i].rotate(tan.angle, pathPoint);

                    pathClone.remove()
                    path.data.label = str;
                }
            }
        }
    }
}