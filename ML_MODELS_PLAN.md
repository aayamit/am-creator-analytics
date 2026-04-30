# Machine Learning Models Plan (PM-25)

## 🎯 Overview
Add **predictive ML models** for:
- **Churn Prediction**: Which creators are likely to leave?
- **LTV Scoring**: Predict lifetime value of creators
- **Campaign Success Prediction**: Will this campaign succeed?
- **Creator Recommendations**: ML-powered (beyond rule-based)

## 📊 ML Models to Build

### 1. Churn Prediction Model
```python
# ml/churn_model.py
# Features: login frequency, payout history, engagement trend, support tickets
# Algorithm: Random Forest Classifier (sklearn)

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Fetch data from Postgres
# Features: days_since_last_login, avg_monthly_earnings, support_ticket_count, etc.
# Label: churned (0/1)

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y)
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Predict churn probability
churn_prob = model.predict_proba(creator_features)[:, 1]
```

### 2. LTV Scoring Model
```python
# ml/ltv_model.py
# Predict lifetime value based on:
# - Monthly earnings trend
# - Follower growth rate
# - Engagement rate stability
# - Campaign success rate

# Algorithm: Gradient Boosting Regressor
from sklearn.ensemble import GradientBoostingRegressor

# Features: [monthly_earnings, follower_growth, engagement_stability, campaign_success_rate]
# Target: LTV (total earnings over 12 months)

model = GradientBoostingRegressor(n_estimators=100)
model.fit(X_train, y_train)
ltv_prediction = model.predict(creator_features)
```

### 3. Campaign Success Prediction
```python
# ml/campaign_success_model.py
# Predict if a campaign will meet its ROI target
# Features: budget, creator_count, avg_creator_engagement, seasonality

# Algorithm: Logistic Regression (binary: success/failure)
from sklearn.linear_model import LogisticRegression

# Label: ROI >= target (1) or not (0)
model = LogisticRegression()
model.fit(X_train, y_train)
success_prob = model.predict_proba(campaign_features)[:, 1]
```

### 4. API Routes to Serve Predictions
- **POST /api/ml/churn-predict** — Get churn probability for creators
- **POST /api/ml/ltv-predict** — Get LTV prediction
- **POST /api/ml/campaign-success-predict** — Predict campaign success

### 5. UI Components
- **ChurnRiskDashboard** — Show creators with high churn risk
- **LTVScoringDashboard** — Show predicted LTV for each creator
- **CampaignSuccessPredictor** — Show success probability when creating campaign

## 🛠️ Implementation Steps
1. Install Python dependencies: `pip install pandas scikit-learn joblib psycopg2-binary`
2. Create ML models in `ml/` directory
3. Create API routes that call Python scripts (or use `child_process`)
4. Create UI components to display predictions
5. Test: Train model, get predictions
6. Commit PM-25

## 💰 Cost Savings
- **ML Platform**: Custom (free) vs DataRobot ($30k/yr)
- **Predictive Analytics**: Custom (free) vs Alteryx ($5k/yr)

**Total Savings**: ~₹27L/year (vs enterprise ML platforms)
