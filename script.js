
// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Lot Size Range Input
  const lotSizeInput = document.getElementById('lotSize');
  const lotSizeLabel = document.getElementById('lotSizeLabel');

  if (lotSizeInput && lotSizeLabel) {
    lotSizeInput.addEventListener('input', function() {
      lotSizeLabel.textContent = `Lot Size (acres): ${lotSizeInput.value}`;
    });
  }

  // Form Submission
  const houseForm = document.getElementById('house-form');
  const loadingOverlay = document.getElementById('loading-overlay');

  if (houseForm) {
    houseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading overlay
      if (loadingOverlay) loadingOverlay.style.display = 'flex';
      
      // Get form data
      const formData = {
        bedrooms: parseInt(document.getElementById('bedrooms').value),
        bathrooms: parseFloat(document.getElementById('bathrooms').value),
        squareFeet: parseInt(document.getElementById('squareFeet').value),
        lotSize: parseFloat(document.getElementById('lotSize').value),
        yearBuilt: parseInt(document.getElementById('yearBuilt').value),
        neighborhood: document.getElementById('neighborhood').value,
        condition: document.getElementById('condition').value,
        hasGarage: document.getElementById('hasGarage').checked,
        hasPool: document.getElementById('hasPool').checked
      };
      
      // Store in localStorage for results page
      localStorage.setItem('houseData', JSON.stringify(formData));
      
      // Simulate prediction calculation (in a real app, this would be an API call)
      setTimeout(function() {
        // Redirect to results page
        window.location.href = 'results.html';
      }, 2000);
    });
  }

  // Results Page
  if (window.location.pathname.includes('results.html')) {
    // Get stored house data
    const storedData = localStorage.getItem('houseData');
    
    if (!storedData) {
      // If no data, redirect to predict page
      window.location.href = 'predict.html';
      return;
    }
    
    const houseData = JSON.parse(storedData);
    displayResults(houseData);
  }
});

// Display prediction results
function displayResults(data) {
  // Calculate predicted price based on data
  const predictedPrice = getPredictedPrice(data);
  
  // Format currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
  
  // Update DOM elements with results
  document.getElementById('predicted-price').textContent = formatter.format(predictedPrice);
  
  // Price range (±5%)
  const lowerRange = formatter.format(predictedPrice * 0.95);
  const upperRange = formatter.format(predictedPrice * 1.05);
  document.getElementById('price-range').textContent = `Estimated value range: ${lowerRange} - ${upperRange}`;
  
  // Confidence level
  const confidenceLevel = Math.floor(Math.random() * 20) + 75; // Random between 75-95
  document.getElementById('confidence-level').textContent = confidenceLevel;
  document.getElementById('confidence-bar').style.width = `${confidenceLevel}%`;
  
  // Property stats
  document.getElementById('price-per-sqft').textContent = formatter.format(Math.round(predictedPrice / data.squareFeet));
  document.getElementById('property-size').textContent = `${data.squareFeet} sq ft`;
  document.getElementById('property-type').textContent = `${data.bedrooms}BR/${data.bathrooms}BA`;
  document.getElementById('property-age').textContent = `${new Date().getFullYear() - data.yearBuilt} years`;
  
  // Create price history chart
  createPriceHistoryChart(predictedPrice);
}

// Simulate prediction algorithm
function getPredictedPrice(data) {
  // Starting with a base price
  let basePrice = 250000;
  
  // Adjusting for square footage (avg $200 per sq ft)
  basePrice += (data.squareFeet - 1800) * 200;
  
  // Adjusting for bedrooms
  basePrice += (data.bedrooms - 3) * 15000;
  
  // Adjusting for bathrooms
  basePrice += (data.bathrooms - 2) * 12000;
  
  // Adjusting for lot size
  basePrice += (data.lotSize - 0.25) * 50000;
  
  // Adjusting for age
  const age = new Date().getFullYear() - data.yearBuilt;
  basePrice -= age * 500;
  
  // Adjusting for condition
  switch (data.condition) {
    case "poor": basePrice *= 0.85; break;
    case "fair": basePrice *= 0.95; break;
    case "good": basePrice *= 1.05; break;
    case "excellent": basePrice *= 1.15; break;
  }
  
  // Adjusting for neighborhood
  switch (data.neighborhood) {
    case "downtown": basePrice *= 1.2; break;
    case "midtown": basePrice *= 1.1; break;
    case "uptown": basePrice *= 1.15; break;
    case "suburbanNorth": basePrice *= 1.05; break;
    case "suburbanSouth": basePrice *= 0.95; break;
    case "suburbanEast": basePrice *= 1.0; break;
    case "suburbanWest": basePrice *= 1.1; break;
  }
  
  // Adjusting for garage
  if (data.hasGarage) basePrice += 20000;
  
  // Adjusting for pool
  if (data.hasPool) basePrice += 30000;
  
  // Add some randomness to simulate real-world variations
  const randomFactor = 0.9 + Math.random() * 0.2; // between 0.9 and 1.1
  basePrice *= randomFactor;
  
  // Round to nearest thousand
  return Math.round(basePrice / 1000) * 1000;
}

// Create price history chart
function createPriceHistoryChart(currentPrice) {
  const ctx = document.getElementById('price-history-chart');
  if (!ctx) return;
  
  // Generate historical data
  const data = generateHistoryData(currentPrice);
  
  // Create chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.month),
      datasets: [{
        label: 'Estimated Property Value',
        data: data.map(d => d.price),
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value);
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
          }
        }
      }
    }
  });
}

// Generate price history data for the chart
function generateHistoryData(currentPrice) {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get current month index
  const currentMonthIndex = new Date().getMonth();
  
  // Start from 12 months ago
  for (let i = 11; i >= 0; i--) {
    // Calculate month index
    let monthIndex = (currentMonthIndex - i + 12) % 12;
    
    // Add some random variance (between -5% and +10% of the current price)
    const variance = currentPrice * (Math.random() * 0.15 - 0.05);
    
    // Calculate historical price for each month
    const historicalPrice = currentPrice - variance;
    
    data.push({
      month: months[monthIndex],
      price: Math.round(historicalPrice)
    });
  }
  
  return data;
}
