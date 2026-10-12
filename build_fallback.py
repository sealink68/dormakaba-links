# Optioneel: werkt de reservekopie in app.js bij vanuit links.json (python3 build_fallback.py)
import json, pathlib, re
d = pathlib.Path(__file__).parent
data = json.dumps(json.loads((d/"links.json").read_text(encoding="utf-8")), ensure_ascii=False)
js = (d/"app.js").read_text(encoding="utf-8")
js = re.sub(r"var FALLBACK_DATA = .*?;\n", lambda m: "var FALLBACK_DATA = " + data + ";\n", js, count=1)
(d/"app.js").write_text(js, encoding="utf-8")
print("app.js bijgewerkt")
