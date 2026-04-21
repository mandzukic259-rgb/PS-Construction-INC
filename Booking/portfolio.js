// Portfolio JavaScript
// Handles portfolio display and project management

document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioProjects();
    setupPortfolioFilters();
});

// Load portfolio projects from Firestore
async function loadPortfolioProjects() {
    try {
        const portfolioGrid = document.getElementById('portfolioGrid');
        
        if (!portfolioGrid) return;
        
        // Get all projects from Firestore
        const querySnapshot = await db.collection('projects').orderBy('projectDate', 'desc').get();
        
        if (querySnapshot.empty) {
            console.log('No projects found');
            portfolioGrid.innerHTML = '<div class="portfolio-placeholder"><p>Projects coming soon! We\'re building an impressive portfolio of completed work.</p></div>';
            return;
        }
        
        // Clear placeholder
        portfolioGrid.innerHTML = '';
        
        // Add each project to the grid
        querySnapshot.forEach((doc) => {
            const project = doc.data();
            const projectElement = createProjectElement(project, doc.id);
            portfolioGrid.appendChild(projectElement);
        });
        
    } catch (error) {
        console.error('Error loading portfolio projects:', error);
    }
}

// Create portfolio item element
function createProjectElement(project, projectId) {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    div.innerHTML = `
        <img src="${project.projectImage || 'https://via.placeholder.com/300x200'}" alt="${project.projectName}">
        <div class="portfolio-item-content">
            <h3>${project.projectName}</h3>
            <p class="category"><strong>Category:</strong> ${project.projectCategory}</p>
            <p>${project.projectDescription.substring(0, 100)}...</p>
            <p class="date"><small>Completed: ${formatDate(project.projectDate)}</small></p>
        </div>
    `;
    
    div.addEventListener('click', function() {
        showProjectDetails(project, projectId);
    });
    
    return div;
}

// Show project details
function showProjectDetails(project, projectId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${project.projectImage || 'https://via.placeholder.com/500x300'}" alt="${project.projectName}" style="width: 100%; height: auto; border-radius: 5px; margin-bottom: 1rem;">
            <h2>${project.projectName}</h2>
            <p><strong>Category:</strong> ${project.projectCategory}</p>
            <p><strong>Completed:</strong> ${formatDate(project.projectDate)}</p>
            <h3>Description</h3>
            <p>${project.projectDescription}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Setup portfolio filters
function setupPortfolioFilters() {
    // This can be expanded for filtering by category
    console.log('Portfolio filters initialized');
}

// Add project to portfolio (Admin function)
async function addProjectToPortfolio(projectData) {
    try {
        const projectRef = await db.collection('projects').add({
            projectName: projectData.projectName,
            projectDescription: projectData.projectDescription,
            projectCategory: projectData.projectCategory,
            projectImage: projectData.projectImage,
            projectDate: new Date(projectData.projectDate),
            createdAt: new Date()
        });
        
        console.log('Project added with ID:', projectRef.id);
        loadPortfolioProjects(); // Reload projects
        return projectRef.id;
        
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
}

// Delete project from portfolio (Admin function)
async function deleteProjectFromPortfolio(projectId) {
    try {
        await db.collection('projects').doc(projectId).delete();
        console.log('Project deleted');
        loadPortfolioProjects(); // Reload projects
        
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}
