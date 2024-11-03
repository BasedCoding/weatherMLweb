import pandas as pd
import numpy as np

def clean_data(df):
    # Make a copy of the dataframe to avoid modifying the original
    df_cleaned = df.copy()
    
    # Replace empty strings with NaN
    df_cleaned = df_cleaned.replace(r'^\s*$', np.nan, regex=True)
    
    # For numeric columns, replace NaN with 0
    numeric_columns = df_cleaned.select_dtypes(include=[np.number]).columns
    for col in numeric_columns:
        df_cleaned[col] = pd.to_numeric(df_cleaned[col], errors='coerce').fillna(0)
    
    # For non-numeric columns, replace NaN with "NaN" string
    non_numeric_columns = df_cleaned.select_dtypes(exclude=[np.number]).columns
    for col in non_numeric_columns:
        df_cleaned[col] = df_cleaned[col].fillna("NaN")
    
    # Convert data types if necessary
    for col in df_cleaned.columns:
        if df_cleaned[col].dtype == 'object':
            # Try to convert to numeric, if fails, leave as is
            df_cleaned[col] = pd.to_numeric(df_cleaned[col], errors='ignore')
            
    # Remove duplicates
    df_cleaned = df_cleaned.drop_duplicates()
    
    # Reset index
    df_cleaned = df_cleaned.reset_index(drop=True)
    
    return df_cleaned