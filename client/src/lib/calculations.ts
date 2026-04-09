/**
 * FOV & GSD Altitude Calculator
 * 
 * Core calculation engine for deriving sensor Field-of-View (FOV) and altitude parameters
 * to ensure sub-3cm Ground Sample Distance (GSD) with 80/70 image overlap.
 * 
 * Key Formulas:
 * - GSD = (altitude * sensor_pixel_size) / focal_length
 * - FOV = 2 * arctan(sensor_width / (2 * focal_length))
 * - Ground Coverage Width = altitude * tan(FOV/2) * 2
 * - Image Overlap = (1 - image_spacing / ground_coverage_width) * 100
 * - Flight Altitude = (target_GSD * focal_length) / sensor_pixel_size
 */

export interface SensorSpecs {
  sensorWidth: number; // mm
  sensorHeight: number; // mm
  pixelSize: number; // micrometers
  focalLength: number; // mm
}

export interface FlightParameters {
  altitude: number; // meters
  imageOverlapLongitudinal: number; // percentage (80-95)
  imageOverlapLateral: number; // percentage (70-85)
}

export interface CalculationResult {
  fov: number; // degrees
  gsd: number; // cm
  groundCoverageWidth: number; // meters
  groundCoverageHeight: number; // meters
  imageSizeLongitudinal: number; // meters
  imageSizeLateral: number; // meters
  imageSpacingLongitudinal: number; // meters
  imageSpacingLateral: number; // meters
  imagesPerLine: number; // for 1km coverage
  flightLines: number; // for 1km coverage
  totalImages: number; // for 1km coverage
  isValid: boolean;
  constraints: ConstraintStatus;
}

export interface ConstraintStatus {
  gsdValid: boolean;
  gsdMessage: string;
  overlapLongitudinalValid: boolean;
  overlapLongitudinalMessage: string;
  overlapLateralValid: boolean;
  overlapLateralMessage: string;
}

export interface AltitudeRecommendation {
  altitude: number; // meters
  gsd: number; // cm
  groundCoverageWidth: number; // meters
  groundCoverageHeight: number; // meters
}

/**
 * Calculate Field-of-View (FOV) in degrees
 */
export function calculateFOV(sensorWidth: number, focalLength: number): number {
  // FOV = 2 * arctan(sensor_width / (2 * focal_length))
  return (2 * Math.atan(sensorWidth / (2 * focalLength)) * 180) / Math.PI;
}

/**
 * Calculate Ground Sample Distance (GSD) in centimeters
 */
export function calculateGSD(
  altitude: number, // meters
  pixelSize: number, // micrometers
  focalLength: number // mm
): number {
  // Convert altitude to mm for consistency
  const altitudeMm = altitude * 1000;
  // GSD (cm) = (altitude_mm * pixel_size_um) / (focal_length_mm * 10000)
  return (altitudeMm * pixelSize) / (focalLength * 10000);
}

/**
 * Calculate ground coverage dimensions
 */
export function calculateGroundCoverage(
  altitude: number, // meters
  fov: number, // degrees
  sensorWidth: number, // mm
  sensorHeight: number // mm
): { width: number; height: number } {
  // Ground coverage width = altitude * tan(FOV/2) * 2
  const fovRad = (fov * Math.PI) / 180;
  const width = altitude * Math.tan(fovRad / 2) * 2;
  
  // Calculate aspect ratio
  const aspectRatio = sensorWidth / sensorHeight;
  const height = width / aspectRatio;
  
  return { width, height };
}

/**
 * Calculate image spacing based on overlap percentage
 */
export function calculateImageSpacing(
  groundCoverage: number, // meters
  overlapPercentage: number // 0-100
): number {
  // Image spacing = ground_coverage * (1 - overlap_percentage / 100)
  return groundCoverage * (1 - overlapPercentage / 100);
}

/**
 * Perform complete calculation
 */
export function performCalculation(
  sensor: SensorSpecs,
  flight: FlightParameters
): CalculationResult {
  // Calculate FOV
  const fov = calculateFOV(sensor.sensorWidth, sensor.focalLength);
  
  // Calculate GSD
  const gsd = calculateGSD(flight.altitude, sensor.pixelSize, sensor.focalLength);
  
  // Calculate ground coverage
  const coverage = calculateGroundCoverage(
    flight.altitude,
    fov,
    sensor.sensorWidth,
    sensor.sensorHeight
  );
  
  // Calculate image sizes (same as ground coverage for nadir view)
  const imageSizeLongitudinal = coverage.width;
  const imageSizeLateral = coverage.height;
  
  // Calculate image spacing
  const imageSpacingLongitudinal = calculateImageSpacing(
    imageSizeLongitudinal,
    flight.imageOverlapLongitudinal
  );
  const imageSpacingLateral = calculateImageSpacing(
    imageSizeLateral,
    flight.imageOverlapLateral
  );
  
  // Calculate images needed for 1km x 1km coverage
  const imagesPerLine = Math.ceil(1000 / imageSpacingLongitudinal);
  const flightLines = Math.ceil(1000 / imageSpacingLateral);
  const totalImages = imagesPerLine * flightLines;
  
  // Validate constraints
  const constraints: ConstraintStatus = {
    gsdValid: gsd <= 3.0,
    gsdMessage: gsd <= 3.0 
      ? `GSD: ${gsd.toFixed(2)} cm ✓ (≤ 3cm target)`
      : `GSD: ${gsd.toFixed(2)} cm ✗ (exceeds 3cm target)`,
    overlapLongitudinalValid: flight.imageOverlapLongitudinal >= 80,
    overlapLongitudinalMessage: flight.imageOverlapLongitudinal >= 80
      ? `Longitudinal Overlap: ${flight.imageOverlapLongitudinal}% ✓ (≥ 80%)`
      : `Longitudinal Overlap: ${flight.imageOverlapLongitudinal}% ✗ (< 80%)`,
    overlapLateralValid: flight.imageOverlapLateral >= 70,
    overlapLateralMessage: flight.imageOverlapLateral >= 70
      ? `Lateral Overlap: ${flight.imageOverlapLateral}% ✓ (≥ 70%)`
      : `Lateral Overlap: ${flight.imageOverlapLateral}% ✗ (< 70%)`,
  };
  
  const isValid = constraints.gsdValid && 
                  constraints.overlapLongitudinalValid && 
                  constraints.overlapLateralValid;
  
  return {
    fov,
    gsd,
    groundCoverageWidth: coverage.width,
    groundCoverageHeight: coverage.height,
    imageSizeLongitudinal,
    imageSizeLateral,
    imageSpacingLongitudinal,
    imageSpacingLateral,
    imagesPerLine,
    flightLines,
    totalImages,
    isValid,
    constraints,
  };
}

/**
 * Recommend optimal altitude for target GSD
 */
export function recommendAltitude(
  sensor: SensorSpecs,
  targetGSD: number, // cm
  overlapLongitudinal: number = 80,
  overlapLateral: number = 70
): AltitudeRecommendation[] {
  // Altitude = (target_GSD * focal_length) / (pixel_size)
  // target_GSD in cm, so convert: (target_GSD_cm * 10 * focal_length_mm) / (pixel_size_um)
  const recommendedAltitude = (targetGSD * 10 * sensor.focalLength) / sensor.pixelSize;
  
  // Generate recommendations around the calculated altitude
  const recommendations: AltitudeRecommendation[] = [];
  const altitudes = [
    recommendedAltitude * 0.9,
    recommendedAltitude,
    recommendedAltitude * 1.1,
  ];
  
  for (const altitude of altitudes) {
    const result = performCalculation(sensor, {
      altitude,
      imageOverlapLongitudinal: overlapLongitudinal,
      imageOverlapLateral: overlapLateral,
    });
    
    recommendations.push({
      altitude,
      gsd: result.gsd,
      groundCoverageWidth: result.groundCoverageWidth,
      groundCoverageHeight: result.groundCoverageHeight,
    });
  }
  
  return recommendations;
}

/**
 * Format numbers for display
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Validate sensor specifications
 */
export function validateSensorSpecs(sensor: SensorSpecs): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (sensor.sensorWidth <= 0) errors.push("Sensor width must be positive");
  if (sensor.sensorHeight <= 0) errors.push("Sensor height must be positive");
  if (sensor.pixelSize <= 0) errors.push("Pixel size must be positive");
  if (sensor.focalLength <= 0) errors.push("Focal length must be positive");
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate flight parameters
 */
export function validateFlightParameters(flight: FlightParameters): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (flight.altitude <= 0) errors.push("Altitude must be positive");
  if (flight.imageOverlapLongitudinal < 0 || flight.imageOverlapLongitudinal > 100)
    errors.push("Longitudinal overlap must be between 0-100%");
  if (flight.imageOverlapLateral < 0 || flight.imageOverlapLateral > 100)
    errors.push("Lateral overlap must be between 0-100%");
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
