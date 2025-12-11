// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'YOUR_CLOUD_NAME', // Replace with your Cloudinary cloud name
    uploadPreset: 'YOUR_UPLOAD_PRESET' // Replace with your upload preset
};

// Upload image to Cloudinary
async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    
    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        const data = await response.json();
        
        if (data.secure_url) {
            return {
                success: true,
                url: data.secure_url,
                publicId: data.public_id
            };
        } else {
            return {
                success: false,
                error: 'Upload failed'
            };
        }
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Delete image from Cloudinary (requires backend or signed requests)
async function deleteImageFromCloudinary(publicId) {
    // Note: Deleting images requires authentication
    // This typically needs to be done server-side or with signed requests
    console.log('Delete image:', publicId);
    // TODO: Implement server-side deletion endpoint
}

// Image upload widget for forms
function createImageUploadWidget(containerId, onUploadSuccess) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const uploadWidget = document.createElement('div');
    uploadWidget.className = 'image-upload-widget';
    uploadWidget.innerHTML = `
        <div class="upload-area" id="uploadArea-${containerId}">
            <div class="upload-icon">📸</div>
            <p>Click to upload or drag and drop</p>
            <small>PNG, JPG up to 5MB</small>
            <input type="file" id="fileInput-${containerId}" accept="image/*" style="display: none;">
        </div>
        <div class="upload-preview" id="preview-${containerId}" style="display: none;">
            <img id="previewImg-${containerId}" src="" alt="Preview">
            <button class="remove-image-btn" id="removeBtn-${containerId}">Remove</button>
        </div>
        <div class="upload-progress" id="progress-${containerId}" style="display: none;">
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill-${containerId}"></div>
            </div>
            <p>Uploading...</p>
        </div>
    `;
    
    container.appendChild(uploadWidget);
    
    const uploadArea = document.getElementById(`uploadArea-${containerId}`);
    const fileInput = document.getElementById(`fileInput-${containerId}`);
    const preview = document.getElementById(`preview-${containerId}`);
    const previewImg = document.getElementById(`previewImg-${containerId}`);
    const removeBtn = document.getElementById(`removeBtn-${containerId}`);
    const progress = document.getElementById(`progress-${containerId}`);
    
    let currentImageUrl = null;
    let currentPublicId = null;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#e0e0e0';
    });
    
    uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e0e0e0';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            await handleImageUpload(file);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleImageUpload(file);
        }
    });
    
    // Remove image
    removeBtn.addEventListener('click', () => {
        currentImageUrl = null;
        currentPublicId = null;
        preview.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
        if (onUploadSuccess) {
            onUploadSuccess(null);
        }
    });
    
    async function handleImageUpload(file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        // Show progress
        uploadArea.style.display = 'none';
        progress.style.display = 'block';
        
        // Upload to Cloudinary
        const result = await uploadImageToCloudinary(file);
        
        progress.style.display = 'none';
        
        if (result.success) {
            currentImageUrl = result.url;
            currentPublicId = result.publicId;
            
            // Show preview
            previewImg.src = result.url;
            preview.style.display = 'block';
            
            // Callback
            if (onUploadSuccess) {
                onUploadSuccess(result.url, result.publicId);
            }
        } else {
            alert('Error uploading image: ' + result.error);
            uploadArea.style.display = 'block';
        }
    }
    
    return {
        getImageUrl: () => currentImageUrl,
        getPublicId: () => currentPublicId,
        setImage: (url) => {
            if (url) {
                currentImageUrl = url;
                previewImg.src = url;
                preview.style.display = 'block';
                uploadArea.style.display = 'none';
            }
        }
    };
}

// CSS for image upload widget
const uploadWidgetStyles = `
<style>
.image-upload-widget {
    margin: 1rem 0;
}

.upload-area {
    border: 2px dashed #e0e0e0;
    border-radius: var(--border-radius);
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
}

.upload-area:hover {
    border-color: var(--primary-color);
    background: rgba(175, 115, 239, 0.05);
}

.upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.upload-area p {
    margin-bottom: 0.5rem;
    color: var(--text-dark);
}

.upload-area small {
    color: var(--text-light);
}

.upload-preview {
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
}

.upload-preview img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    display: block;
}

.remove-image-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
    color: #c62828;
}

.remove-image-btn:hover {
    background: #fff;
}

.upload-progress {
    text-align: center;
    padding: 2rem;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    width: 0%;
    animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
}
</style>
`;

// Add styles to document
if (!document.getElementById('cloudinary-widget-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'cloudinary-widget-styles';
    styleElement.innerHTML = uploadWidgetStyles;
    document.head.appendChild(styleElement);
}
