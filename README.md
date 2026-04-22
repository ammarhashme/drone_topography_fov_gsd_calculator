# FOV & GSD Altitude Calculator QGIS Plugin

A professional QGIS plugin for deriving sensor Field-of-View (FOV) and altitude parameters to ensure sub-3cm Ground Sample Distance (GSD) with 80/70 image overlap for centimeter-grade topographical modeling.

## Overview

This plugin provides geospatial professionals and drone operators with a powerful tool to calculate optimal flight parameters for aerial photogrammetry missions. It integrates seamlessly into QGIS and enables rapid mission planning with precise constraint validation.

### Key Features

- **FOV Calculation**: Compute sensor Field-of-View based on sensor dimensions and focal length
- **GSD Derivation**: Calculate Ground Sample Distance at specified flight altitudes
- **Altitude Recommendations**: Generate optimal altitude suggestions for target GSD values
- **Constraint Validation**: Real-time validation of GSD (≤3cm), longitudinal overlap (≥80%), and lateral overlap (≥70%)
- **Ground Coverage Analysis**: Calculate ground coverage dimensions and area per image
- **Image Spacing Calculations**: Determine longitudinal and lateral image spacing
- **Coverage Estimation**: Estimate images required for 1km × 1km survey areas
- **Results Export**: Copy calculation results to clipboard for documentation

## Installation

### Method 1: Manual Installation

1. **Locate QGIS plugins directory**:
   - **Windows**: `C:\Users\<YourUsername>\AppData\Roaming\QGIS\QGIS3\profiles\default\python\plugins`
   - **macOS**: `~/Library/Application Support/QGIS/QGIS3/profiles/default/python/plugins`
   - **Linux**: `~/.local/share/QGIS/QGIS3/profiles/default/python/plugins`

2. **Clone the repository**:
   ```bash
   cd <plugins_directory>
   git clone https://github.com/yourusername/fov_gsd_calculator.git
   ```

3. **Restart QGIS** and enable the plugin:
   - Go to **Plugins** → **Manage and Install Plugins**
   - Search for "FOV & GSD Altitude Calculator"
   - Check the box to enable the plugin

### Method 2: From ZIP File

1. Download the latest release as a ZIP file
2. Extract to your QGIS plugins directory
3. Rename the extracted folder to `fov_gsd_calculator`
4. Restart QGIS and enable the plugin

## Usage

### Opening the Calculator

1. In QGIS, go to **Plugins** → **FOV & GSD Calculator** → **FOV & GSD Calculator**
2. The calculator dialog will open with default values for a full-frame camera

### Input Parameters

#### Sensor Specifications

- **Sensor Width (mm)**: Physical width of the camera sensor (e.g., 36mm for full-frame)
- **Sensor Height (mm)**: Physical height of the camera sensor (e.g., 24mm for full-frame)
- **Pixel Size (μm)**: Individual pixel size in micrometers (typically 3-6μm for mapping cameras)
- **Focal Length (mm)**: Lens focal length in millimeters (e.g., 35mm, 50mm)

#### Flight Configuration

- **Flight Altitude (m)**: Above Ground Level (AGL) altitude for the survey
- **Longitudinal Overlap (%)**: Forward overlap between consecutive images (recommended ≥80%)
- **Lateral Overlap (%)**: Side overlap between flight lines (recommended ≥70%)

#### Altitude Recommendations

- **Target GSD (cm)**: Desired Ground Sample Distance for mission planning
- Click on any recommendation row to automatically set the flight altitude

### Output Results

#### Constraint Status

The plugin validates three critical constraints:

- **GSD Constraint**: Checks if GSD ≤ 3cm (centimeter-grade requirement)
- **Longitudinal Overlap**: Validates overlap ≥ 80% for stereo coverage
- **Lateral Overlap**: Validates overlap ≥ 70% for tie-point generation
- **Overall Status**: Indicates if configuration meets all requirements

#### Calculation Results

- **Field of View**: Sensor FOV in degrees
- **Ground Sample Distance**: GSD in centimeters
- **Ground Coverage Width/Height**: Area covered per image in meters
- **Area per Image**: Total ground area captured per image in m²
- **Image Spacing**: Longitudinal and lateral spacing between images

#### 1km × 1km Coverage Estimate

- **Images per Line**: Number of images required for 1km longitudinal coverage
- **Flight Lines**: Number of flight lines required for 1km lateral coverage
- **Total Images**: Total images needed for complete 1km × 1km coverage

## Formulas

The plugin uses standard photogrammetric formulas:

### Field of View (FOV)
```
FOV = 2 × arctan(sensor_width / (2 × focal_length))
```

### Ground Sample Distance (GSD)
```
GSD (cm) = (altitude_mm × pixel_size_μm) / (focal_length_mm × 10000)
```

### Ground Coverage
```
width = altitude × tan(FOV/2) × 2
height = width / aspect_ratio
```

### Image Spacing
```
spacing = ground_coverage × (1 - overlap% / 100)
```

### Recommended Altitude
```
altitude = (target_GSD_cm × 10 × focal_length_mm) / pixel_size_μm
```

## Common Sensor Presets

### Full-Frame Cameras
- Sensor Width: 36mm
- Sensor Height: 24mm
- Pixel Size: 4-6μm (varies by model)

### APS-C Cameras
- Sensor Width: 23.5mm
- Sensor Height: 15.7mm
- Pixel Size: 4-5μm (varies by model)

### Drone Cameras
- Sensor Width: 13.3mm (typical)
- Sensor Height: 8.8mm (typical)
- Pixel Size: 2-3μm (varies by model)

## Requirements

- QGIS 3.16 or higher
- Python 3.6+
- PyQt5 (included with QGIS)

## System Compatibility

- **Windows**: QGIS 3.16+
- **macOS**: QGIS 3.16+
- **Linux**: QGIS 3.16+

## Troubleshooting

### Plugin Not Appearing

1. Verify the plugin folder is in the correct location
2. Check that `metadata.txt` is present and properly formatted
3. Restart QGIS completely
4. Check QGIS logs for errors: **Help** → **System Information** → **Logs**

### Calculation Errors

1. Ensure all input values are positive numbers
2. Check that sensor dimensions are in millimeters
3. Verify pixel size is in micrometers
4. Confirm altitude is in meters

### Results Not Updating

1. Ensure all input fields contain valid numbers
2. Try closing and reopening the dialog
3. Restart QGIS if issues persist

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Submit a Pull Request

## Development

### Project Structure

```
fov_gsd_calculator/
├── __init__.py              # Plugin entry point
├── fov_gsd_calculator.py    # Main plugin class
├── dialog.py                # PyQt5 dialog UI
├── calculations.py          # Core calculation engine
├── metadata.txt             # Plugin metadata
├── icon.svg                 # Plugin icon
└── README.md                # This file
```

### Testing

To test the plugin locally:

1. Copy the plugin folder to your QGIS plugins directory
2. Restart QGIS
3. Enable the plugin in **Plugins** → **Manage and Install Plugins**
4. Open the calculator from **Plugins** → **FOV & GSD Calculator**

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

## Citation

If you use this plugin in your research or professional work, please cite:

```
FOV & GSD Altitude Calculator QGIS Plugin (2024)
Developed by Manus AI
https://github.com/yourusername/fov_gsd_calculator
```

## Support

For issues, questions, or suggestions:

1. Check the [Issues](https://github.com/yourusername/fov_gsd_calculator/issues) page
2. Create a new issue with detailed description
3. Include QGIS version and operating system information

## Changelog

### Version 1.0.0 (Initial Release)

- Full FOV/GSD/Altitude calculation engine
- Real-time constraint validation
- Altitude recommendations for target GSD
- Professional PyQt5 UI with tabbed interface
- Support for custom sensor specifications
- 1km coverage estimates
- Results export to clipboard

## Acknowledgments

This plugin implements standard photogrammetric formulas used in aerial surveying and drone mapping. The calculation engine is based on established principles in remote sensing and photogrammetry.

## References

- Lillesand, T. M., Kiefer, R. W., & Chipman, J. W. (2015). Remote Sensing and Image Interpretation (7th ed.). Wiley.
- Eos Systems Inc. (2024). PhotoScan Professional Edition Documentation.
- Pix4D. (2024). Pix4D Mapper Documentation.

---

**Developed with ❤️ for the geospatial community**
