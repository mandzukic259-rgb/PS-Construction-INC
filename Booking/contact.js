// Contact Form JavaScript
// Handles all contact form submissions and Firebase integration

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

async function handleContactSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const contactName = document.getElementById('contactName').value;
    const contactEmail = document.getElementById('contactEmail').value;
    const contactPhone = document.getElementById('contactPhone').value;
    const contactSubject = document.getElementById('contactSubject').value;
    const contactMessageText = document.getElementById('contactMessage').value;
    const contactAgree = document.getElementById('contactAgree').checked;
    
    // Validate form
    if (!contactName || !contactEmail || !contactSubject || !contactMessageText || !contactAgree) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email
    if (!validateEmail(contactEmail)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        // Disable submit button
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Save to Firestore
        const messageRef = await db.collection('messages').add({
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            subject: contactSubject,
            message: contactMessageText,
            createdAt: new Date(),
            read: false,
            status: 'unread'
        });
        
        console.log('Message saved with ID:', messageRef.id);
        
        // Show success message
        const formMessageEl = document.getElementById('contactMessage');
        if (formMessageEl && formMessageEl.classList) {
            // This is the form message element, not the textarea
            const msgElement = document.querySelector('.contact-form .form-message');
            if (msgElement) {
                msgElement.textContent = 'Message sent successfully! We will get back to you soon.';
                msgElement.className = 'form-message success';
            }
        }
        
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Error sending message. Please try again.', 'error');
        
        // Re-enable submit button
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}
