package pl.mmilek.kuwahara.app.algorithm;

import java.awt.*;
import java.awt.image.BufferedImage;

import static pl.mmilek.kuwahara.app.algorithm.QuadrantKind.*;

public class KuwaharaFilter {
    public static void apply(final BufferedImage inputImage, BufferedImage outputImage, Integer startRow, Integer endRow ,Integer filterSize) {
        var height = inputImage.getHeight();
        var width = inputImage.getWidth();

        for (int y = startRow; y < endRow; y++) {
            for (int x = 0; x < width; x++) {
                Quadrant[] quadrants = new Quadrant[4];
                for (int i = 0; i < 4; i++) {
                    quadrants[i] = new Quadrant();
                }
                processPixel(quadrants, inputImage, x, y, width, height, filterSize);
                var min = Quadrant.minStandardDeviationQuadrant(quadrants);
                outputImage.setRGB(x, y, min.getAverageColor().getRGB());
            }
        }
    }

    private static void processPixel(Quadrant[] quadrants, BufferedImage image, int x, int y, int width, int height, int filterSize) {
        for (int i = -filterSize; i <= filterSize; i++) {
            for (int j = -filterSize; j <= filterSize; j++) {
                int pixelX = x + i;
                int pixelY = y + j;
                if (!pixelInBounds(pixelX, pixelY, image.getWidth(), image.getHeight()) || i == 0 || j == 0) {
                    continue;
                }
                var pixel = new Color(image.getRGB(pixelX, pixelY));
                var quadrantResult = checkQuadrant(i, j);

                var q1 = quadrantResult.q1;
                if (quadrantResult.q2 != NONE) {
                    var q2 = quadrantResult.q2;
                    quadrants[q1.ordinal()].addPixel(pixel);
                    quadrants[q2.ordinal()].addPixel(pixel);
                } else {
                    quadrants[q1.ordinal()].addPixel(pixel);
                }
            }
        }
    }

    private static boolean pixelInBounds(int x, int y, int width, int height) {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    private static QuadrantResult checkQuadrant(int i, int j) {
        if (i < 0 && j < 0) {
            return new QuadrantResult(TOP_LEFT, NONE);
        } else if (i < 0 && j > 0) {
            return new QuadrantResult(TOP_RIGHT, NONE);
        } else if (i > 0 && j < 0) {
            return new QuadrantResult(BOTTOM_LEFT, NONE);
        } else if (i > 0 && j > 0) {
            return new QuadrantResult(BOTTOM_RIGHT, NONE);
        } else if (i == 0) {
            if (j < 0) {
                return new QuadrantResult(TOP_LEFT, TOP_RIGHT);
            } else {
                return new QuadrantResult(BOTTOM_LEFT, BOTTOM_RIGHT);
            }
        } else {
            if (i < 0) {
                return new QuadrantResult(TOP_LEFT, BOTTOM_LEFT);
            } else {
                return new QuadrantResult(TOP_RIGHT, BOTTOM_RIGHT);
            }
        }
    }
}
