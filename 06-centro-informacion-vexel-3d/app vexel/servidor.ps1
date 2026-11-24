# ============================================================
# Servidor de la APP Vexel 3D
# Puerto: 8002  → http://localhost:8002
# ============================================================

$AppPath = Split-Path -Parent $MyInvocation.MyCommand.Path
# $AppPath ya apunta a la carpeta "app vexel", no duplicar

Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "  APP VEXEL 3D - Editor" -ForegroundColor Magenta
Write-Host "  http://localhost:8002" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Abre el editor en: http://localhost:8002" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:8002/")
$Listener.Start()

Write-Host "Esperando conexiones..." -ForegroundColor Cyan

try {
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $RequestPath = $Request.Url.LocalPath
        if ($RequestPath -eq "/") {
            $RequestPath = "/index.html"
        }

        $FilePath = Join-Path $AppPath $RequestPath
        $FilePath = $FilePath.Replace("/", "\")

        Write-Host "Solicitado: $RequestPath" -ForegroundColor Gray

        if (Test-Path $FilePath -PathType Leaf) {
            $Response.StatusCode = 200
            $Content = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentLength64 = $Content.Length

            $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
            switch ($Extension) {
                ".html"  { $Response.ContentType = "text/html; charset=utf-8" }
                ".css"   { $Response.ContentType = "text/css; charset=utf-8" }
                ".js"    { $Response.ContentType = "application/javascript; charset=utf-8" }
                ".json"  { $Response.ContentType = "application/json; charset=utf-8" }
                ".svg"   { $Response.ContentType = "image/svg+xml; charset=utf-8" }
                ".png"   { $Response.ContentType = "image/png" }
                ".jpg"   { $Response.ContentType = "image/jpeg" }
                ".jpeg"  { $Response.ContentType = "image/jpeg" }
                ".gif"   { $Response.ContentType = "image/gif" }
                ".woff"  { $Response.ContentType = "font/woff" }
                ".woff2" { $Response.ContentType = "font/woff2" }
                ".ttf"   { $Response.ContentType = "font/ttf" }
                ".otf"   { $Response.ContentType = "font/otf" }
                default  { $Response.ContentType = "application/octet-stream" }
            }

            $Response.OutputStream.Write($Content, 0, $Content.Length)
        } else {
            $Response.StatusCode = 404
            $Response.ContentType = "text/html; charset=utf-8"
            $ErrorContent = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Archivo no encontrado</h1><p>$FilePath</p>")
            $Response.ContentLength64 = $ErrorContent.Length
            $Response.OutputStream.Write($ErrorContent, 0, $ErrorContent.Length)
        }

        $Response.Close()
    }
}
finally {
    $Listener.Stop()
    Write-Host "Servidor detenido." -ForegroundColor Red
}
