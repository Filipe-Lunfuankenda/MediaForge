import urllib.request, re

url = "https://github.com/ggerganov/llama.cpp/releases/latest"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

m = re.search(r'href=["\'](/ggerganov/llama\.cpp/releases/download/[^"\']+llama-[^"\']+-bin-win-msvc-x64\.zip)["\']', html)
if m:
    print("https://github.com" + m.group(1))
else:
    print("Not found")
