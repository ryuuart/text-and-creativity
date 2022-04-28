import { God } from "@18nguyenl/artificer";

import Paper from "paper";
import AlloyFinger from "alloyfinger";

export default class Visio extends God {
    constructor() {
        super("Visio");
        this.canvas = document.getElementById('canvas');
        Paper.setup(this.canvas);

        // Gesture Interaction Controls
        let zoom = 1.0;
        let rotation = 0.0;

        console.log(this.canvas)
        this.gestures = new AlloyFinger(canvas, {
            rotate: function (evt) {
                let delta = evt.angle + rotation;
                Paper.view.rotation += delta;

                rotation = evt.angle;
                console.log("ROTATE", Paper.view.rotation)
            },
            pinch: function (evt) {
                let delta = evt.zoom - zoom;
                Paper.view.zoom += delta;
                zoom = evt.zoom;
            },
            pressMove: (evt) => {
                let evtDelta = new Paper.Point(evt.deltaX, evt.deltaY);
                console.log("MOVE", Paper.view.rotation)
                evtDelta = evtDelta.rotate(-Paper.view.rotation);
                Paper.view.center = Paper.view.center.subtract(evtDelta)
            }
        })
    }

    createCircle(point) {
        const newCircle = new Paper.Path.Circle(new Paper.Point(point), 32);
        newCircle.strokeColor = (0, 0, 0);

        return newCircle;
    }

    createLine(startCircle, endCircle) {
        const line = Paper.Path.Line(startCircle.position, endCircle.position);

        const intersect1 = line.getIntersections(startCircle);
        const intersect2 = line.getIntersections(endCircle);

        const finalLine = Paper.Path.Line(intersect1[0].point.clone(), intersect2[0].point.clone())
        finalLine.strokeColor = (0, 0, 0);
        line.remove()

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
        pathClone.scale(scale)

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
                }
            }
        }
    }
}