# Gesis AppKit Icon Generator

A static web application for uploading, resizing, and downloading images for application icons. Built as a client-side tool that runs entirely in the browser.

## Live Demo

Visit the application at: [https://maxhaag.github.io/gesis-appkit-icon-generator/](https://maxhaag.github.io/gesis-appkit-icon-generator/)

## Features

- **Image Upload**: Drag-and-drop or click to select images (PNG, JPEG, SVG)
- **Smart Resizing**: Resize images to specified dimensions (default 1024x1024)
- **Aspect Ratio Control**: Option to maintain original aspect ratio
- **Black Square Generation**: Create solid black square images for placeholders
- **Instant Preview**: See original and resized images side-by-side
- **One-Click Download**: Download processed images as PNG files
- **Responsive Design**: Works on desktop and mobile devices

## Technical Details

### Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Image Processing**: HTML5 Canvas API
- **Hosting**: GitHub Pages

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Usage

1. **Upload an Image**:
   - Drag and drop an image onto the upload zone
   - Or click the upload zone to select a file

2. **Configure Settings**:
   - Set target width and height (default: 1024x1024)
   - Toggle "Keep aspect ratio" to maintain proportions
   - Images are centered within the target dimensions

3. **Generate Black Square** (Optional):
   - Click "Generate Black Square" to create a solid black image
   - Useful for placeholder icons or backgrounds

4. **Download**:
   - Click "Download Resized Image" to save as PNG
   - Files are automatically named: `originalname_WIDTHxHEIGHT.png`

## Project Structure

```
gesis-appkit-icon-generator/
├── index.html          # Main application page
├── style.css           # Custom styles and animations
├── app.js             # Core application logic
├── assets/            # Static assets directory
├── README.md          # This documentation
└── LICENSE            # MIT license file
```

## Development

This is a static website that requires no build process or dependencies.

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/maxhaag/gesis-appkit-icon-generator.git
   cd gesis-appkit-icon-generator
   ```

2. Serve the files using any local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with serve package)
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```

3. Open your browser to `http://localhost:8000`

### Deployment

The application is automatically deployed to GitHub Pages from the `main` branch.

## Features in Detail

### Image Processing
- Uses HTML5 Canvas for client-side image manipulation
- Supports PNG, JPEG, and SVG input formats
- Maintains image quality during resize operations
- Centers images within specified dimensions
- White background for transparent images

### User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout for all screen sizes
- Drag-and-drop file upload with visual feedback
- Real-time preview of original and processed images
- Accessible form controls and navigation

### File Handling
- Client-side processing (no server uploads)
- Automatic filename generation with dimensions
- PNG output format for maximum compatibility
- Error handling for invalid file types

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines
- Follow existing code style and conventions
- Test your changes across different browsers
- Update documentation as needed
- Keep commits focused and descriptive

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About

Created for [GESIS - Leibniz Institute for the Social Sciences](https://www.gesis.org/) to provide a simple tool for generating application icons and placeholders.

## Issues

If you encounter any problems or have suggestions, please [open an issue](https://github.com/maxhaag/gesis-appkit-icon-generator/issues) on GitHub.

---

Made with care for the open source community