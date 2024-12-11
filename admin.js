let patients = JSON.parse(localStorage.getItem('patients')) || [];

// Load Charts and Data on Page Load
window.onload = function() {
    updateAdminAnalytics();
};

// Main Analytics Function
function updateAdminAnalytics() {
    document.getElementById('total-patients').innerText = patients.length;

    const ageSum = patients.reduce((sum, patient) => sum + patient.age, 0);
    const averageAge = ageSum / patients.length || 0;
    document.getElementById('average-age').innerText = averageAge.toFixed(1);

    const genderRatio = calculateGenderRatio();
    document.getElementById('gender-ratio').innerText = genderRatio;

    const followUpCompliance = calculateFollowUpCompliance();
    document.getElementById('followup-compliance').innerText = `${followUpCompliance}%`;

    renderCharts();
    generateHealthInsights();
}

// Calculate Gender Ratio
function calculateGenderRatio() {
    const genders = patients.reduce((count, p) => {
        count[p.gender] = (count[p.gender] || 0) + 1;
        return count;
    }, {});

    const male = genders['Male'] || 0;
    const female = genders['Female'] || 0;
    return `Male:Female = ${male}:${female}`;
}

// Follow-Up Compliance Calculation
function calculateFollowUpCompliance() {
    const today = new Date().toISOString().split('T')[0];
    const followUps = patients.filter(p => p.followUpDate);
    const onTimeFollowUps = followUps.filter(p => p.followUpDate >= today).length;
    return (onTimeFollowUps / followUps.length * 100).toFixed(1);
}

// Render Charts
function renderCharts() {
    // Age Distribution
    new Chart(document.getElementById('ageChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: patients.map(p => p.name),
            datasets: [{ label: 'Age', data: patients.map(p => p.age), backgroundColor: 'rgba(75, 192, 192, 0.6)' }]
        }
    });

    // Gender Distribution
    const genderData = calculateGenderRatioData();
    new Chart(document.getElementById('genderChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(genderData),
            datasets: [{ data: Object.values(genderData), backgroundColor: ['#36a2eb', '#ff6384'] }]
        }
    });

    // Diagnosis Trends
    const diagnosisData = getFrequency(patients.map(p => p.diagnosis));
    new Chart(document.getElementById('diagnosisChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: diagnosisData.map(d => d.key),
            datasets: [{ label: 'Diagnosis Count', data: diagnosisData.map(d => d.count), backgroundColor: '#ffce56' }]
        }
    });

    // Medication Trends
    const medicationData = getFrequency(patients.map(p => p.medication));
    new Chart(document.getElementById('medicationChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: medicationData.map(m => m.key),
            datasets: [{ data: medicationData.map(m => m.count), backgroundColor: ['#4bc0c0', '#ff9f40', '#9966ff'] }]
        }
    });

    // Follow-Up Compliance Over Time
    const followupData = getFollowUpTrends();
    new Chart(document.getElementById('followupChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: followupData.dates,
            datasets: [{ label: 'Follow-Up Compliance', data: followupData.counts, borderColor: '#4caf50', fill: false }]
        }
    });
}

// Gender Data Helper
function calculateGenderRatioData() {
    return patients.reduce((count, p) => {
        count[p.gender] = (count[p.gender] || 0) + 1;
        return count;
    }, {});
}

// Frequency Helper for Diagnosis and Medication
function getFrequency(arr) {
    const freqMap = {};
    arr.forEach(item => freqMap[item] = (freqMap[item] || 0) + 1);
    return Object.entries(freqMap).map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
}

// Follow-Up Trends
function getFollowUpTrends() {
    const dates = [...new Set(patients.map(p => p.followUpDate))].sort();
    const counts = dates.map(date => patients.filter(p => p.followUpDate === date).length);
    return { dates, counts };
}

// Health Insights
function generateHealthInsights() {
    const insights = document.getElementById('health-insights');
    insights.innerHTML = '<h4>AI-Driven Health Insights:</h4>';

    if (patients.some(p => p.diagnosis.includes('Hypertension'))) {
        insights.innerHTML += '<p>High blood pressure detected. Recommend increased monitoring.</p>';
    }

    if (patients.some(p => p.diagnosis.includes('Diabetes'))) {
        insights.innerHTML += '<p>High diabetes prevalence. Suggest regular blood sugar testing for at-risk age groups.</p>';
    }
}

// Navigate Back to Main Dashboard
function goBack() {
    window.location.href = 'index.html';
}
