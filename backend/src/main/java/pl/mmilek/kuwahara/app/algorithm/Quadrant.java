package pl.mmilek.kuwahara.app.algorithm;

import java.awt.*;
import java.util.Arrays;
import java.util.Comparator;

public class Quadrant {
    int redSum;
    int greenSum;
    int blueSum;
    int count;

    private double varianceMean;
    private double varianceM2;

    Quadrant() {
        this.redSum = 0;
        this.greenSum = 0;
        this.blueSum = 0;
        this.count = 0;
        this.varianceMean = 0.0D;
        this.varianceM2 = 0.0D;
    }

    private static double luminance(Color color) {
        return 0.299D * (double) color.getRed() + 0.587D * (double) color.getGreen() + 0.114D * (double) color.getBlue();
    }

    private void updateVariance(double newValue) {
        this.count++;
        double delta = newValue - this.varianceMean;
        this.varianceMean += delta / (double) this.count;
        double delta2 = newValue - this.varianceMean;
        this.varianceM2 += delta * delta2;
    }

    public void addPixel(Color color) {
        this.redSum += color.getRed();
        this.greenSum += color.getGreen();
        this.blueSum += color.getBlue();
        this.updateVariance(luminance(color));
    }

    public double finalVariance() {
        return this.varianceM2 / (double) (this.count);
    }

    public Color getAverageColor() {
        return new Color(
                this.redSum / this.count,
                this.greenSum / this.count,
                this.blueSum / this.count
        );
    }

    public int getCount() {
        return count;
    }

    public static Quadrant minStandardDeviationQuadrant(Quadrant[] quadrants) {
        return Arrays.stream(quadrants).min(Comparator.comparingDouble(Quadrant::finalVariance)).stream().findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No minimum standard deviation found"));
    }
}
