$NodeVersion = "v20.14.0"
$NodeExeUrl = "https://nodejs.org/dist/$NodeVersion/win-x64/node.exe"
$BinDir = ".\.bin"
$NodeExePath = Join-Path $BinDir "node.exe"

if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
}

if (-not (Test-Path $NodeExePath)) {
    Write-Host "Downloading portable Node.js $NodeVersion for local preview..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $NodeExeUrl -OutFile $NodeExePath
    Write-Host "Download complete!" -ForegroundColor Green
}

# 檢查是否需要安裝依賴 (雖然原本可能已經安裝失敗或部分安裝，為求保證，用免安裝 node 跑 npm)
# 但下載整個 npm 免安裝比較麻煩。因為我們只需要跑 vitepress，如果有 node_modules 就可以直接跑。
# 如果沒有 node_modules，我們可以用 npx？不，npx 也是 npm 的一部分。
# 不過，vitepress 已經被安裝在 node_modules 裡了嗎？稍早 npm install 雖然因為某些依賴 (rollup) 報錯，但大部分已經裝了。
# 我們可以直接呼叫 node_modules\vitepress\bin\vitepress.js 試試看。

$VitePressPath = ".\node_modules\vitepress\bin\vitepress.js"

if (-not (Test-Path $VitePressPath)) {
    Write-Host "錯誤: 找不到 vitepress，請確認是否已經執行過 npm install" -ForegroundColor Red
    Write-Host "由於您的全域 Node.js 版本問題，如果尚未安裝，請使用較新版本的 Node.js 電腦執行一次 npm install" -ForegroundColor Yellow
    Exit 1
}

Write-Host "Starting VitePress server with portable Node.js..." -ForegroundColor Cyan
& $NodeExePath $VitePressPath dev docs
