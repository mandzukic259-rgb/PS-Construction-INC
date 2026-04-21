// Booking System JavaScript
// Handles all booking form submissions and Firebase integration

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
});

async function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const bookingType = document.querySelector('input[name="bookingType"]:checked')?.value;
    const serviceCategory = document.getElementById('serviceCategory').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const companyName = document.getElementById('companyName').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const projectLocation = document.getElementById('projectLocation').value;
    const preferredDate = document.getElementById('preferredDate').value;
    const preferredTime = document.getElementById('preferredTime').value;
    const budget = document.getElementById('budget').value;
    const additionalNotes = document.getElementById('additionalNotes').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate form
    if (!bookingType || !serviceCategory || !fullName || !email || !phone || !projectDescription || !projectLocation || !preferredDate || !preferredTime || !agreeTerms) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate phone
    if (phone.length < 10) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    try {
        // Disable submit button
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Save to Firestore
        const bookingRef = await db.collection('bookings').add({
            bookingType: bookingType,
            serviceCategory: serviceCategory,
            fullName: fullName,
            email: email,
            phone: phone,
            companyName: companyName,
            projectDescription: projectDescription,
            projectLocation: projectLocation,
            preferredDate: preferredDate,
            preferredTime: preferredTime,
            budget: budget,
            additionalNotes: additionalNotes,
            status: 'Pending',
            createdAt: new Date(),
            read: false
        });
        
        console.log('Booking saved with ID:', bookingRef.id);
        
        // Show success message
        const formMessage = document.getElementById('formMessage');
        formMessage.textContent = 'Booking submitted successfully! We will contact you shortly.';
        formMessage.className = 'form-message success';
        
        showNotification('Booking submitted successfully!', 'success');
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = '';
        }, 5000);
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Booking Request';
        
    } catch (error) {
        console.error('Error submitting booking:', error);
        showNotification('Error submitting booking. Please try again.', 'error');
        
        // Re-enable submit button
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Booking Request';
    }
}

// Service category change handler
document.addEventListener('DOMContentLoaded', function() {
    const serviceCategory = document.getElementById('serviceCategory');
    if (serviceCategory) {
        serviceCategory.addEventListener('change', function() {
            console.log('Selected service:', this.value);
        });
    }
});
