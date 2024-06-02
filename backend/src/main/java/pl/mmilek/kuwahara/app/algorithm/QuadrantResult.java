package pl.mmilek.kuwahara.app.algorithm;

public class QuadrantResult {
    public QuadrantKind q1;
    public QuadrantKind q2;

    public QuadrantResult(QuadrantKind k1, QuadrantKind k2) {
        this .q1 = k1;
        this.q2 = k2;
    }
}
