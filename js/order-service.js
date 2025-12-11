// Order Service Form Handler
let selectedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    const serviceTypeInputs = document.querySelectorAll('input[name="serviceType"]');
    const durationSection = document.getElementById('animationDurationSection');
    const durationInput = document.getElementById('duration');
    const fileUpload = document.getElementById('fileUpload');
    const priceEstimate = document.getElementById('priceEstimate');

    // Service type change handler
    serviceTypeInputs.forEach(input => {
        input.addEventListener('change', handleServiceTypeChange);
    });

    // Duration input change handler
    if (durationInput) {
        durationInput.addEventListener('input', calculatePrice);
    }

    // File upload handler
    if (fileUpload) {
        fileUpload.addEventListener('change', handleFileUpload);
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// Handle service type selection
function handleServiceTypeChange(e) {
    const serviceType = e.target.value;
    const durationSection = document.getElementById('animationDurationSection');
    const durationInput = document.getElementById('duration');
    const durationNote = document.getElementById('durationNote');

    // Show/hide duration section for animation services
    const animationServices = ['infomercial-animation', 'hand-drawn-animation', '3d-animation'];
    
    if (animationServices.includes(serviceType)) {
        durationSection.style.display = 'block';
        durationInput.required = true;
        
        // Set minimum duration and update note
        switch(serviceType) {
            case 'infomercial-animation':
                durationInput.min = 10;
                durationNote.textContent = 'Minimum 10 seconds required (20 MVR/second)';
                break;
            case 'hand-drawn-animation':
                durationInput.min = 5;
                durationNote.textContent = 'Minimum 5 seconds required (150 MVR/second)';
                break;
            case '3d-animation':
                durationInput.min = 5;
                durationNote.textContent = 'Minimum 5 seconds required (250 MVR/second)';
                break;
        }
    } else {
        durationSection.style.display = 'none';
        durationInput.required = false;
        durationInput.value = '';
    }

    calculatePrice();
}

// Calculate and display price estimate
function calculatePrice() {
    const serviceType = document.querySelector('input[name="serviceType"]:checked');
    const duration = document.getElementById('duration').value;
    const priceEstimate = document.getElementById('priceEstimate');
    const basePrice = document.getElementById('basePrice');
    const durationPriceRow = document.getElementById('durationPriceRow');
    const durationPrice = document.getElementById('durationPrice');
    const durationPriceLabel = document.getElementById('durationPriceLabel');
    const totalPrice = document.getElementById('totalPrice');

    if (!serviceType) {
        priceEstimate.style.display = 'none';
        return;
    }

    priceEstimate.style.display = 'block';
    let price = 0;
    let showDuration = false;

    switch(serviceType.value) {
        case 'social-post':
            basePrice.textContent = '150 MVR';
            price = 150;
            break;
        
        case 'video-editing':
            basePrice.textContent = '500 - 2,000 MVR';
            totalPrice.textContent = 'Custom Quote';
            return;
        
        case 'infomercial-animation':
            if (duration && duration >= 10) {
                const seconds = parseInt(duration);
                const animationCost = seconds * 20;
                basePrice.textContent = '20 MVR/second';
                durationPriceLabel.textContent = `${seconds} seconds:`;
                durationPrice.textContent = `${animationCost.toLocaleString()} MVR`;
                durationPriceRow.style.display = 'flex';
                price = animationCost;
                showDuration = true;
            } else {
                basePrice.textContent = '20 MVR/second';
                totalPrice.textContent = 'Min 200 MVR (10 seconds)';
                return;
            }
            break;
        
        case 'hand-drawn-animation':
            if (duration && duration >= 5) {
                const seconds = parseInt(duration);
                const animationCost = seconds * 150;
                basePrice.textContent = '150 MVR/second';
                durationPriceLabel.textContent = `${seconds} seconds:`;
                durationPrice.textContent = `${animationCost.toLocaleString()} MVR`;
                durationPriceRow.style.display = 'flex';
                price = animationCost;
                showDuration = true;
            } else {
                basePrice.textContent = '150 MVR/second';
                totalPrice.textContent = 'Min 750 MVR (5 seconds)';
                return;
            }
            break;
        
        case '3d-animation':
            if (duration && duration >= 5) {
                const seconds = parseInt(duration);
                const animationCost = seconds * 250;
                basePrice.textContent = '250 MVR/second';
                durationPriceLabel.textContent = `${seconds} seconds:`;
                durationPrice.textContent = `${animationCost.toLocaleString()} MVR`;
                durationPriceRow.style.display = 'flex';
                price = animationCost;
                showDuration = true;
            } else {
                basePrice.textContent = '250 MVR/second';
                totalPrice.textContent = 'Min 1,250 MVR (5 seconds)';
                return;
            }
            break;
        
        case 'tournament-system':
            basePrice.textContent = 'Custom Pricing';
            totalPrice.textContent = 'Contact for Quote';
            return;
        
        case 'basic-website':
            basePrice.textContent = '3,000+ MVR';
            totalPrice.textContent = 'Starting at 3,000 MVR';
            return;
        
        case 'business-website':
            basePrice.textContent = '8,000+ MVR';
            totalPrice.textContent = 'Starting at 8,000 MVR';
            return;
        
        case 'ecommerce-website':
            basePrice.textContent = '15,000+ MVR';
            totalPrice.textContent = 'Starting at 15,000 MVR';
            return;
        
        case 'custom-web-app':
            basePrice.textContent = 'Custom Pricing';
            totalPrice.textContent = 'Contact for Quote';
            return;
    }

    if (!showDuration) {
        durationPriceRow.style.display = 'none';
    }

    if (price > 0) {
        totalPrice.textContent = `${price.toLocaleString()} MVR`;
    }
}

// Handle file uploads
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    const fileList = document.getElementById('fileList');
    
    files.forEach(file => {
        if (!selectedFiles.find(f => f.name === file.name)) {
            selectedFiles.push(file);
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>📎 ${file.name} (${formatFileSize(file.size)})</span>
                <button type="button" onclick="removeFile('${file.name}')">&times;</button>
            `;
            fileList.appendChild(fileItem);
        }
    });
    
    e.target.value = '';
}

// Remove file from list
function removeFile(fileName) {
    selectedFiles = selectedFiles.filter(f => f.name !== fileName);
    const fileList = document.getElementById('fileList');
    const fileItems = fileList.querySelectorAll('.file-item');
    
    fileItems.forEach(item => {
        if (item.textContent.includes(fileName)) {
            item.remove();
        }
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
        // Get form data
        const formData = {
            serviceType: document.querySelector('input[name="serviceType"]:checked')?.value,
            duration: document.getElementById('duration').value,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            projectTitle: document.getElementById('projectTitle').value,
            description: document.getElementById('description').value,
            deadline: document.getElementById('deadline').value,
            budget: document.getElementById('budget').value,
            urgency: document.getElementById('urgency').value,
            additionalNotes: document.getElementById('additionalNotes').value,
            estimatedPrice: document.getElementById('totalPrice').textContent,
            fileCount: selectedFiles.length,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Validate service type
        if (!formData.serviceType) {
            throw new Error('Please select a service type');
        }
        
        // Save to Firestore
        const ordersRef = firebase.firestore().collection('oneTimeOrders');
        const docRef = await ordersRef.add(formData);
        
        console.log('Order submitted successfully:', docRef.id);
        
        // Show success message
        successMessage.style.display = 'block';
        successMessage.innerHTML = `
            <strong>Order submitted successfully!</strong><br>
            Thank you for your order request. We'll review your requirements and get back to you within 24 hours at ${formData.email}.
            <br><br>
            Order Reference: ${docRef.id.substring(0, 8).toUpperCase()}
        `;
        
        // Reset form
        e.target.reset();
        selectedFiles = [];
        document.getElementById('fileList').innerHTML = '';
        document.getElementById('priceEstimate').style.display = 'none';
        document.getElementById('animationDurationSection').style.display = 'none';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } catch (error) {
        console.error('Error submitting order:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = error.message || 'Failed to submit order. Please try again or contact us directly.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Order Request';
    }
}
