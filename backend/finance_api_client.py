"""
Finance API Client
Fetches real-time finance data from various free APIs
"""

import requests
from typing import Dict, Optional, List
from datetime import datetime
import time


class FinanceAPIClient:
    """Client for fetching finance data from various free APIs"""
    
    def __init__(self, alpha_vantage_key: Optional[str] = None):
        self.alpha_vantage_key = alpha_vantage_key
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def get_currency_rate(self, from_curr: str = "USD", to_curr: str = "BDT") -> Optional[Dict]:
        """
        Get currency exchange rate
        Using free ExchangeRate-API
        """
        url = f"https://api.exchangerate-api.com/v4/latest/{from_curr}"
        
        try:
            response = requests.get(url, timeout=10)
            data = response.json()
            
            if 'rates' in data and to_curr in data['rates']:
                return {
                    'from': from_curr,
                    'to': to_curr,
                    'rate': data['rates'][to_curr],
                    'timestamp': data.get('date', datetime.now().isoformat())
                }
            return None
        except Exception as e:
            print(f"Error fetching currency rate: {e}")
            return None
    
    def get_stock_quote(self, symbol: str) -> Optional[Dict]:
        """
        Get stock quote using Alpha Vantage API
        Note: Requires API key (free tier: 5 calls/minute, 500 calls/day)
        Get your free key from: https://www.alphavantage.co/support/#api-key
        """
        if not self.alpha_vantage_key:
            print("Alpha Vantage API key not provided")
            return None
        
        url = f"https://www.alphavantage.co/query"
        params = {
            'function': 'GLOBAL_QUOTE',
            'symbol': symbol,
            'apikey': self.alpha_vantage_key
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if 'Global Quote' in data:
                quote = data['Global Quote']
                return {
                    'symbol': quote.get('01. symbol'),
                    'price': float(quote.get('05. price', 0)),
                    'change': float(quote.get('09. change', 0)),
                    'change_percent': quote.get('10. change percent', '0%'),
                    'volume': int(quote.get('06. volume', 0)),
                    'timestamp': quote.get('07. latest trading day')
                }
            return None
        except Exception as e:
            print(f"Error fetching stock quote: {e}")
            return None
    
    def get_crypto_price(self, crypto_id: str = "bitcoin") -> Optional[Dict]:
        """
        Get cryptocurrency price using CoinGecko API (Free, no API key needed)
        """
        url = f"https://api.coingecko.com/api/v3/simple/price"
        params = {
            'ids': crypto_id,
            'vs_currencies': 'usd,bdt',
            'include_24hr_change': 'true'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if crypto_id in data:
                return {
                    'crypto': crypto_id,
                    'usd_price': data[crypto_id].get('usd'),
                    'bdt_price': data[crypto_id].get('bdt'),
                    'change_24h': data[crypto_id].get('usd_24h_change'),
                    'timestamp': datetime.now().isoformat()
                }
            return None
        except Exception as e:
            print(f"Error fetching crypto price: {e}")
            return None
    
    def get_bangladesh_market_data(self) -> Dict:
        """
        Get Bangladesh-specific market data
        Note: These are example values - replace with actual API calls when available
        """
        # In production, scrape from Bangladesh Bank, BBS, or DSE
        indicators = {
            'inflation_rate': 6.0,  # Bangladesh inflation rate
            'bank_rate': 4.75,  # Bangladesh Bank policy rate
            'gdp_growth': 7.2,  # GDP growth rate
            'unemployment': 4.2,  # Unemployment rate
            'usd_to_bdt': 110.5,  # Exchange rate
            'gold_price_per_bhori': 95000,  # Gold price in BDT
            'timestamp': datetime.now().isoformat(),
            'source': 'Bangladesh Bank / BBS (estimated)'
        }
        
        # Try to get real exchange rate
        exchange_data = self.get_currency_rate('USD', 'BDT')
        if exchange_data:
            indicators['usd_to_bdt'] = exchange_data['rate']
        
        return indicators
    
    def get_interest_rates(self) -> Dict:
        """
        Get interest rates for Bangladesh banks
        Note: These are example values - replace with actual data
        """
        return {
            'savings_account': {
                'min': 2.5,
                'max': 4.0,
                'average': 3.0
            },
            'fixed_deposit': {
                '3_months': 5.0,
                '6_months': 5.5,
                '1_year': 6.0,
                '3_year': 6.5,
                '5_year': 7.0
            },
            'loan_rates': {
                'personal_loan': 12.0,
                'home_loan': 9.0,
                'car_loan': 11.0,
                'education_loan': 8.0
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_global_indices(self) -> Dict:
        """
        Get major global market indices
        Using free financial APIs
        """
        indices = {
            'S&P 500': 'SPY',
            'NASDAQ': 'QQQ',
            'Dow Jones': 'DIA'
        }
        
        results = {}
        
        for index_name, symbol in indices.items():
            if self.alpha_vantage_key:
                quote = self.get_stock_quote(symbol)
                if quote:
                    results[index_name] = {
                        'price': quote['price'],
                        'change': quote['change'],
                        'change_percent': quote['change_percent']
                    }
                time.sleep(12)  # Rate limiting for free tier (5 calls/min)
        
        return results
    
    def get_commodity_prices(self) -> Dict:
        """
        Get commodity prices (Gold, Oil, etc.)
        Note: Replace with actual API calls
        """
        return {
            'gold': {
                'price_per_oz_usd': 2020.50,
                'price_per_bhori_bdt': 95000,
                'change_percent': 1.2
            },
            'silver': {
                'price_per_oz_usd': 25.30,
                'change_percent': -0.5
            },
            'crude_oil': {
                'price_per_barrel_usd': 75.80,
                'change_percent': 2.1
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_economic_calendar(self) -> List[Dict]:
        """
        Get upcoming economic events
        Note: This is example data - integrate with actual calendar API
        """
        return [
            {
                'date': '2026-02-01',
                'event': 'Bangladesh Bank Monetary Policy',
                'impact': 'High',
                'description': 'Interest rate decision'
            },
            {
                'date': '2026-02-05',
                'event': 'Inflation Report',
                'impact': 'Medium',
                'description': 'Monthly inflation data release'
            },
            {
                'date': '2026-02-10',
                'event': 'GDP Growth Report',
                'impact': 'High',
                'description': 'Quarterly GDP growth figures'
            }
        ]


def demo():
    """Demo function to show API usage"""
    print("=" * 60)
    print("   Finance API Client Demo")
    print("=" * 60)
    print()
    
    # Initialize client
    client = FinanceAPIClient()
    
    # 1. Currency Exchange Rates
    print("💱 Currency Exchange Rates:")
    usd_to_bdt = client.get_currency_rate('USD', 'BDT')
    if usd_to_bdt:
        print(f"   1 {usd_to_bdt['from']} = {usd_to_bdt['rate']:.2f} {usd_to_bdt['to']}")
    
    eur_to_bdt = client.get_currency_rate('EUR', 'BDT')
    if eur_to_bdt:
        print(f"   1 {eur_to_bdt['from']} = {eur_to_bdt['rate']:.2f} {eur_to_bdt['to']}")
    
    # 2. Cryptocurrency Prices
    print("\n🪙 Cryptocurrency Prices:")
    bitcoin = client.get_crypto_price('bitcoin')
    if bitcoin:
        print(f"   Bitcoin: ${bitcoin['usd_price']:,.2f} USD (৳{bitcoin['bdt_price']:,.2f} BDT)")
        print(f"   24h Change: {bitcoin['change_24h']:.2f}%")
    
    ethereum = client.get_crypto_price('ethereum')
    if ethereum:
        print(f"   Ethereum: ${ethereum['usd_price']:,.2f} USD")
    
    # 3. Bangladesh Market Data
    print("\n🇧🇩 Bangladesh Market Data:")
    bd_data = client.get_bangladesh_market_data()
    print(f"   Inflation Rate: {bd_data['inflation_rate']}%")
    print(f"   Bank Rate: {bd_data['bank_rate']}%")
    print(f"   GDP Growth: {bd_data['gdp_growth']}%")
    print(f"   USD/BDT: {bd_data['usd_to_bdt']}")
    
    # 4. Interest Rates
    print("\n📊 Interest Rates:")
    rates = client.get_interest_rates()
    print(f"   Savings Account: {rates['savings_account']['average']}%")
    print(f"   Fixed Deposit (1 year): {rates['fixed_deposit']['1_year']}%")
    print(f"   Personal Loan: {rates['loan_rates']['personal_loan']}%")
    print(f"   Home Loan: {rates['loan_rates']['home_loan']}%")
    
    # 5. Commodity Prices
    print("\n🏆 Commodity Prices:")
    commodities = client.get_commodity_prices()
    print(f"   Gold: ${commodities['gold']['price_per_oz_usd']:.2f}/oz (৳{commodities['gold']['price_per_bhori_bdt']:,}/bhori)")
    print(f"   Crude Oil: ${commodities['crude_oil']['price_per_barrel_usd']:.2f}/barrel")
    
    # 6. Economic Calendar
    print("\n📅 Upcoming Economic Events:")
    calendar = client.get_economic_calendar()
    for event in calendar[:3]:
        print(f"   {event['date']}: {event['event']} ({event['impact']} impact)")
    
    print("\n" + "=" * 60)
    print("   Demo Complete!")
    print("=" * 60)
    print("\n💡 Tip: Get your free Alpha Vantage API key from:")
    print("   https://www.alphavantage.co/support/#api-key")


if __name__ == "__main__":
    demo()
