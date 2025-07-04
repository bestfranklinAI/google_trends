from bs4 import BeautifulSoup
from typing import List
import re
import logging

from .models import Trend

logger = logging.getLogger(__name__)

def parse_trending_html(html: str) -> List[Trend]:
    """Parse Google Trends HTML into a list of Trend objects."""
    soup = BeautifulSoup(html, "html.parser")
    trends = []
    
    logger.info(f"Parsing HTML of length: {len(html)}")
    
    # Check if this is a JavaScript-heavy page that hasn't loaded content yet
    if "enOdEe-wZVHld-zg7Cn" in html or "jsname='oKdM2c'" in html:
        logger.info("Detected Google Trends table structure in HTML")
        
        # Handle the current Google Trends table structure
        # Look for table rows with trend data
        trend_rows = soup.select("tr[jsname='oKdM2c']")
        
        if trend_rows:
            logger.info(f"Found {len(trend_rows)} trend rows in table structure")
            for i, row in enumerate(trend_rows):
                trend = extract_trend_from_table_row(row, i + 1)
                if trend:
                    trends.append(trend)
                    logger.debug(f"Added trend {i+1}: {trend.title}")
        else:
            logger.warning("Table structure detected but no trend rows found")
            
    else:
        logger.info("No modern table structure found, trying alternative parsing methods")
        
        # Check if this is a mostly empty page (JavaScript not executed)
        text_content = soup.get_text(strip=True)
        if len(text_content) < 1000:  # Suspiciously small content
            logger.warning("HTML content is very small, likely JavaScript-rendered page")
            logger.info("Content preview: " + text_content[:200] + "...")
            
        # Fallback: Handle legacy or alternative HTML structures
        # Look for various possible selectors for trending topics
        selectors = [
            "td.jvkLtd div.mZ3RIc",  # Legacy structure matching the table
            "div[jsname='oKdM2c']",
            ".trending-story",
            ".trending-topic",
            "article",
            "[data-entity-type='trending_story']",
            # Additional selectors for different Google Trends layouts
            ".trending-queries-table tr",
            ".trending-searches-content div",
            ".feed-item",
            ".trending-story-title"
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                logger.info(f"Found {len(elements)} elements with selector: {selector}")
                if selector == "td.jvkLtd div.mZ3RIc":
                    # Handle legacy structure
                    titles = [node.get_text(strip=True) for node in elements]
                    trends = [Trend(title=t, ranking=i+1) for i, t in enumerate(titles) if t and len(t) > 2]
                else:
                    # Handle other structures
                    for i, element in enumerate(elements):
                        trend = extract_trend_data(element, i + 1)
                        if trend and trend.title and len(trend.title) > 2:
                            trends.append(trend)
                
                if trends:
                    logger.info(f"Successfully extracted {len(trends)} trends using selector: {selector}")
                    break
        
        # Final fallback: try to extract any meaningful text that could be trends
        if not trends:
            logger.info("No structured data found, attempting intelligent text extraction")
            # Look for text patterns that might be trending topics
            text_elements = soup.find_all(text=True)
            potential_trends = []
            
            for text in text_elements:
                text = text.strip()
                if (len(text) > 3 and len(text) < 100 and 
                    not text.startswith(('http', 'www', 'google', 'search', 'trend')) and 
                    not text.isdigit() and
                    not text.lower() in ['search', 'trending', 'more', 'news', 'google', 'trends', 'privacy', 'terms', 'help', 'settings']):
                    potential_trends.append(text)
            
            # Filter out likely non-trend text
            filtered_trends = []
            for text in potential_trends:
                # Skip if it looks like code or technical content
                if any(char in text for char in ['()', '{}', '[]', '=', ';', '<', '>', 'function', 'var ', 'const ']):
                    continue
                # Skip if it's all uppercase (likely a UI element)
                if text.isupper() and len(text) < 10:
                    continue
                # Skip if it contains common web elements
                if any(word in text.lower() for word in ['onload', 'gtag', 'function', 'script', 'css', 'javascript']):
                    continue
                filtered_trends.append(text)
            
            # Take unique trends and limit to reasonable number
            unique_trends = list(dict.fromkeys(filtered_trends))[:20]
            trends = [Trend(title=t, ranking=i+1) for i, t in enumerate(unique_trends) if len(t) > 2]
    
    logger.info(f"Parsed {len(trends)} trends from HTML")
    
    # Log the first few trends for debugging
    for i, trend in enumerate(trends[:5]):
        logger.info(f"Trend {i+1}: {trend.title} (volume: {trend.search_volume}, change: {trend.change_percentage})")
    
    return trends

def extract_trend_data(element, ranking: int) -> Trend:
    """Extract trend data from a single HTML element."""
    title = ""
    search_volume = None
    change_percentage = None
    url = None
    
    # Extract title
    title_selectors = [
        ".mZ3RIc",
        "h3",
        "h2",
        ".title",
        "[data-entity-name]",
        "a"
    ]
    
    for selector in title_selectors:
        title_element = element.select_one(selector)
        if title_element:
            title = title_element.get_text(strip=True)
            break
    
    # If no title found, try to get any text content
    if not title:
        title = element.get_text(strip=True)
    
    # Extract search volume if available
    volume_element = element.select_one(".search-volume, .volume, [data-volume]")
    if volume_element:
        search_volume = volume_element.get_text(strip=True)
    
    # Extract change percentage if available
    change_element = element.select_one(".change, .percentage, [data-change]")
    if change_element:
        change_percentage = change_element.get_text(strip=True)
    
    # Extract URL if available
    link_element = element.select_one("a[href]")
    if link_element:
        url = link_element.get('href')
    
    return Trend(
        title=title,
        ranking=ranking,
        search_volume=search_volume,
        change_percentage=change_percentage,
        url=url
    ) if title else None

def extract_trend_from_table_row(row, ranking: int) -> Trend:
    """Extract trend data from a Google Trends table row."""
    title = ""
    search_volume = None
    change_percentage = None
    url = None
    related_queries = []
    
    logger.debug(f"Processing row {ranking}: {row}")
    
    # Extract title from the main trend cell
    # Based on the HTML structure: <td class="jvkLtd"><div class="mZ3RIc">TITLE</div></td>
    title_element = row.select_one("td.jvkLtd div.mZ3RIc")
    if title_element:
        title = title_element.get_text(strip=True)
        logger.debug(f"Found title: {title}")
    
    # Extract search volume from the volume cell
    # Based on the HTML structure: <td class="dQOTjf"><div class="lqv0Cb">VOLUME</div></td>
    volume_element = row.select_one("td.dQOTjf div.lqv0Cb")
    if volume_element:
        search_volume = volume_element.get_text(strip=True)
        logger.debug(f"Found search volume: {search_volume}")
        # Ensure it has proper suffix
        if search_volume and not search_volume.endswith("searches") and any(c.isdigit() for c in search_volume):
            search_volume += " searches"
    
    # Extract change percentage from the change indicator
    # Based on the HTML structure: <td class="dQOTjf"><div class="wqrjjc"><div class="TXt85b">CHANGE</div></div></td>
    change_element = row.select_one("td.dQOTjf div.wqrjjc div.TXt85b")
    if change_element:
        change_percentage = change_element.get_text(strip=True)
        logger.debug(f"Found change percentage: {change_percentage}")
    
    # Extract URL from any links in the row
    link_element = row.select_one("a[href]")
    if link_element:
        href = link_element.get('href')
        # Make sure it's a valid Google Trends URL
        if href and ('trends.google.com' in href or href.startswith('/')):
            url = href if href.startswith('http') else f"https://trends.google.com{href}"
            logger.debug(f"Found URL: {url}")
    
    # Extract related queries from the breakdown section
    # Based on the HTML structure: <td class="xm9Xec">...breakdown buttons...</td>
    breakdown_section = row.select_one("td.xm9Xec")
    if breakdown_section:
        # Look for buttons with data-term attribute
        breakdown_buttons = breakdown_section.select("button[data-term]")
        for button in breakdown_buttons:
            term = button.get('data-term')
            if term and term != title and term not in related_queries:
                related_queries.append(term)
                logger.debug(f"Found related query: {term}")
        
        # If no data-term attributes, try to extract from button text
        if not related_queries:
            button_elements = breakdown_section.select("button")
            for button in button_elements:
                term = button.get_text(strip=True)
                if term and term != title and len(term) > 2 and term not in related_queries:
                    related_queries.append(term)
                    logger.debug(f"Found related query from button text: {term}")
    
    # Create the trend object
    trend = Trend(
        title=title,
        ranking=ranking,
        search_volume=search_volume,
        change_percentage=change_percentage,
        url=url,
        related_queries=related_queries if related_queries else None
    ) if title else None
    
    if trend:
        logger.debug(f"Created trend: {trend.title} (ranking: {trend.ranking})")
    else:
        logger.warning(f"Could not create trend from row {ranking}")
    
    return trend
