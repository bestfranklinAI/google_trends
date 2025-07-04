from src.backend.scraper import build_trends_url
from src.backend.models import TrendRequest


def test_build_trends_url_basic():
    params = TrendRequest(geo="HK", hl="en", hours=48)
    url = build_trends_url(params)
    assert "geo=HK" in url
    assert "hours=48" in url
    assert url.startswith("https://trends.google.com/trending?")


def test_optional_params_omitted():
    params = TrendRequest(geo="HK", hl="en")
    url = build_trends_url(params)
    assert "hours=" not in url
    assert "category=" not in url
