from src.backend.parser import parse_trending_html

SAMPLE_HTML = """
<table><tbody>
<tr jsname='oKdM2c'><td class='jvkLtd'><div class='mZ3RIc'>Topic 1</div></td></tr>
<tr jsname='oKdM2c'><td class='jvkLtd'><div class='mZ3RIc'>Topic 2</div></td></tr>
</tbody></table>
"""

SAMPLE_REALTIME_HTML = """
<div jsname='oKdM2c'>
  <div class='mZ3RIc'>AI Technology</div>
  <div class='search-volume'>500K+ searches</div>
  <div class='change'>+25%</div>
</div>
<div jsname='oKdM2c'>
  <div class='mZ3RIc'>Climate Change</div>
  <div class='search-volume'>300K+ searches</div>
  <div class='change'>+15%</div>
</div>
"""

def test_parse_trending_html():
    """Test parsing the original HTML format."""
    trends = parse_trending_html(SAMPLE_HTML)
    assert len(trends) == 2
    assert trends[0].title == "Topic 1"
    assert trends[0].ranking == 1
    assert trends[1].title == "Topic 2"
    assert trends[1].ranking == 2

def test_parse_realtime_html():
    """Test parsing enhanced HTML with search volume and changes."""
    trends = parse_trending_html(SAMPLE_REALTIME_HTML)
    assert len(trends) == 2
    assert trends[0].title == "AI Technology"
    assert trends[0].ranking == 1
    assert trends[1].title == "Climate Change"
    assert trends[1].ranking == 2

def test_parse_empty_html():
    """Test parsing empty HTML."""
    trends = parse_trending_html("")
    assert len(trends) == 0

def test_parse_malformed_html():
    """Test parsing malformed HTML."""
    trends = parse_trending_html("<div>Random content</div>")
    # Should return some trends or empty list, not crash
    assert isinstance(trends, list)
