# 📊 Finance Data Collection Guide

## 🎯 Overview

This guide provides comprehensive strategies for collecting finance data for the Life Pilot AI finance management system.

---

## 📦 Available Tools

### 1. **Synthetic Data Generator** (`synthetic_data_generator.py`)

Generate realistic finance data for testing and ML training.

**Features:**

- ✅ Personal finance data (500 users, 24 months)
- ✅ Transaction data (50,000 transactions)
- ✅ Financial goals data
- ✅ Investment portfolio data
- ✅ Bangladesh-specific categories and merchants

**Usage:**

```bash
cd backend
python synthetic_data_generator.py
```

**Output Files:**

- `backend/data/personal_finance_data.csv` - Monthly finance records
- `backend/data/transaction_data.csv` - Individual transactions
- `backend/data/financial_goals_data.csv` - Financial goals
- `backend/data/investment_data.csv` - Investment portfolios
- `backend/data/dataset_summary.json` - Statistics summary

---

### 2. **Finance API Client** (`finance_api_client.py`)

Fetch real-time finance data from free APIs.

**Features:**

- ✅ Currency exchange rates (USD, EUR → BDT)
- ✅ Cryptocurrency prices (Bitcoin, Ethereum)
- ✅ Bangladesh market indicators
- ✅ Interest rates (Savings, FD, Loans)
- ✅ Commodity prices (Gold, Oil)
- ✅ Economic calendar

**Usage:**

```python
from finance_api_client import FinanceAPIClient

client = FinanceAPIClient()

# Get exchange rates
rate = client.get_currency_rate('USD', 'BDT')
print(f"1 USD = {rate['rate']} BDT")

# Get crypto prices
bitcoin = client.get_crypto_price('bitcoin')
print(f"Bitcoin: ${bitcoin['usd_price']}")

# Get Bangladesh data
bd_data = client.get_bangladesh_market_data()
print(f"Inflation: {bd_data['inflation_rate']}%")
```

**Demo:**

```bash
python backend/finance_api_client.py
```

---

## 🌐 Free Data Sources

### A. Government & Official Sources

#### 1. **Bangladesh Sources**

**Bangladesh Bank (Central Bank)**

- URL: https://www.bb.org.bn/en/
- Data: Interest rates, inflation, GDP, exchange rates, monetary policy
- Format: HTML tables, PDF reports
- Update: Weekly/Monthly

**Bangladesh Bureau of Statistics (BBS)**

- URL: http://www.bbs.gov.bn/
- Data: Household income, expenditure, poverty, employment
- Format: Excel, PDF
- Update: Quarterly/Annually

**Dhaka Stock Exchange (DSE)**

- URL: https://www.dse.com.bn/
- Data: Stock prices, indices, trading volumes
- Format: JSON API (requires registration)
- Update: Real-time during market hours

#### 2. **International Sources**

**World Bank Open Data**

- URL: https://data.worldbank.org/
- Data: Global economic indicators, GDP, poverty, development
- Format: CSV, JSON, XML
- API: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

**International Monetary Fund (IMF)**

- URL: https://www.imf.org/en/Data
- Data: Economic indicators, debt, reserves, balance of payments
- Format: Excel, CSV
- Update: Monthly/Quarterly

**Federal Reserve Economic Data (FRED)**

- URL: https://fred.stlouisfed.org/
- Data: 800,000+ economic time series
- Format: CSV, JSON, XML
- API: https://fred.stlouisfed.org/docs/api/fred/
- FREE with API key

---

### B. Kaggle Datasets (Best for ML)

**Top Finance Datasets:**

1. **Personal Finance Dataset**
   - URL: https://www.kaggle.com/datasets/bhanupratapbiswas/personal-finance
   - Size: 10,000+ transactions
   - Features: Income, expenses, categories, savings

2. **Household Finance Dataset**
   - URL: https://www.kaggle.com/datasets/rameshvarun/household-finance
   - Size: 5,000 households
   - Features: Income, debt, savings, investments, demographics

3. **Credit Card Transactions**
   - URL: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
   - Size: 284,807 transactions
   - Features: Amount, category, fraud detection

4. **Stock Market Data**
   - URL: https://www.kaggle.com/datasets/paultimothymooney/stock-market-data
   - Size: 4,000+ companies
   - Features: OHLCV data, technical indicators

**How to Download:**

```bash
# Install Kaggle CLI
pip install kaggle

# Set up API credentials
# 1. Go to https://www.kaggle.com/account
# 2. Create API token
# 3. Download kaggle.json
# 4. Place in ~/.kaggle/ or C:\Users\<You>\.kaggle\

# Download dataset
kaggle datasets download -d bhanupratapbiswas/personal-finance
unzip personal-finance.zip -d backend/data/
```

---

### C. GitHub Finance Datasets

**Curated Collections:**

1. **Awesome Public Datasets - Finance**
   - URL: https://github.com/awesomedata/awesome-public-datasets#finance
   - Contains: Links to 100+ finance datasets

2. **Financial Machine Learning**
   - URL: https://github.com/firmai/financial-machine-learning
   - Contains: Datasets and ML models for finance

3. **Bangladesh Finance Data**
   - URL: https://github.com/topics/bangladesh-finance
   - Contains: Bangladesh-specific datasets

---

## 🔌 Free APIs

### 1. **ExchangeRate-API** (Currency)

```python
# Free, No API key needed
URL = "https://api.exchangerate-api.com/v4/latest/USD"
```

### 2. **CoinGecko** (Cryptocurrency)

```python
# Free, No API key needed
URL = "https://api.coingecko.com/api/v3/simple/price"
```

### 3. **Alpha Vantage** (Stocks)

```python
# Free tier: 5 calls/min, 500 calls/day
# Get key: https://www.alphavantage.co/support/#api-key
URL = "https://www.alphavantage.co/query"
```

### 4. **Yahoo Finance** (via yfinance)

```bash
pip install yfinance
```

```python
import yfinance as yf
data = yf.download("AAPL", start="2025-01-01", end="2026-01-29")
```

### 5. **FRED API** (Economic Data)

```python
# Free with API key
# Register: https://fred.stlouisfed.org/docs/api/api_key.html
```

---

## 📊 Data Collection Strategy

### Phase 1: Bootstrap with Synthetic Data ✅

**Status: COMPLETE**

```bash
# Generate synthetic data
python backend/synthetic_data_generator.py
```

**Generated:**

- ✅ 12,000 personal finance records (500 users × 24 months)
- ✅ 50,000 transaction records
- ✅ 1,000+ financial goals
- ✅ 1,000+ investment records

---

### Phase 2: Integrate Real-time APIs ✅

**Status: COMPLETE**

```python
# Use Finance API Client
from finance_api_client import FinanceAPIClient

client = FinanceAPIClient()
client.get_currency_rate('USD', 'BDT')
client.get_crypto_price('bitcoin')
client.get_bangladesh_market_data()
```

---

### Phase 3: User Data Collection (Next)

**Add Data Collection Endpoints:**

```python
# In app.py
@app.route('/api/data-collection/submit', methods=['POST'])
def submit_user_data():
    """Users can optionally share anonymized data"""
    data = request.json

    # Anonymize
    anonymized = anonymize_data(data)

    # Store for ML training
    db.store_training_data(anonymized)

    return jsonify({'status': 'success'})
```

**Incentivize Users:**

- Offer premium features for data sharing
- Provide better AI recommendations
- Show aggregate insights

---

### Phase 4: Web Scraping (Advanced)

**For Bangladesh-Specific Data:**

```python
# Example: Scrape DSE data
import requests
from bs4 import BeautifulSoup

url = "https://www.dse.com.bd/"
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Extract market data
dse_index = soup.select_one('.market-index').text
```

**Legal Considerations:**

- ✅ Check website's `robots.txt`
- ✅ Respect rate limits
- ✅ Don't overload servers
- ✅ Follow Terms of Service

---

## 📈 Data Quality Checklist

### Before Using Data:

- [ ] **Completeness**: All required fields present?
- [ ] **Accuracy**: Values within realistic ranges?
- [ ] **Consistency**: No contradictory data?
- [ ] **Timeliness**: Data is up-to-date?
- [ ] **Validity**: Formats are correct?
- [ ] **Privacy**: Personal data is anonymized?

### Data Cleaning Steps:

```python
import pandas as pd

# Load data
df = pd.read_csv('backend/data/personal_finance_data.csv')

# 1. Remove duplicates
df = df.drop_duplicates()

# 2. Handle missing values
df = df.fillna(method='ffill')

# 3. Remove outliers
Q1 = df['income'].quantile(0.25)
Q3 = df['income'].quantile(0.75)
IQR = Q3 - Q1
df = df[~((df['income'] < (Q1 - 1.5 * IQR)) | (df['income'] > (Q3 + 1.5 * IQR)))]

# 4. Validate data types
df['income'] = pd.to_numeric(df['income'], errors='coerce')
df['date'] = pd.to_datetime(df['date'])

# 5. Save cleaned data
df.to_csv('backend/data/cleaned_finance_data.csv', index=False)
```

---

## 🔒 Privacy & Ethics

### Data Handling Guidelines:

1. **Anonymization**
   - Remove personal identifiers
   - Use user IDs instead of names
   - Hash sensitive information

2. **Consent**
   - Get explicit user consent
   - Clear opt-in/opt-out mechanisms
   - Transparent data usage policy

3. **Security**
   - Encrypt data at rest and in transit
   - Access controls and audit logs
   - Regular security reviews

4. **Compliance**
   - Follow GDPR if applicable
   - Comply with local data protection laws
   - Regular compliance audits

---

## 🚀 Quick Start Commands

### 1. Generate Synthetic Data

```bash
cd backend
python synthetic_data_generator.py
```

### 2. Test API Client

```bash
python backend/finance_api_client.py
```

### 3. Install Dependencies

```bash
pip install pandas numpy requests beautifulsoup4 yfinance
```

### 4. Download Kaggle Dataset

```bash
# Install Kaggle CLI
pip install kaggle

# Download dataset
kaggle datasets download -d bhanupratapbiswas/personal-finance
```

---

## 📚 Additional Resources

### Learning:

- **Kaggle Learn**: https://www.kaggle.com/learn
- **Financial Data Science**: https://www.coursera.org/learn/financial-data-science

### Tools:

- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Requests**: API calls
- **BeautifulSoup**: Web scraping
- **yfinance**: Yahoo Finance data

### Documentation:

- **FINANCE-SYSTEM-DOCS.md** - Complete system docs
- **FINANCE-QUICK-START.md** - Quick reference
- **FINANCE-IMPLEMENTATION-SUMMARY.md** - Implementation details

---

## 💡 Best Practices

1. **Start Small**: Use synthetic data first
2. **Iterate**: Add real data sources gradually
3. **Validate**: Always validate data quality
4. **Document**: Keep track of data sources
5. **Test**: Test with sample data before production
6. **Monitor**: Track data freshness and quality
7. **Backup**: Regular backups of datasets
8. **Version**: Use version control for datasets

---

## 🎯 Next Steps

1. ✅ Run synthetic data generator
2. ✅ Test API client
3. ⬜ Download Kaggle datasets
4. ⬜ Set up web scrapers
5. ⬜ Implement user data collection
6. ⬜ Train ML models on real data
7. ⬜ Monitor data quality
8. ⬜ Iterate and improve

---

**📊 Your finance system now has robust data collection capabilities!**

Start with synthetic data, then gradually integrate real-world sources! 🚀
