import { MeshStandardMaterial } from "three";
import shuffle from "shuffle-array";

// import { TwoDVectorWorld, God } from "@18nguyenl/artificer";
import anime from "animejs";
import { Vector3 } from "three";
import Paper from "paper";
import { Path, Point } from "paper/dist/paper-core";
import AlloyFinger from "alloyfinger";

window.addEventListener("load", () => {
    const canvas = document.getElementById('canvas');
    Paper.setup(canvas)

    const gestures = new AlloyFinger(canvas, {
        rotate: function (evt) {
            Paper.view.rotate(evt.angle)
        },
        pinch: function (evt) {
            Paper.view.zoom = 1.0 * evt.zoom;
        },
        pressMove: function (evt) {
            Paper.view.translate(evt.deltaX, evt.deltaY);
        }
    })

    const zeroCircle = new Paper.Path.Circle(new Paper.Point(0, 0), 32);
    zeroCircle.strokeColor = (0, 0, 0);

    const firstCircle = new Paper.Path.Circle(new Paper.Point(100, 70), 32);
    firstCircle.strokeColor = (0, 0, 0);

    const secondCircle = new Paper.Path.Circle(new Paper.Point(200, 300), 32);
    secondCircle.strokeColor = (0, 0, 0);

    const createAlignedText = function (str, path, style, scale) {
        const pathClone = path.clone()
        pathClone.scale(scale)

        if (str && str.length > 0 && path) {
            // create PointText object for each glyph
            const glyphTexts = [];
            for (let i = 0; i < str.length; i++) {
                glyphTexts[i] = createPointText(str.substring(i, i + 1), style);
                glyphTexts[i].justification = "center";
            }

            // for each glyph find center xOffset
            const xOffsets = [0];
            for (let i = 1; i < str.length; i++) {
                const pairText = createPointText(str.substring(i - 1, i + 1), style);
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

    // create a PointText object for a string and a style
    const createPointText = function (str, style) {
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

    {
        const line = Paper.Path.Line(new Paper.Point(100, 70), new Paper.Point(200, 300));
        line.strokeColor = (0, 0, 0);

        const intersect1 = line.getIntersections(firstCircle);
        const intersect2 = line.getIntersections(secondCircle);

        const finalLine = Paper.Path.Line(intersect1[0].point.clone(), intersect2[0].point.clone())
        finalLine.strokeColor = (0, 0, 0);
        line.remove()

        createAlignedText("Testin the wonderful magic circle let's not ask questions", firstCircle, { fontSize: 10 }, 1.25);
        createAlignedText("One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them", secondCircle, { fontSize: 10 }, 1.25);
        createAlignedText("Potato one two three four", finalLine, { fontSize: 10 }, 1.0);
        line.onClick = () => {
            {
                const line = Paper.Path.Line(new Paper.Point(100, 70), new Paper.Point(200, 300));
                line.strokeColor = (0, 0, 0);
                line.translate(10, 10)

                const intersect1 = line.getIntersections(firstCircle);
                const intersect2 = line.getIntersections(secondCircle);

                const finalLine = Paper.Path.Line(intersect1[0].point, intersect2[0].point)
                finalLine.strokeColor = (0, 0, 0);
                line.remove()
            }

            {
                const line = Paper.Path.Line(new Paper.Point(100, 70), new Paper.Point(200, 300));
                line.strokeColor = (0, 0, 0);
                line.translate(-10, -10)

                const intersect1 = line.getIntersections(firstCircle);
                const intersect2 = line.getIntersections(secondCircle);

                const finalLine = Paper.Path.Line(intersect1[0].point, intersect2[0].point)
                finalLine.strokeColor = (0, 0, 0);
                line.remove()
            }
        }
    }
})
