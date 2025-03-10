
import numpy as np
import pandas as pd

def generate_synthetic_data(n_samples=1000):
    """
    Generate synthetic housing data for model training.
    
    Args:
        n_samples: Number of samples to generate
        
    Returns:
        DataFrame with synthetic housing data
    """
    np.random.seed(42)
    
    # Generate features
    bedrooms = np.random.randint(1, 7, n_samples)
    bathrooms = np.random.choice([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], n_samples)
    square_feet = np.random.randint(800, 5000, n_samples)
    lot_size = np.random.uniform(0.1, 2.0, n_samples)
    year_built = np.random.randint(1950, 2023, n_samples)
    neighborhoods = ['downtown', 'midtown', 'uptown', 'suburbanNorth', 'suburbanSouth', 'suburbanEast', 'suburbanWest']
    neighborhood = np.random.choice(neighborhoods, n_samples)
    conditions = ['poor', 'fair', 'good', 'excellent']
    condition = np.random.choice(conditions, n_samples)
    has_garage = np.random.choice([0, 1], n_samples)
    has_pool = np.random.choice([0, 1], n_samples)
    
    # Base price calculation
    base_price = 200000 + 150 * square_feet
    
    # Adjustments
    bedroom_adj = 15000 * (bedrooms - 3)
    bathroom_adj = 20000 * (bathrooms - 2)
    age_adj = -1000 * (2023 - year_built)
    lot_adj = 50000 * lot_size
    
    # Condition multipliers
    condition_mult = np.ones(n_samples)
    condition_mult[condition == 'poor'] = 0.8
    condition_mult[condition == 'fair'] = 0.9
    condition_mult[condition == 'good'] = 1.0
    condition_mult[condition == 'excellent'] = 1.2
    
    # Neighborhood multipliers
    neighborhood_mult = np.ones(n_samples)
    neighborhood_mult[neighborhood == 'downtown'] = 1.3
    neighborhood_mult[neighborhood == 'midtown'] = 1.2
    neighborhood_mult[neighborhood == 'uptown'] = 1.1
    neighborhood_mult[neighborhood == 'suburbanNorth'] = 1.05
    neighborhood_mult[neighborhood == 'suburbanSouth'] = 0.95
    neighborhood_mult[neighborhood == 'suburbanEast'] = 1.0
    neighborhood_mult[neighborhood == 'suburbanWest'] = 1.1
    
    # Features
    garage_adj = has_garage * 25000
    pool_adj = has_pool * 40000
    
    # Calculate price
    price = (base_price + bedroom_adj + bathroom_adj + age_adj + lot_adj + garage_adj + pool_adj) * condition_mult * neighborhood_mult
    
    # Add some noise
    price = price * np.random.normal(1, 0.1, n_samples)
    
    # Create DataFrame
    data = pd.DataFrame({
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'square_feet': square_feet,
        'lot_size': lot_size,
        'year_built': year_built,
        'neighborhood': neighborhood,
        'condition': condition,
        'has_garage': has_garage,
        'has_pool': has_pool,
        'price': price
    })
    
    return data
