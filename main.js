// QuickSignage LinkedIn Landing Page JavaScript - Lead Optimized

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFormHandling();
    initializeCounters();
    initializeScrollEffects();
    initializePerformanceOptimizations();
    preloadShopifyImages();
    // Remove animation initialization that might be causing issues
    console.log('QuickSignage page loaded successfully');
});

// Preload Shopify images for faster loading
function preloadShopifyImages() {
    const shopifyImages = [
        'https://cdn.shopify.com/s/files/1/0699/3553/0271/files/3d_blade_sign.jpg?v=1711105522',
        'https://cdn.shopify.com/s/files/1/0699/3553/0271/files/Popped.jpg?v=1711105521',
        'https://cdn.shopify.com/s/files/1/0699/3553/0271/files/AXdD.jpg?v=1711105521',
        'https://cdn.shopify.com/s/files/1/0598/7391/9062/files/11471_BrLite_1_1_1.jpg?v=1746001920',
        'https://cdn.shopify.com/s/files/1/0598/7391/9062/files/Storefront_Signage.webp?v=1721972968',
        'https://cdn.shopify.com/s/files/1/0598/7391/9062/files/Lightbox.webp?v=1721972968'
    ];
    
    shopifyImages.forEach(src => {
        const img = new Image();
        img.src = src;
        // Add to head for browser caching
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    let ticking = false;
    
    // Optimized navbar scroll effect
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Optimized counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + (target === 24 ? '/7' : target === 10 ? ' Days' : '+');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + (target === 24 ? '/7' : target === 10 ? ' Days' : '+');
            }
        }, 16);
    };
    
    // Trigger animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach((counter, index) => {
                    setTimeout(() => animateCounter(counter), index * 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Optimized scroll effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.1; // Reduced parallax intensity for smoother performance
        
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    // Throttled scroll listener
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Enhanced form handling
function initializeFormHandling() {
    const heroForm = document.getElementById('heroQuoteForm');
    const modalForm = document.getElementById('modalQuoteForm');
    
    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleQuoteSubmission(this, 'hero');
        });
    }
    
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleQuoteSubmission(this, 'modal');
        });
    }
    
    // Enhanced form validation for both forms
    const allInputs = document.querySelectorAll('#heroQuoteForm input[required], #heroQuoteForm select[required], #heroQuoteForm textarea[required], #modalQuoteForm input[required], #modalQuoteForm select[required], #modalQuoteForm textarea[required]');
    allInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', debounce(clearFieldError, 300));
    });
    
    // File upload handling for both forms
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(fileInput => {
        fileInput.addEventListener('change', handleFileUpload);
    });
}

// Enhanced quote form submission
function handleQuoteSubmission(form, formType) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing Your Request...';
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate API call with realistic timing
    setTimeout(() => {
        // Track conversion
        trackEvent('quote_form_submission', {
            sign_type: data.signType,
            company: data.company,
            source: 'linkedin',
            form_location: formType,
            form_type: formType
        });
        
        // Show success message
        showSuccessMessage('Thank you! Your request has been submitted successfully. You\'ll receive your free mockup and quote within 24 hours.');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Close modal if it's the modal form
        if (formType === 'modal') {
            const modal = bootstrap.Modal.getInstance(document.getElementById('quoteModal'));
            if (modal) {
                modal.hide();
            }
        }
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 1500);
}

// Enhanced file upload handling
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        // Check file size (20MB limit)
        if (file.size > 20 * 1024 * 1024) {
            showError('File size must be less than 20MB');
            e.target.value = '';
            return;
        }
        
        // Check file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            showError('Please upload a valid file format (PNG, JPG, PDF, AI, EPS)');
            e.target.value = '';
            return;
        }
        
        // Show file name with animation
        const fileName = file.name;
        const fileInfo = document.createElement('small');
        fileInfo.className = 'text-success d-block mt-1 fade-in-up';
        fileInfo.innerHTML = `<i class="fas fa-check me-1"></i>File uploaded: ${fileName}`;
        
        // Remove existing file info
        const existingInfo = e.target.parentNode.querySelector('.text-success');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        e.target.parentNode.appendChild(fileInfo);
    }
}

// Enhanced field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('is-invalid');
    
    // Validate based on field type
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
    }
    
    if (!isValid) {
        field.classList.add('is-invalid');
        showFieldError(field);
    }
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('is-invalid');
    const errorMsg = field.parentNode.querySelector('.invalid-feedback');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showFieldError(field) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    
    if (field.type === 'email') {
        errorDiv.textContent = 'Please enter a valid business email address';
    } else {
        errorDiv.textContent = 'This field is required';
    }
    
    field.parentNode.appendChild(errorDiv);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced success message
function showSuccessMessage(message = 'Request submitted successfully!') {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 400px; animation: slideInRight 0.3s ease-out;';
    alert.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>Success!</strong><br>
        <small>${message}</small>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 7 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => alert.remove(), 300);
        }
    }, 7000);
}

// Enhanced error message
function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px; animation: slideInRight 0.3s ease-out;';
    alert.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>
        <strong>Error:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

// Open quote modal - FIXED FUNCTION
function openQuoteModal(signType = '') {
    // Ensure Bootstrap is loaded
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is not loaded');
        return;
    }
    
    const modalElement = document.getElementById('quoteModal');
    if (!modalElement) {
        console.error('Quote modal element not found');
        return;
    }
    
    // Create or get existing modal instance
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (!modal) {
        modal = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: true
        });
    }
    
    // Pre-fill sign type if provided
    if (signType) {
        const signTypeSelect = modalElement.querySelector('select[name="signType"]');
        if (signTypeSelect) {
            signTypeSelect.value = signType;
            // Add visual feedback
            signTypeSelect.style.borderColor = 'var(--primary-color)';
            setTimeout(() => {
                signTypeSelect.style.borderColor = '';
            }, 2000);
        }
    }
    
    // Show the modal
    modal.show();
    
    // Focus on first empty field after modal is shown
    modalElement.addEventListener('shown.bs.modal', function () {
        const firstEmptyField = modalElement.querySelector('input:not([value]), input[value=""]');
        if (firstEmptyField) {
            setTimeout(() => firstEmptyField.focus(), 100);
        }
    }, { once: true });
    
    // Track interaction
    trackEvent('quote_modal_opened', {
        sign_type: signType,
        source: 'linkedin'
    });
}

// Scroll to hero form
function scrollToHeroForm(signType = '') {
    const heroForm = document.getElementById('heroQuoteForm');
    if (heroForm) {
        // Pre-fill sign type if provided
        if (signType) {
            const signTypeSelect = heroForm.querySelector('select[name="signType"]');
            if (signTypeSelect) {
                signTypeSelect.value = signType;
                // Add visual feedback
                signTypeSelect.style.borderColor = 'var(--primary-color)';
                setTimeout(() => {
                    signTypeSelect.style.borderColor = '';
                }, 2000);
            }
        }
        
        // Scroll to form
        heroForm.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Focus on first empty field
        const firstEmptyField = heroForm.querySelector('input:not([value]), input[value=""]');
        if (firstEmptyField) {
            setTimeout(() => firstEmptyField.focus(), 500);
        }
        
        // Track interaction
        trackEvent('scroll_to_hero_form', {
            sign_type: signType,
            source: 'linkedin'
        });
    }
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Event tracking function
function trackEvent(eventName, properties = {}) {
    // In a real implementation, this would send data to your analytics service
    console.log('Event tracked:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, properties);
    }
    
    // Example: LinkedIn Insight Tag
    if (typeof _linkedin_partner_id !== 'undefined') {
        window.lintrk('track', { conversion_id: eventName });
    }
}

// Analytics initialization
function initializeAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page: 'linkedin_landing',
        source: 'linkedin'
    });
    
    // Track scroll depth
    let maxScroll = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    trackEvent('scroll_depth', {
                        depth: maxScroll,
                        source: 'linkedin'
                    });
                }
            }
        }, 100);
    });
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            duration: timeOnPage,
            source: 'linkedin'
        });
    });
    
    // Track form interactions for both forms
    const allFormFields = document.querySelectorAll('#heroQuoteForm input, #heroQuoteForm select, #heroQuoteForm textarea, #modalQuoteForm input, #modalQuoteForm select, #modalQuoteForm textarea');
    allFormFields.forEach(field => {
        field.addEventListener('focus', () => {
            const formType = field.closest('#heroQuoteForm') ? 'hero' : 'modal';
            trackEvent('form_field_focus', {
                field_name: field.name,
                form_location: formType,
                source: 'linkedin'
            });
        });
    });
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        source: 'linkedin'
    });
});

// Initialize analytics
initializeAnalytics();

// Export functions for global access
window.openQuoteModal = openQuoteModal;
window.scrollToHeroForm = scrollToHeroForm;
window.scrollToSection = scrollToSection;

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);