import requests
from fake_useragent import UserAgent
from bs4 import BeautifulSoup

currency = "€"

def get_user_agent():
    ua = UserAgent(os='windows')
    ua = UserAgent(min_percentage=1.3)
    return ua.random

def get_product_info(link):
    session = requests.Session()
    headers = {'User-Agent': get_user_agent()}
    req = session.get(link, headers=headers)
    if req.status_code > 500:
        print("Problem : " + req.status_code)
        return 0
    
    elif req.status_code == 200:
        soup = BeautifulSoup(req.content, 'html.parser')
        title = soup.find("span", {"id": "productTitle"}).text.strip()
        price_str = soup.find("span", {"class": "a-offscreen"}).text.strip()
        # Replace comma with period and remove currency symbol
        price_str = price_str.replace(',', '.').replace(currency, '')
        price = float(price_str)
        score = soup.find("span", {"class": "a-icon-alt"}).text.strip()
        image = soup.find("img", {"id": "landingImage"})['src']
        
        return [title, price, score, image, link]
    
    return 0