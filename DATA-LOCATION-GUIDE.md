# 📂 Data Files Location Guide

## Where to Put Your CSV/Dataset Files

### Primary Data Directory

```
F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend\data\
```

**This folder contains all finance-related data files.**

---

## 📊 Generated Files (Already Created)

When you ran the data generator, these files were automatically created:

| File                        | Location        | Records | Description                                           |
| --------------------------- | --------------- | ------- | ----------------------------------------------------- |
| `personal_finance_data.csv` | `backend/data/` | 12,000  | Personal finance records for 500 users over 24 months |
| `transaction_data.csv`      | `backend/data/` | 50,000  | Detailed transactions (income, expenses)              |
| `financial_goals_data.csv`  | `backend/data/` | 1,256   | User financial goals (savings, purchases, retirement) |
| `investment_data.csv`       | `backend/data/` | 1,240   | Investment portfolio data                             |
| `dataset_summary.json`      | `backend/data/` | N/A     | Summary statistics of all datasets                    |

---

## 📥 How to Add Your Own CSV Files

### Option 1: Replace Existing Files

Simply replace the files in `backend/data/` with your own:

```bash
# Navigate to data directory
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend\data"

# Copy your CSV files here
copy "C:\your-path\your-finance-data.csv" "personal_finance_data.csv"
```

### Option 2: Add New Files

1. Place your CSV files in `backend/data/`
2. Load them in Python code:

```python
import pandas as pd

# Load custom data
my_data = pd.read_csv('backend/data/my_custom_data.csv')
```

---

## 🔄 Regenerate Synthetic Data

To regenerate fresh synthetic data:

```bash
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"
python synthetic_data_generator.py
```

---

## 📋 Required CSV Format

### Personal Finance Data Format

```csv
user_id,month,year,age,city,marital_status,dependents,
monthly_income,bonus,expense_rent,expense_food,expense_transport,
expense_utilities,expense_education,expense_healthcare,
expense_entertainment,expense_shopping,expense_other,
total_expenses,net_savings,savings_rate
```

### Transaction Data Format

```csv
transaction_id,date,time,amount,category,merchant,
transaction_type,payment_method,city,description
```

### Financial Goals Format

```csv
user_id,goal_name,category,target_amount,current_amount,
monthly_contribution,deadline,priority,status,progress_percentage
```

### Investment Data Format

```csv
user_id,investment_type,asset_name,amount_invested,
current_value,returns_percentage,purchase_date,platform
```

---

## 🌐 Import from External Sources

### From Kaggle

1. Download dataset from Kaggle
2. Extract ZIP file
3. Move CSV files to `backend/data/`

```bash
# Example
cd Downloads
unzip personal-finance-dataset.zip
move *.csv "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend\data\"
```

### From Google Sheets

1. File → Download → Comma Separated Values (.csv)
2. Save to `backend/data/`

### From Excel

1. File → Save As → CSV (Comma delimited) (\*.csv)
2. Save to `backend/data/`

---

## 🔍 View Your Data

### Using Python

```bash
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend"
python -c "import pandas as pd; df = pd.read_csv('data/personal_finance_data.csv'); print(df.head())"
```

### Using Excel/Calc

Simply open the CSV files directly from `backend/data/` folder.

---

## 💾 Backup Your Data

**Important: Always backup your data!**

```bash
# Create backup
xcopy "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend\data" "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend\data_backup\" /E /I

# Or use the backup folder
mkdir data_backup
copy data\*.csv data_backup\
```

---

## 🔧 Load Data in Application

The backend automatically loads data from `backend/data/` directory.

To use the data in your code:

```python
# In backend Python files
import pandas as pd
import os

# Get data directory path
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# Load data
personal_finance = pd.read_csv(os.path.join(DATA_DIR, 'personal_finance_data.csv'))
transactions = pd.read_csv(os.path.join(DATA_DIR, 'transaction_data.csv'))
goals = pd.read_csv(os.path.join(DATA_DIR, 'financial_goals_data.csv'))
investments = pd.read_csv(os.path.join(DATA_DIR, 'investment_data.csv'))
```

---

## 📊 Data Directory Structure

```
LP-AI-Agent/
├── backend/
│   ├── data/                           ← PUT YOUR CSV FILES HERE
│   │   ├── personal_finance_data.csv   ← Finance records
│   │   ├── transaction_data.csv        ← Transactions
│   │   ├── financial_goals_data.csv    ← Goals
│   │   ├── investment_data.csv         ← Investments
│   │   └── dataset_summary.json        ← Statistics
│   │
│   ├── synthetic_data_generator.py     ← Generate new data
│   ├── finance_api_client.py           ← Fetch real-time data
│   └── finance_manager.py              ← AI models
│
└── database/
    └── mongodb_data/                   ← MongoDB storage
```

---

## ✅ Quick Checklist

- [x] Data directory exists: `backend/data/`
- [x] Synthetic data generated (12K+ records)
- [x] CSV files are readable
- [x] Summary file created
- [ ] Add your own custom data (optional)
- [ ] Backup important data
- [ ] Test data loading

---

## 🚀 Quick Commands

```bash
# Navigate to data folder
cd "F:\My projects\Life-Pilot-AI\LP-AI-Agent\backend\data"

# List all CSV files
dir *.csv

# View file in PowerShell
Get-Content personal_finance_data.csv -Head 10

# Check file size
Get-ChildItem *.csv | Select-Object Name, Length

# Count rows in CSV
(Get-Content personal_finance_data.csv).Count
```

---

## 📞 Need Help?

- **Generate new data**: Run `python synthetic_data_generator.py`
- **Fetch real-time data**: Run `python finance_api_client.py`
- **Check data location**: It's always `backend/data/`
- **File not found**: Make sure you're in the correct directory

---

**Remember: All CSV files go in `backend/data/` folder!** 📂
