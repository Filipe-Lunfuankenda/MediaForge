import urllib.request, re

try:
    url = "https://github.com/ggml-org/llama.cpp/releases/expanded_assets/v0.4.0"
    html = urllib.request.urlopen(url).read().decode('utf-8')
    zips = re.findall(r'href=[\'"](/[^\'"]+\.zip)[\'"]', html)
    for z in zips:
        print("https://github.com" + z)
except Exception as e:
    pass

try:
    url = "https://github.com/ggml-org/llama.cpp/releases/expanded_assets/b3600"
    html = urllib.request.urlopen(url).read().decode('utf-8')
    zips = re.findall(r'href=[\'"](/[^\'"]+\.zip)[\'"]', html)
    for z in zips:
        print("https://github.com" + z)
except Exception as e:
    pass
