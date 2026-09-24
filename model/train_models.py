import os
import json
import pickle
import joblib
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import TimeSeriesSplit

import yfinance as yf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "..", "backend", "historical_stock_data.csv")
if not os.path.exists(CSV_PATH):
    CSV_PATH = os.path.join(BASE_DIR, "historical_stock_data.csv")

def load_and_preprocess_data(ticker="RELIANCE.NS"):
    print(f"Fetching live market data for {ticker} via yfinance...")
    raw = pd.DataFrame()
    try:
        live = yf.download(ticker, period="max", auto_adjust=True, progress=False)
        if not live.empty:
            if isinstance(live.columns, pd.MultiIndex):
                live.columns = live.columns.get_level_values(0)
            BASE_COLS = ["Open", "High", "Low", "Close", "Volume"]
            if all(c in live.columns for c in BASE_COLS):
                raw = live[BASE_COLS].copy()
                for col in BASE_COLS:
                    raw[col] = pd.to_numeric(raw[col], errors="coerce")
                raw = raw.dropna().sort_index()
                print(f"Successfully ingested {len(raw)} live trading days from yfinance API.")
    except Exception as e:
        print(f"yfinance live fetch warning: {e}. Falling back to local cache.")

    if raw.empty and os.path.exists(CSV_PATH):
        print(f"Loading cached historical dataset from {CSV_PATH}...")
        raw = pd.read_csv(CSV_PATH, header=[0, 1], index_col=0)
        raw.columns = raw.columns.get_level_values(0)
        raw.index = pd.to_datetime(raw.index, errors="coerce")
        raw = raw.dropna(how="all").sort_index()
        for col in ["Close", "High", "Low", "Open", "Volume"]:
            if col in raw.columns:
                raw[col] = pd.to_numeric(raw[col], errors="coerce")

    df = raw.dropna().copy()
    if not df.empty:
        # Cache updated data to local CSV
        df.to_csv(CSV_PATH)

    # Target: Next day log return ln(P_{t+1} / P_t)
    df["Target_Return"] = np.log(df["Close"].shift(-1) / df["Close"])

    # 1. Multi-Period Returns & Log Return Lags
    for n in [1, 2, 3, 5, 10, 20]:
        df[f"Return_{n}"] = df["Close"].pct_change(n)

    df["Log_Return_Lag_1"] = np.log(df["Close"] / df["Close"].shift(1))
    df["Log_Return_Lag_2"] = np.log(df["Close"].shift(1) / df["Close"].shift(2))
    df["Log_Return_Lag_3"] = np.log(df["Close"].shift(2) / df["Close"].shift(3))
    df["Log_Return_Lag_5"] = np.log(df["Close"].shift(4) / df["Close"].shift(5))

    # 2. Moving Averages (20, 50, 200-day SMAs and EMAs)
    for n in [5, 10, 20, 50, 200]:
        df[f"SMA_{n}"] = df["Close"].rolling(n).mean()
        df[f"EMA_{n}"] = df["Close"].ewm(span=n, adjust=False).mean()

    # Scale-Invariant Price Ratios
    df["Close_SMA5_Ratio"] = df["Close"] / df["SMA_5"]
    df["Close_SMA10_Ratio"] = df["Close"] / df["SMA_10"]
    df["Close_SMA20_Ratio"] = df["Close"] / df["SMA_20"]
    df["Close_SMA50_Ratio"] = df["Close"] / df["SMA_50"]
    df["Close_SMA200_Ratio"] = df["Close"] / df["SMA_200"]
    df["Close_EMA20_Ratio"] = df["Close"] / df["EMA_20"]
    df["Close_EMA50_Ratio"] = df["Close"] / df["EMA_50"]
    df["Close_EMA200_Ratio"] = df["Close"] / df["EMA_200"]

    # Moving Average Crossovers
    df["SMA20_SMA50_Ratio"] = df["SMA_20"] / df["SMA_50"]
    df["SMA50_SMA200_Ratio"] = df["SMA_50"] / df["SMA_200"]

    # 3. Bollinger Bands (20-day, 2 stddev)
    rolling_std_20 = df["Close"].rolling(20).std()
    df["BB_Upper"] = df["SMA_20"] + (2 * rolling_std_20)
    df["BB_Lower"] = df["SMA_20"] - (2 * rolling_std_20)
    df["Bollinger_B_Pct"] = (df["Close"] - df["BB_Lower"]) / (df["BB_Upper"] - df["BB_Lower"] + 1e-8)
    df["Bollinger_BandWidth"] = (df["BB_Upper"] - df["BB_Lower"]) / df["SMA_20"]

    # 4. Volatility Metrics
    for n in [5, 10, 20, 50]:
        df[f"Volatility_{n}"] = df["Return_1"].rolling(n).std()

    # 5. Average True Range (ATR_14) Normalized by Close
    prev_close = df["Close"].shift(1)
    tr1 = df["High"] - df["Low"]
    tr2 = (df["High"] - prev_close).abs()
    tr3 = (df["Low"] - prev_close).abs()
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    df["ATR_14_Norm"] = tr.rolling(14).mean() / df["Close"]

    # 6. Daily Price Ranges
    df["High_Low_Range"] = (df["High"] - df["Low"]) / df["Close"]
    df["Open_Close_Range"] = (df["Close"] - df["Open"]) / df["Open"]

    # 7. RSI (14-day)
    delta = df["Close"].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(14).mean()
    avg_loss = loss.rolling(14).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    df["RSI_14"] = 100 - (100 / (1 + rs))

    # 8. MACD & MACD Histogram Normalized by Close
    ema12 = df["Close"].ewm(span=12, adjust=False).mean()
    ema26 = df["Close"].ewm(span=26, adjust=False).mean()
    macd_raw = ema12 - ema26
    macd_sig_raw = macd_raw.ewm(span=9, adjust=False).mean()
    macd_hist_raw = macd_raw - macd_sig_raw

    df["MACD"] = macd_raw / df["Close"]
    df["MACD_Signal"] = macd_sig_raw / df["Close"]
    df["MACD_Hist"] = macd_hist_raw / df["Close"]

    # 9. Volume Features
    df["Volume_Change"] = df["Volume"].pct_change()
    df["Volume_SMA_10"] = df["Volume"].rolling(10).mean()
    df["Volume_SMA_20"] = df["Volume"].rolling(20).mean()
    df["Volume_Ratio_10"] = np.where(df["Volume_SMA_10"] != 0, df["Volume"] / df["Volume_SMA_10"], np.nan)
    df["Volume_Ratio_20"] = np.where(df["Volume_SMA_20"] != 0, df["Volume"] / df["Volume_SMA_20"], np.nan)

    features = [
        "Return_1", "Return_2", "Return_3", "Return_5", "Return_10", "Return_20",
        "Log_Return_Lag_1", "Log_Return_Lag_2", "Log_Return_Lag_3", "Log_Return_Lag_5",
        "Close_SMA5_Ratio", "Close_SMA10_Ratio", "Close_SMA20_Ratio", "Close_SMA50_Ratio", "Close_SMA200_Ratio",
        "Close_EMA20_Ratio", "Close_EMA50_Ratio", "Close_EMA200_Ratio",
        "SMA20_SMA50_Ratio", "SMA50_SMA200_Ratio",
        "Bollinger_B_Pct", "Bollinger_BandWidth",
        "Volatility_5", "Volatility_10", "Volatility_20", "Volatility_50",
        "ATR_14_Norm", "High_Low_Range", "Open_Close_Range",
        "RSI_14", "MACD", "MACD_Signal", "MACD_Hist",
        "Volume_Change", "Volume_Ratio_10", "Volume_Ratio_20"
    ]

    clean_df = df.replace([np.inf, -np.inf], np.nan).dropna(subset=features + ["Target_Return"]).copy()

    X = clean_df[features].astype(np.float64)
    y = clean_df["Target_Return"].astype(np.float64)

    return clean_df, X, y, features


def train_and_evaluate():
    clean_df, X, y, features = load_and_preprocess_data()

    split = int(len(clean_df) * 0.80)
    X_train, X_test = X.iloc[:split], X.iloc[split:]
    y_train, y_test = y.iloc[:split], y.iloc[split:]

    print(f"Dataset Total: {len(clean_df)} rows. Train: {len(X_train)}, Test: {len(X_test)}. Features: {len(features)}")

    linear_model = Pipeline([
        ("scaler", StandardScaler()),
        ("model", LinearRegression())
    ])

    polynomial_model = Pipeline([
        ("scaler", StandardScaler()),
        ("poly", PolynomialFeatures(degree=2, include_bias=False)),
        ("model", LinearRegression())
    ])

    rbf_model = Pipeline([
        ("scaler", StandardScaler()),
        ("model", SVR(kernel="rbf", C=5.0, gamma="scale", epsilon=0.005))
    ])

    random_forest_model = RandomForestRegressor(
        n_estimators=500,
        max_depth=10,
        min_samples_split=10,
        min_samples_leaf=4,
        max_features="sqrt",
        random_state=42,
        n_jobs=-1
    )

    models = {
        "linear": linear_model,
        "polynomial": polynomial_model,
        "rbf": rbf_model,
        "rf": random_forest_model
    }

    current_close = clean_df.loc[X_test.index, "Close"]
    actual_next_close = current_close * np.exp(y_test)

    tscv = TimeSeriesSplit(n_splits=5)
    metrics_summary = {}

    for key, model in models.items():
        # 1. Walk-Forward Cross-Validation via TimeSeriesSplit
        cv_dir_accs = []
        cv_r2_scores = []
        cv_maes = []

        for fold, (train_idx, val_idx) in enumerate(tscv.split(X_train), 1):
            X_cv_tr, X_cv_val = X_train.iloc[train_idx], X_train.iloc[val_idx]
            y_cv_tr, y_cv_val = y_train.iloc[train_idx], y_train.iloc[val_idx]

            model.fit(X_cv_tr, y_cv_tr)
            cv_preds = model.predict(X_cv_val)

            cv_dir_acc = ((y_cv_val > 0) == (cv_preds > 0)).mean() * 100
            cv_r2 = r2_score(y_cv_val, cv_preds)
            cv_mae = mean_absolute_error(y_cv_val, cv_preds)

            cv_dir_accs.append(cv_dir_acc)
            cv_r2_scores.append(cv_r2)
            cv_maes.append(cv_mae)

        mean_cv_dir_acc = np.mean(cv_dir_accs)
        mean_cv_r2 = np.mean(cv_r2_scores)
        mean_cv_mae = np.mean(cv_maes)

        # 2. Final Holdout Evaluation on Test Set
        model.fit(X_train, y_train)
        pred_returns = model.predict(X_test)
        pred_next_close = current_close * np.exp(pred_returns)

        ret_r2 = r2_score(y_test, pred_returns)
        ret_mae = mean_absolute_error(y_test, pred_returns)
        ret_rmse = np.sqrt(mean_squared_error(y_test, pred_returns))

        dir_acc = ((y_test > 0) == (pred_returns > 0)).mean() * 100

        price_mae = mean_absolute_error(actual_next_close, pred_next_close)
        price_rmse = np.sqrt(mean_squared_error(actual_next_close, pred_next_close))

        print(f"\n--- Model: {key.upper()} ---")
        print(f"  [TimeSeriesSplit CV] 5-Fold Walk-Forward Dir. Acc: {mean_cv_dir_acc:.2f}% | R^2: {mean_cv_r2:.4f} | MAE: {mean_cv_mae:.6f}")
        print(f"  [Holdout Test Set ] Directional Acc: {dir_acc:.2f}% | Price MAE: INR {price_mae:.2f} | Price RMSE: INR {price_rmse:.2f}")

        metrics_summary[key] = {
            "accuracy": f"{dir_acc:.1f}%",
            "r2Score": f"{ret_r2:.3f}",
            "directionalAccuracy": f"{dir_acc:.1f}%",
            "mae": f"₹{price_mae:.2f}",
            "rmse": f"₹{price_rmse:.2f}",
            "cv_dir_acc": f"{mean_cv_dir_acc:.1f}%",
            "cv_r2Score": f"{mean_cv_r2:.3f}",
            "return_mae": f"{ret_mae:.5f}",
            "return_rmse": f"{ret_rmse:.5f}"
        }

        pkl_name = {
            "linear": "linear_regression_model.pkl",
            "polynomial": "polynomial_regression_model.pkl",
            "rbf": "rbf_svr_model.pkl",
            "rf": "reliance_random_forest_model.pkl"
        }[key]
        joblib.dump(model, os.path.join(BASE_DIR, pkl_name))

    with open(os.path.join(BASE_DIR, "reliance_model_features.pkl"), "wb") as f:
        pickle.dump(features, f)

    metrics_path = os.path.join(BASE_DIR, "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_summary, f, indent=2)

    print("\nSaved all retrained models, features, and model_metrics.json successfully.")

if __name__ == "__main__":
    train_and_evaluate()
