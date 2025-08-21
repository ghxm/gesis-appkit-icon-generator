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
        this.keepAspectRatio = document.getElementById('keepAspectRatio');
        this.generateBlackSquareBtn = document.getElementById('generateBlackSquare');
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
        this.keepAspectRatio.addEventListener('change', () => this.updatePreview());

        // Buttons
        this.generateBlackSquareBtn.addEventListener('click', () => this.generateBlackSquare());
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
        if (this.keepAspectRatio.checked && this.originalImage) {
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
        if (this.keepAspectRatio.checked && this.originalImage) {
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
        
        // Calculate scaling and positioning for centered image
        const imgAspectRatio = img.width / img.height;
        const targetAspectRatio = targetWidth / targetHeight;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (this.keepAspectRatio.checked) {
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
        } else {
            // Stretch to fill
            drawWidth = targetWidth;
            drawHeight = targetHeight;
            offsetX = 0;
            offsetY = 0;
        }
        
        // Draw the image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    generateBlackSquare() {
        const width = parseInt(this.widthInput.value);
        const height = parseInt(this.heightInput.value);
        
        const canvas = this.resizedCanvas;
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Fill with black
        ctx.fillStyle = '#000000';
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

    downloadImage() {
        const canvas = this.resizedCanvas;
        
        // Create download link
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            const width = parseInt(this.widthInput.value);
            const height = parseInt(this.heightInput.value);
            const filename = this.currentFile ? 
                `${this.currentFile.name.split('.')[0]}_${width}x${height}.png` :
                `black_square_${width}x${height}.png`;
            
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