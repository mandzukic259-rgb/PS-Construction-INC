// Admin Dashboard JavaScript
// Handles admin authentication, bookings, messages, and analytics

let currentAdmin = null;
let currentBookingId = null;
let currentMessageId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupEventListeners();
});

// Check if admin is logged in
function checkAdminAuth() {
    auth.onAuthStateChanged(function(user) {
        const loginSection = document.getElementById('loginSection');
        const dashboardSection = document.getElementById('dashboardSection');
        
        if (user) {
            // User is logged in
            currentAdmin = user;
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'flex';
            document.getElementById('adminUserEmail').textContent = user.email;
            loadDashboardData();
        } else {
            // User is not logged in
            loginSection.style.display = 'block';
            dashboardSection.style.display = 'none';
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }
}

// Admin Login
async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const loginError = document.getElementById('loginError');
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        loginError.textContent = '';
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = error.message;
    }
}

// Admin Logout
async function handleAdminLogout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    loadBookingsData();
    loadMessagesData();
    loadAnalytics();
}

// Load Bookings Data
async function loadBookingsData() {
    try {
        const querySnapshot = await db.collection('bookings').orderBy('createdAt', 'desc').get();
        
        let totalBookings = 0;
        let pendingBookings = 0;
        const bookingsData = [];
        
        querySnapshot.forEach((doc) => {
            totalBookings++;
            const booking = doc.data();
            if (booking.status === 'Pending') {
                pendingBookings++;
            }
            bookingsData.push({ id: doc.id, ...booking });
        });
        
        // Update stats
        document.getElementById('totalBookings').textContent = totalBookings;
        document.getElementById('pendingBookings').textContent = pendingBookings;
        
        // Update recent bookings table
        const recentBookingsTable = document.getElementById('recentBookingsTable');
        if (recentBookingsTable) {
            recentBookingsTable.innerHTML = '';
            bookingsData.slice(0, 5).forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(booking.createdAt.toDate())}</td>
                    <td>${booking.fullName}</td>
                    <td>${booking.bookingType}</td>
                    <td>${booking.serviceCategory}</td>
                    <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
                `;
                recentBookingsTable.appendChild(row);
            });
        }
        
        // Update bookings table
        const bookingsTableBody = document.getElementById('bookingsTableBody');
        if (bookingsTableBody) {
            bookingsTableBody.innerHTML = '';
            bookingsData.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.id.substring(0, 8)}</td>
                    <td>${formatDate(booking.createdAt.toDate())}</td>
                    <td>${booking.fullName}</td>
                    <td>${booking.email}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.bookingType}</td>
                    <td>${booking.serviceCategory}</td>
                    <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
                    <td>
                        <button onclick="viewBooking('${booking.id}')" class="btn btn-info">View</button>
                        <button onclick="deleteBookingRecord('${booking.id}')" class="btn btn-danger">Delete</button>
                    </td>
                `;
                bookingsTableBody.appendChild(row);
            });
        }
        
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

// Load Messages Data
async function loadMessagesData() {
    try {
        const querySnapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
        
        let totalMessages = 0;
        let unreadMessages = 0;
        const messagesData = [];
        
        querySnapshot.forEach((doc) => {
            totalMessages++;
            const message = doc.data();
            if (!message.read) {
                unreadMessages++;
            }
            messagesData.push({ id: doc.id, ...message });
        });
        
        // Update stats
        document.getElementById('totalMessages').textContent = totalMessages;
        document.getElementById('unreadMessages').textContent = unreadMessages;
        
        // Update messages table
        const messagesTableBody = document.getElementById('messagesTableBody');
        if (messagesTableBody) {
            messagesTableBody.innerHTML = '';
            messagesData.forEach(message => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(message.createdAt.toDate())}</td>
                    <td>${message.name}</td>
                    <td>${message.email}</td>
                    <td>${message.subject}</td>
                    <td>${message.message.substring(0, 50)}...</td>
                    <td><span class="status-badge status-${message.read ? 'read' : 'unread'}">${message.read ? 'Read' : 'Unread'}</span></td>
                    <td>
                        <button onclick="viewMessage('${message.id}')" class="btn btn-info">View</button>
                        <button onclick="deleteMessageRecord('${message.id}')" class="btn btn-danger">Delete</button>
                    </td>
                `;
                row.style.backgroundColor = message.read ? 'transparent' : '#f9f9f9';
                messagesTableBody.appendChild(row);
            });
        }
        
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// View Booking Details
async function viewBooking(bookingId) {
    try {
        const doc = await db.collection('bookings').doc(bookingId).get();
        const booking = doc.data();
        currentBookingId = bookingId;
        
        const bookingDetails = document.getElementById('bookingDetails');
        bookingDetails.innerHTML = `
            <p><strong>Name:</strong> ${booking.fullName}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Company:</strong> ${booking.companyName || 'N/A'}</p>
            <p><strong>Booking Type:</strong> ${booking.bookingType}</p>
            <p><strong>Service Category:</strong> ${booking.serviceCategory}</p>
            <p><strong>Location:</strong> ${booking.projectLocation}</p>
            <p><strong>Preferred Date:</strong> ${booking.preferredDate}</p>
            <p><strong>Preferred Time:</strong> ${booking.preferredTime}</p>
            <p><strong>Budget:</strong> ${booking.budget || 'Not specified'}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            <h4>Project Description</h4>
            <p>${booking.projectDescription}</p>
            <h4>Additional Notes</h4>
            <p>${booking.additionalNotes || 'None'}</p>
        `;
        
        document.getElementById('bookingModal').style.display = 'block';
        
    } catch (error) {
        console.error('Error viewing booking:', error);
    }
}

// View Message Details
async function viewMessage(messageId) {
    try {
        const doc = await db.collection('messages').doc(messageId).get();
        const message = doc.data();
        currentMessageId = messageId;
        
        // Mark as read
        if (!message.read) {
            await db.collection('messages').doc(messageId).update({ read: true });
        }
        
        const messageDetails = document.getElementById('messageDetails');
        messageDetails.innerHTML = `
            <p><strong>From:</strong> ${message.name}</p>
            <p><strong>Email:</strong> ${message.email}</p>
            <p><strong>Phone:</strong> ${message.phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${message.subject}</p>
            <p><strong>Date:</strong> ${formatDate(message.createdAt.toDate())}</p>
            <h4>Message</h4>
            <p>${message.message}</p>
        `;
        
        document.getElementById('messageModal').style.display = 'block';
        loadMessagesData(); // Refresh to update read status
        
    } catch (error) {
        console.error('Error viewing message:', error);
    }
}

// Mark Booking as Confirmed
async function markBookingAsConfirmed() {
    try {
        await db.collection('bookings').doc(currentBookingId).update({
            status: 'Confirmed'
        });
        closeBookingModal();
        loadBookingsData();
        showNotification('Booking marked as confirmed', 'success');
    } catch (error) {
        console.error('Error updating booking:', error);
        showNotification('Error updating booking', 'error');
    }
}

// Mark Booking as Completed
async function markBookingAsCompleted() {
    try {
        await db.collection('bookings').doc(currentBookingId).update({
            status: 'Completed'
        });
        closeBookingModal();
        loadBookingsData();
        showNotification('Booking marked as completed', 'success');
    } catch (error) {
        console.error('Error updating booking:', error);
        showNotification('Error updating booking', 'error');
    }
}

// Delete Booking
async function deleteBooking() {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            await deleteBookingRecord(currentBookingId);
            closeBookingModal();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    }
}

// Delete Booking Record
async function deleteBookingRecord(bookingId) {
    try {
        await db.collection('bookings').doc(bookingId).delete();
        loadBookingsData();
        showNotification('Booking deleted', 'success');
    } catch (error) {
        console.error('Error deleting booking:', error);
        showNotification('Error deleting booking', 'error');
    }
}

// Delete Message Record
async function deleteMessageRecord(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            await db.collection('messages').doc(messageId).delete();
            loadMessagesData();
            if (document.getElementById('messageModal').style.display === 'block') {
                closeMessageModal();
            }
            showNotification('Message deleted', 'success');
        } catch (error) {
            console.error('Error deleting message:', error);
            showNotification('Error deleting message', 'error');
        }
    }
}

// Close Modals
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function closeMessageModal() {
    document.getElementById('messageModal').style.display = 'none';
}

// Load Analytics
async function loadAnalytics() {
    try {
        const bookingsSnapshot = await db.collection('bookings').get();
        const bookings = [];
        bookingsSnapshot.forEach(doc => {
            bookings.push(doc.data());
        });
        
        // Calculate statistics
        const bookingTypes = {};
        const serviceCategories = {};
        
        bookings.forEach(booking => {
            bookingTypes[booking.bookingType] = (bookingTypes[booking.bookingType] || 0) + 1;
            serviceCategories[booking.serviceCategory] = (serviceCategories[booking.serviceCategory] || 0) + 1;
        });
        
        // Find most popular
        let mostPopularService = 'N/A';
        let maxCount = 0;
        for (const [service, count] of Object.entries(serviceCategories)) {
            if (count > maxCount) {
                maxCount = count;
                mostPopularService = service;
            }
        }
        
        let mostUsedBookingType = 'N/A';
        maxCount = 0;
        for (const [type, count] of Object.entries(bookingTypes)) {
            if (count > maxCount) {
                maxCount = count;
                mostUsedBookingType = type;
            }
        }
        
        // Update analytics display
        const avgBookingsPerDay = (bookings.length / 30).toFixed(1); // Simplified calculation
        document.getElementById('mostPopularService').textContent = mostPopularService;
        document.getElementById('mostUsedBookingType').textContent = mostUsedBookingType;
        document.getElementById('avgBookingsPerDay').textContent = avgBookingsPerDay;
        
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Show Tab
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.admin-sidebar a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked link
    event.target.classList.add('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const messageModal = document.getElementById('messageModal');
    
    if (event.target === bookingModal) {
        bookingModal.style.display = 'none';
    }
    if (event.target === messageModal) {
        messageModal.style.display = 'none';
    }
}
