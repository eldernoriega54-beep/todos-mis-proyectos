# ============================================================
# Servidor del CENTRO DE INFORMACION Vexel 3D
# Puerto: 8003  → http://localhost:8003
# (La App de edicion corre en el puerto 8002)
# ============================================================

$AppPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  CENTRO DE INFORMACION - Vexel 3D" -ForegroundColor Green
Write-Host "  http://localhost:8003" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Abre tu navegador en: http://localhost:8003" -ForegroundColor Cyan
Write-Host "Para la App del editor ve a: http://localhost:8002" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:8003/")
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
                ".apk"   { $Response.ContentType = "application/vnd.android.package-archive" }
                ".zip"   { $Response.ContentType = "application/zip" }
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
