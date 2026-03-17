// Sticky Header functionality
const header = document.getElementById('header');
const mobileToggle = document.querySelector('.header__mobile-toggle');
const navLinks = document.querySelectorAll('.header__nav a');

// Add smooth scroll behavior to nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Offset for sticky header
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update active state
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Handle scroll events
window.addEventListener('scroll', () => {
    // Sticky Header toggle
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scroll Animation - Fade in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
            element.classList.add('visible');
        }
    });

    // Update active nav link based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - header.offsetHeight - 50)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile Menu toggle
const navContainer = document.querySelector('.header__nav');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navContainer.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navContainer.classList.remove('active');
    });
});

// Initialize Swiper for Doctors section only on Mobile/Tablet
let doctorsSwiper;

function initSwiper() {
    if (window.innerWidth <= 768) {
        if (!doctorsSwiper) {
            doctorsSwiper = new Swiper('.doctorsSwiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    600: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    }
                }
            });
        }
    } else {
        if (doctorsSwiper) {
            doctorsSwiper.destroy(true, true);
            doctorsSwiper = undefined;
        }
    }
}

// Check on load
initSwiper();

// Initialize Swiper for Testimonials
const testimonialsSwiper = new Swiper('.testimonialsSwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.testimonials .swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
            centeredSlides: false,
        },
        1024: {
            slidesPerView: 3,
            centeredSlides: false,
        }
    }
});

// Check on resize
window.addEventListener('resize', initSwiper);

// Trigger scroll initially to show elements in viewport on load
window.dispatchEvent(new Event('scroll'));

// Appointment Form Handling
const form = document.getElementById('appointmentForm');
if (form) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    const feedback = document.getElementById('formFeedback');

    const inputs = {
        fullName: document.getElementById('fullName'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        mode: document.getElementById('mode'),
        concern: document.getElementById('concern')
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePhone = (phone) => {
        // Basic pattern matching for India phone numbers (optional +91) and 10 digits
        const phoneRegex = /^(?:\+?\d{1,3})?\s?(?:\d{10})$/;
        return phoneRegex.test(phone.replace(/[\s-]/g, ''));
    };

    const showError = (inputElement) => {
        inputElement.classList.add('error');
        inputElement.nextElementSibling.style.display = 'block';
    };

    const hideError = (inputElement) => {
        inputElement.classList.remove('error');
        inputElement.nextElementSibling.style.display = 'none';
    };

    // Real-time validation clear on input
    Object.values(inputs).forEach(input => {
        if(input) {
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) hideError(input);
            });
            input.addEventListener('change', () => {
                if (input.classList.contains('error')) hideError(input);
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validation Checks
        if (!inputs.fullName.value.trim()) {
            showError(inputs.fullName);
            isValid = false;
        }

        if (!inputs.phone.value.trim() || !validatePhone(inputs.phone.value.trim())) {
            showError(inputs.phone);
            isValid = false;
        }

        if (!inputs.email.value.trim() || !validateEmail(inputs.email.value.trim())) {
            showError(inputs.email);
            isValid = false;
        }

        if (!inputs.mode.value) {
            showError(inputs.mode);
            isValid = false;
        }

        if (!inputs.concern.value.trim()) {
            showError(inputs.concern);
            isValid = false;
        }

        if (isValid) {
            // UI Loading state
            submitBtn.disabled = true;
            btnText.textContent = "Sending...";
            spinner.classList.add('active');
            feedback.style.display = 'none';
            feedback.className = 'form-feedback';

            // Google Apps Script Web App URL (User needs to replace this)
            const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => data[key] = value);

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script cross-origin
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(() => {
                submitBtn.disabled = false;
                btnText.textContent = "Submit Request";
                spinner.classList.remove('active');
                
                // Show success
                feedback.textContent = "Thank you! Your appointment request has been submitted successfully to our Google Sheet. Our team will contact you shortly.";
                feedback.classList.add('success');
                feedback.style.display = 'block';
                
                // Reset form
                form.reset();
                
                // Keep feedback visible for 5 seconds
                setTimeout(() => {
                    feedback.style.display = 'none';
                    feedback.classList.remove('success');
                }, 5000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.disabled = false;
                btnText.textContent = "Submit Request";
                spinner.classList.remove('active');
                feedback.textContent = "Something went wrong. Please try again or contact us directly.";
                feedback.classList.add('error');
                feedback.style.display = 'block';
            });
        } else {
             feedback.textContent = "Please fill in all required fields correctly.";
             feedback.classList.add('error');
        }
    });
}
