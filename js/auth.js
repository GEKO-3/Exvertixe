// Authentication handling for login and signup pages

// Sign Up Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        const errorMessage = document.getElementById('errorMessage');
        
        // Validation
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (!terms) {
            showError('Please agree to the Terms of Service');
            return;
        }
        
        // Disable submit button
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
        
        // Call Firebase signup function
        const result = await signUp(email, password, fullName);
        
        if (result.success) {
            // Show success message with verification instructions
            errorMessage.style.display = 'none';
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.display = 'block';
            successDiv.innerHTML = `
                <strong>Account created successfully!</strong><br>
                A verification email has been sent to <strong>${email}</strong>.<br>
                Please check your inbox and click the verification link to activate your account.<br><br>
                <small>You can log in once your email is verified.</small>
            `;
            signupForm.insertBefore(successDiv, submitBtn);
            
            // Sign out user until they verify email (after showing message)
            await auth.signOut();
            
            // Clear form
            signupForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
        } else {
            showError(result.error);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
        }
    });
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Disable submit button
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        // Call Firebase signin function
        const result = await signIn(email, password);
        
        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            showError(result.error);
            
            // If verification needed, show resend option
            if (result.needsVerification && result.user) {
                const errorDiv = document.getElementById('errorMessage');
                const resendBtn = document.createElement('button');
                resendBtn.type = 'button';
                resendBtn.className = 'btn btn-secondary';
                resendBtn.textContent = 'Resend Verification Email';
                resendBtn.style.marginTop = '1rem';
                resendBtn.onclick = async () => {
                    try {
                        await result.user.sendEmailVerification();
                        showSuccess('Verification email sent! Please check your inbox.');
                        resendBtn.remove();
                    } catch (error) {
                        showError('Failed to send verification email: ' + error.message);
                    }
                };
                if (!errorDiv.querySelector('button')) {
                    errorDiv.appendChild(resendBtn);
                }
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
}

// Helper function to show error messages
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
}

// Helper function to show success messages
function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
}

// Password strength indicator (optional enhancement)
const passwordInput = document.getElementById('password');
if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        // You can add password strength visualization here
    });
}
