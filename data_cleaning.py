import pandas as pd
import os
def clean_data(df):
    # Remove rows with any NaN values
    df_cleaned = df.dropna()
    
    # Remove duplicates
    df_cleaned = df_cleaned.drop_duplicates()
    
    # Remove rows with any remaining NaN values after type conversion
    df_cleaned = df_cleaned.dropna()
    
    # Reset index
    df_cleaned = df_cleaned.reset_index(drop=True)
    
    return df_cleaned