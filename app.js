class IconGenerator {
    constructor() {
        this.currentFile = null;
        this.originalImage = null;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.originalImageEl = document.getElementById('originalImage');
        this.resizedCanvas = document.getElementById('resizedCanvas');
        this.widthInput = document.getElementById('widthInput');
        this.heightInput = document.getElementById('heightInput');
        this.resizeMode = document.getElementById('resizeMode');
        this.stretchMode = document.getElementById('stretchMode');
        this.cropMode = document.getElementById('cropMode');
        this.colorPicker = document.getElementById('colorPicker');
        this.generateColorSquareBtn = document.getElementById('generateColorSquare');
        this.downloadBtn = document.getElementById('downloadResized');
        this.previewContainer = document.getElementById('previewContainer');
        this.noPreview = document.getElementById('noPreview');
        this.originalDimensions = document.getElementById('originalDimensions');
        this.resizedDimensions = document.getElementById('resizedDimensions');
    }

    attachEventListeners() {
        // Drop zone events
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));

        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Dimension inputs
        this.widthInput.addEventListener('input', () => this.handleDimensionChange('width'));
        this.heightInput.addEventListener('input', () => this.handleDimensionChange('height'));
        
        // Processing mode radio buttons
        this.resizeMode.addEventListener('change', () => this.updatePreview());
        this.stretchMode.addEventListener('change', () => this.updatePreview());
        this.cropMode.addEventListener('change', () => this.updatePreview());

        // Buttons
        this.generateColorSquareBtn.addEventListener('click', () => this.generateColorSquare());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!this.isValidImageFile(file)) {
            this.showMessage('Please select a valid image file (PNG, JPEG, or SVG)', 'error');
            return;
        }

        this.currentFile = file;
        this.loadImage(file);
    }

    isValidImageFile(file) {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        return validTypes.includes(file.type);
    }

    loadImage(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.displayOriginalImage(e.target.result);
                this.updateDimensions();
                this.updatePreview();
                this.showPreview();
                this.enableDownloadButton();
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }

    displayOriginalImage(src) {
        this.originalImageEl.src = src;
        this.originalImageEl.onload = () => {
            const { width, height } = this.originalImage;
            this.originalDimensions.textContent = `${width} × ${height} px`;
        };
    }

    showPreview() {
        this.previewContainer.classList.remove('hidden');
        this.previewContainer.classList.add('fade-in');
        this.noPreview.classList.add('hidden');
    }

    hidePreview() {
        this.previewContainer.classList.add('hidden');
        this.previewContainer.classList.remove('fade-in');
        this.noPreview.classList.remove('hidden');
        this.disableDownloadButton();
    }

    updateDimensions() {
        if (this.resizeMode.checked && this.originalImage) {
            const aspectRatio = this.originalImage.width / this.originalImage.height;
            const currentWidth = parseInt(this.widthInput.value);
            const currentHeight = parseInt(this.heightInput.value);
            
            // Determine which dimension to adjust based on the current aspect ratio
            if (currentWidth / currentHeight > aspectRatio) {
                this.widthInput.value = Math.round(currentHeight * aspectRatio);
            } else {
                this.heightInput.value = Math.round(currentWidth / aspectRatio);
            }
        }
    }

    handleDimensionChange(changedDimension) {
        if (this.resizeMode.checked && this.originalImage) {
            const aspectRatio = this.originalImage.width / this.originalImage.height;
            
            if (changedDimension === 'width') {
                const width = parseInt(this.widthInput.value);
                this.heightInput.value = Math.round(width / aspectRatio);
            } else {
                const height = parseInt(this.heightInput.value);
                this.widthInput.value = Math.round(height * aspectRatio);
            }
        }
        
        this.updatePreview();
    }

    updatePreview() {
        if (!this.originalImage) return;

        const targetWidth = parseInt(this.widthInput.value);
        const targetHeight = parseInt(this.heightInput.value);
        
        this.resizeImage(this.originalImage, targetWidth, targetHeight);
        this.resizedDimensions.textContent = `${targetWidth} × ${targetHeight} px`;
    }

    resizeImage(img, targetWidth, targetHeight) {
        const canvas = this.resizedCanvas;
        const ctx = canvas.getContext('2d');
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        
        if (this.cropMode.checked) {
            // Crop mode: center crop to fill exact dimensions
            this.cropToFit(ctx, img, targetWidth, targetHeight);
        } else if (this.stretchMode.checked) {
            // Stretch mode: fill entire canvas
            this.stretchToFit(ctx, img, targetWidth, targetHeight);
        } else {
            // Resize mode: fit image within dimensions keeping aspect ratio
            this.resizeToFit(ctx, img, targetWidth, targetHeight);
        }
    }

    generateColorSquare() {
        const width = parseInt(this.widthInput.value);
        const height = parseInt(this.heightInput.value);
        const color = this.colorPicker.value;
        
        const canvas = this.resizedCanvas;
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Fill with selected color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        
        this.resizedDimensions.textContent = `${width} × ${height} px`;
        this.showPreview();
        this.enableDownloadButton();
        
        // Clear original image display
        this.originalImageEl.src = '';
        this.originalDimensions.textContent = '';
        this.currentFile = null;
        this.originalImage = null;
    }

    cropToFit(ctx, img, targetWidth, targetHeight) {
        const imgAspectRatio = img.width / img.height;
        const targetAspectRatio = targetWidth / targetHeight;
        
        let sourceX, sourceY, sourceWidth, sourceHeight;
        
        if (imgAspectRatio > targetAspectRatio) {
            // Image is wider - crop sides
            sourceHeight = img.height;
            sourceWidth = img.height * targetAspectRatio;
            sourceX = (img.width - sourceWidth) / 2;
            sourceY = 0;
        } else {
            // Image is taller - crop top/bottom
            sourceWidth = img.width;
            sourceHeight = img.width / targetAspectRatio;
            sourceX = 0;
            sourceY = (img.height - sourceHeight) / 2;
        }
        
        // Draw cropped image to fill entire canvas
        ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, targetWidth, targetHeight
        );
    }
    
    resizeToFit(ctx, img, targetWidth, targetHeight) {
        const imgAspectRatio = img.width / img.height;
        const targetAspectRatio = targetWidth / targetHeight;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspectRatio > targetAspectRatio) {
            // Image is wider than target
            drawWidth = targetWidth;
            drawHeight = targetWidth / imgAspectRatio;
            offsetX = 0;
            offsetY = (targetHeight - drawHeight) / 2;
        } else {
            // Image is taller than target
            drawWidth = targetHeight * imgAspectRatio;
            drawHeight = targetHeight;
            offsetX = (targetWidth - drawWidth) / 2;
            offsetY = 0;
        }
        
        // Draw the image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
    
    stretchToFit(ctx, img, targetWidth, targetHeight) {
        // Stretch image to fill entire canvas
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    }

    downloadImage() {
        const canvas = this.resizedCanvas;
        
        // Create download link
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            const width = parseInt(this.widthInput.value);
            const height = parseInt(this.heightInput.value);
            const mode = this.cropMode.checked ? 'cropped' : 
                        this.stretchMode.checked ? 'stretched' : 'resized';
            const filename = this.currentFile ? 
                `${this.currentFile.name.split('.')[0]}_${mode}_${width}x${height}.png` :
                `color_square_${this.colorPicker.value.substring(1)}_${width}x${height}.png`;
            
            link.href = url;
            link.download = filename;
            link.click();
            
            // Clean up
            URL.revokeObjectURL(url);
            
            this.showMessage('Image downloaded successfully!', 'success');
        }, 'image/png');
    }

    enableDownloadButton() {
        this.downloadBtn.disabled = false;
    }

    disableDownloadButton() {
        this.downloadBtn.disabled = true;
    }

    showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Insert after header
        const header = document.querySelector('header');
        header.parentNode.insertBefore(message, header.nextSibling);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IconGenerator();
});