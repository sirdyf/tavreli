# http://stackoverflow.com/questions/10752055/cross-origin-requests-are-only-supported-for-http-error-when-loading-a-local
# http://localhost:8000
open -n -a "Google Chrome" --args --disable-web-security --allow-file-access-from-files
python -m SimpleHTTPServer
