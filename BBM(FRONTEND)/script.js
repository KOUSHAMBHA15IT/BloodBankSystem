document.addEventListener('DOMContentLoaded', () => {
    const donorForm = document.getElementById('donorForm');
    if (donorForm) {
        donorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const bloodGroup = document.getElementById('bloodGroup').value;
            const contact = document.getElementById('contact').value;

            const donor = {
                name: name,
                bloodGroup: bloodGroup,
                contact: contact
            };

            fetch('http://localhost:8080/api/donors/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(donor)
            })
            .then(response => response.json())
            .then(data => {
                alert('Request submitted and stored in MongoDB!');
                donorForm.reset();
            })
            .catch(error => console.error('Error:', error));
        });
    }
});







document.addEventListener('DOMContentLoaded', () => {
    let requests = JSON.parse(localStorage.getItem('requests')) || [];
    let resources = JSON.parse(localStorage.getItem('resources')) || {
        "A+": 10,
        "A-": 5,
        "B+": 8,
        "B-": 4,
        "O+": 12,
        "O-": 6,
        "AB+": 3,
        "AB-": 2
    };

    function updateLocalStorage() {
        localStorage.setItem('requests', JSON.stringify(requests));
        localStorage.setItem('resources', JSON.stringify(resources));
    }

    // Handle admin login
    const adminLogin = document.getElementById('adminLogin');
    if (adminLogin) {
        adminLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'kdas' && password === '1234') {
                window.location.href = 'admin.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }

    // Handle donor form submission
    const donorForm = document.getElementById('donorForm');
    if (donorForm) {
        donorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const bloodGroup = document.getElementById('bloodGroup').value;
            const contact = document.getElementById('contact').value;

            requests.push({ name, bloodGroup, contact });
            updateLocalStorage();
            alert('Request submitted!');
            donorForm.reset();
        });
    }

    // Show requests on admin page
    function showRequests() {
        const requestsDiv = document.getElementById('requests');
        requestsDiv.innerHTML = requests.map((req, index) => `
            <div class="request-card">
                <p><strong>${req.name}</strong></p>
                <p>Blood Group: ${req.bloodGroup}</p>
                <p>Contact: ${req.contact}</p>
                <button onclick="acceptRequest(${index})">Accept</button>
                <button onclick="rejectRequest(${index})">Reject</button>
            </div>
        `).join('');
    }

    window.acceptRequest = (index) => {
        const acceptedRequest = requests.splice(index, 1)[0];
        resources[acceptedRequest.bloodGroup]++;
        updateLocalStorage();
        showRequests();
        showResources();
        alert('Request accepted!');
    };

    window.rejectRequest = (index) => {
        requests.splice(index, 1);
        updateLocalStorage();
        showRequests();
        alert('Request rejected!');
    };

    // Update blood units
    window.addUnits = () => {
        const bloodGroup = document.getElementById('bloodGroupSelect').value;
        const units = parseInt(document.getElementById('changeUnits').value);

        if (resources[bloodGroup] !== undefined) {
            resources[bloodGroup] += units;
            updateLocalStorage();
            showResources();
            alert(`Added ${units} units to ${bloodGroup}.`);
        } else {
            alert('Invalid blood group!');
        }
    };

    window.removeUnits = () => {
        const bloodGroup = document.getElementById('bloodGroupSelect').value;
        const units = parseInt(document.getElementById('changeUnits').value);

        if (resources[bloodGroup] !== undefined) {
            resources[bloodGroup] -= units;
            if (resources[bloodGroup] < 0) resources[bloodGroup] = 0;
            updateLocalStorage();
            showResources();
            alert(`Removed ${units} units from ${bloodGroup}.`);
        } else {
            alert('Invalid blood group!');
        }
    };

    // Show resources
    function showResources() {
        const resourcesDiv = document.getElementById('resourcesContainer');
        resourcesDiv.innerHTML = Object.keys(resources).map(group => `
            <div class="resource-card">
                <h3>${group}</h3>
                <p>${resources[group]} Units</p>
            </div>
        `).join('');
    }

    // Display resources on resources page
    if (document.getElementById('resourcesContainer')) {
        showResources();
    }

    // Display requests on admin page
    if (document.getElementById('requests')) {
        showRequests();
    }
});
