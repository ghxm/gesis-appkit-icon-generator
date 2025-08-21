# Gesis AppKit Icon Generator

A static web application for uploading, resizing, and downloading images for application icons.

## Live Demo

Visit the application at: [https://ghxm.github.io/gesis-appkit-icon-generator/](https://ghxm.github.io/gesis-appkit-icon-generator/)

## Features

- Drag-and-drop image upload (PNG, JPEG, SVG)
- Resize to custom dimensions (default 1024x1024)
- Keep aspect ratio option
- Crop to exact size
- Generate solid black squares
- Real-time preview
- One-click PNG download

## Usage

1. Upload an image by dragging or clicking
2. Set target dimensions
3. Toggle "Keep aspect ratio" if needed
4. Click "Download Resized Image"

## Development

Static HTML/CSS/JS website - no build process required.

```bash
git clone https://github.com/ghxm/gesis-appkit-icon-generator.git
cd gesis-appkit-icon-generator
python -m http.server 8000  # or any local server
```

## Disclaimer

This is an independent tool created to help with icon generation and is **not an official GESIS service** or part of the official GESIS AppKit. It is a community-created utility that uses the GESIS name only to indicate its intended use case.

## License

MIT License - see [LICENSE](LICENSE) file.