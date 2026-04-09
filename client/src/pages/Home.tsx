import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import {
  performCalculation,
  recommendAltitude,
  validateSensorSpecs,
  validateFlightParameters,
  type SensorSpecs,
  type FlightParameters,
  type CalculationResult,
} from "@/lib/calculations";

/**
 * FOV & GSD Altitude Calculator
 * 
 * Design Philosophy: Precision Engineering
 * - Asymmetric two-column layout (inputs left, results right)
 * - Real-time validation with constraint feedback
 * - Technical credibility through professional styling
 * - Deep slate blue primary with vibrant cyan accents
 */

export default function Home() {
  // Sensor specifications state
  const [sensorWidth, setSensorWidth] = useState<number>(36);
  const [sensorHeight, setSensorHeight] = useState<number>(24);
  const [pixelSize, setPixelSize] = useState<number>(4.63);
  const [focalLength, setFocalLength] = useState<number>(35);

  // Flight parameters state
  const [altitude, setAltitude] = useState<number>(120);
  const [overlapLongitudinal, setOverlapLongitudinal] = useState<number>(80);
  const [overlapLateral, setOverlapLateral] = useState<number>(70);

  // Target GSD for recommendations
  const [targetGSD, setTargetGSD] = useState<number>(2.5);

  // Validation
  const sensorValid = validateSensorSpecs({
    sensorWidth,
    sensorHeight,
    pixelSize,
    focalLength,
  });

  const flightValid = validateFlightParameters({
    altitude,
    imageOverlapLongitudinal: overlapLongitudinal,
    imageOverlapLateral: overlapLateral,
  });

  // Calculations
  const result: CalculationResult | null = useMemo(() => {
    if (!sensorValid.valid || !flightValid.valid) return null;

    return performCalculation(
      {
        sensorWidth,
        sensorHeight,
        pixelSize,
        focalLength,
      },
      {
        altitude,
        imageOverlapLongitudinal: overlapLongitudinal,
        imageOverlapLateral: overlapLateral,
      }
    );
  }, [
    sensorWidth,
    sensorHeight,
    pixelSize,
    focalLength,
    altitude,
    overlapLongitudinal,
    overlapLateral,
    sensorValid,
    flightValid,
  ]);

  // Altitude recommendations
  const recommendations = useMemo(() => {
    if (!sensorValid.valid) return [];
    return recommendAltitude(
      {
        sensorWidth,
        sensorHeight,
        pixelSize,
        focalLength,
      },
      targetGSD,
      overlapLongitudinal,
      overlapLateral
    );
  }, [
    sensorWidth,
    sensorHeight,
    pixelSize,
    focalLength,
    targetGSD,
    overlapLongitudinal,
    overlapLateral,
    sensorValid,
  ]);

  const handleRecommendationSelect = (alt: number) => {
    setAltitude(Math.round(alt * 10) / 10);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">📡</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">FOV & GSD Calculator</h1>
              <p className="text-sm text-muted-foreground">
                Derive sensor parameters for centimeter-grade topographical modeling
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Inputs (40%) */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="sensor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sensor">Sensor</TabsTrigger>
                <TabsTrigger value="flight">Flight</TabsTrigger>
              </TabsList>

              {/* Sensor Specifications Tab */}
              <TabsContent value="sensor" className="space-y-4 mt-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Camera Sensor Specs
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sensorWidth" className="text-sm font-medium">
                        Sensor Width (mm)
                      </Label>
                      <Input
                        id="sensorWidth"
                        type="number"
                        step="0.1"
                        value={sensorWidth}
                        onChange={(e) => setSensorWidth(parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Full-frame: 36mm, APS-C: 23.5mm
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="sensorHeight" className="text-sm font-medium">
                        Sensor Height (mm)
                      </Label>
                      <Input
                        id="sensorHeight"
                        type="number"
                        step="0.1"
                        value={sensorHeight}
                        onChange={(e) => setSensorHeight(parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Full-frame: 24mm, APS-C: 15.7mm
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="pixelSize" className="text-sm font-medium">
                        Pixel Size (μm)
                      </Label>
                      <Input
                        id="pixelSize"
                        type="number"
                        step="0.01"
                        value={pixelSize}
                        onChange={(e) => setPixelSize(parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Typical range: 3-6 micrometers
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="focalLength" className="text-sm font-medium">
                        Focal Length (mm)
                      </Label>
                      <Input
                        id="focalLength"
                        type="number"
                        step="0.1"
                        value={focalLength}
                        onChange={(e) => setFocalLength(parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Standard: 24-50mm for mapping
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Flight Parameters Tab */}
              <TabsContent value="flight" className="space-y-4 mt-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Flight Configuration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="altitude" className="text-sm font-medium">
                        Flight Altitude (meters)
                      </Label>
                      <Input
                        id="altitude"
                        type="number"
                        step="1"
                        value={altitude}
                        onChange={(e) => setAltitude(parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        AGL (Above Ground Level)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="overlapLongitudinal" className="text-sm font-medium">
                        Longitudinal Overlap (%)
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="overlapLongitudinal"
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          value={overlapLongitudinal}
                          onChange={(e) =>
                            setOverlapLongitudinal(
                              Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                            )
                          }
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground">
                          {overlapLongitudinal >= 80 ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: ≥80% for stereo coverage
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="overlapLateral" className="text-sm font-medium">
                        Lateral Overlap (%)
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="overlapLateral"
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          value={overlapLateral}
                          onChange={(e) =>
                            setOverlapLateral(
                              Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                            )
                          }
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground">
                          {overlapLateral >= 70 ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: ≥70% for tie-point generation
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Altitude Recommendations */}
            <Card className="p-4 bg-secondary/50">
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Altitude Recommendations
              </h3>
              <div className="space-y-2 mb-4">
                <Label htmlFor="targetGSD" className="text-sm font-medium">
                  Target GSD (cm)
                </Label>
                <Input
                  id="targetGSD"
                  type="number"
                  step="0.1"
                  value={targetGSD}
                  onChange={(e) => setTargetGSD(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => handleRecommendationSelect(rec.altitude)}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-sm">
                        {rec.altitude.toFixed(1)}m → {rec.gsd.toFixed(2)}cm GSD
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Coverage: {rec.groundCoverageWidth.toFixed(0)}m × {rec.groundCoverageHeight.toFixed(0)}m
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Results (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Constraint Status */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* GSD Constraint */}
                <Card
                  className={`p-4 border-l-4 ${
                    result.constraints.gsdValid
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.constraints.gsdValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        {result.constraints.gsdMessage}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Longitudinal Overlap Constraint */}
                <Card
                  className={`p-4 border-l-4 ${
                    result.constraints.overlapLongitudinalValid
                      ? "border-green-500 bg-green-50"
                      : "border-amber-500 bg-amber-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.constraints.overlapLongitudinalValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        {result.constraints.overlapLongitudinalMessage}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Lateral Overlap Constraint */}
                <Card
                  className={`p-4 border-l-4 ${
                    result.constraints.overlapLateralValid
                      ? "border-green-500 bg-green-50"
                      : "border-amber-500 bg-amber-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.constraints.overlapLateralValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        {result.constraints.overlapLateralMessage}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Overall Status */}
                <Card
                  className={`p-4 border-l-4 ${
                    result.isValid
                      ? "border-accent bg-blue-50"
                      : "border-destructive bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.isValid ? (
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-mono text-sm font-semibold text-primary">
                        {result.isValid ? "✓ Configuration Valid" : "✗ Configuration Invalid"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Optical Parameters */}
            {result && (
              <Card className="p-6 result-card">
                <h3 className="text-lg font-bold text-primary mb-4">Optical Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Field of View
                    </p>
                    <p className="text-2xl font-mono font-bold text-accent mt-1">
                      {result.fov.toFixed(2)}°
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Ground Sample Distance
                    </p>
                    <p className="text-2xl font-mono font-bold text-accent mt-1">
                      {result.gsd.toFixed(2)} cm
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Ground Coverage */}
            {result && (
              <Card className="p-6 result-card">
                <h3 className="text-lg font-bold text-primary mb-4">Ground Coverage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Width
                    </p>
                    <p className="text-2xl font-mono font-bold text-accent mt-1">
                      {result.groundCoverageWidth.toFixed(1)} m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Height
                    </p>
                    <p className="text-2xl font-mono font-bold text-accent mt-1">
                      {result.groundCoverageHeight.toFixed(1)} m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Area per Image
                    </p>
                    <p className="text-lg font-mono font-bold text-primary mt-1">
                      {(result.groundCoverageWidth * result.groundCoverageHeight).toFixed(0)} m²
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Image Spacing */}
            {result && (
              <Card className="p-6 result-card">
                <h3 className="text-lg font-bold text-primary mb-4">Image Spacing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Longitudinal
                    </p>
                    <p className="text-xl font-mono font-bold text-accent mt-1">
                      {result.imageSpacingLongitudinal.toFixed(1)} m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Lateral
                    </p>
                    <p className="text-xl font-mono font-bold text-accent mt-1">
                      {result.imageSpacingLateral.toFixed(1)} m
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* 1km Coverage Estimate */}
            {result && (
              <Card className="p-6 result-card bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="text-lg font-bold text-primary mb-4">1km × 1km Coverage</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Images/Line
                    </p>
                    <p className="text-2xl font-mono font-bold text-accent mt-1">
                      {result.imagesPerLine}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Flight Lines
                    </p>
                    <p className="text-2xl font-mono font-bold text-accent mt-1">
                      {result.flightLines}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Total Images
                    </p>
                    <p className="text-2xl font-mono font-bold text-primary mt-1">
                      {result.totalImages}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Error State */}
            {!result && (sensorValid.errors.length > 0 || flightValid.errors.length > 0) && (
              <Card className="p-6 border-l-4 border-destructive bg-red-50">
                <div className="flex gap-3">
                  <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-2">Validation Errors</h3>
                    <ul className="space-y-1 text-sm text-destructive">
                      {[...sensorValid.errors, ...flightValid.errors].map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
