Add-Type -AssemblyName System.Drawing

$projectRoot = "c:\Users\USER\Desktop\BCN"
$logoTight = Join-Path $projectRoot "public\images\logo\bcn-logo-standalone-tight.png"
$publicDir = Join-Path $projectRoot "public"
$appDir = Join-Path $projectRoot "app"

# 1. Generate Favicon & App Icons
# We want a dark rounded badge with the gold cube mark for high contrast on all browser tabs
function Create-Icon {
    param(
        [string]$sourcePath,
        [string]$outputPath,
        [int]$size,
        [bool]$hasDarkBackground = $true,
        [int]$padding = 0
    )

    $bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if ($hasDarkBackground) {
        # Rounded dark background with subtle amber glow
        $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 12, 12))
        $g.FillRectangle($brush, 0, 0, $size, $size)
        $brush.Dispose()
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }

    $srcImg = [System.Drawing.Image]::FromFile($sourcePath)
    $targetSize = $size - (2 * $padding)
    $g.DrawImage($srcImg, $padding, $padding, $targetSize, $targetSize)
    $srcImg.Dispose()
    $g.Dispose()

    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Host "Created: $outputPath ($size x $size)"
}

# Generate 32x32, 48x48, 180x180, 192x192, 512x512 icons
Create-Icon -sourcePath $logoTight -outputPath (Join-Path $publicDir "icon.png") -size 32 -hasDarkBackground $true -padding 3
Create-Icon -sourcePath $logoTight -outputPath (Join-Path $appDir "icon.png") -size 32 -hasDarkBackground $true -padding 3
Create-Icon -sourcePath $logoTight -outputPath (Join-Path $publicDir "apple-icon.png") -size 180 -hasDarkBackground $true -padding 20
Create-Icon -sourcePath $logoTight -outputPath (Join-Path $appDir "apple-icon.png") -size 180 -hasDarkBackground $true -padding 20
Create-Icon -sourcePath $logoTight -outputPath (Join-Path $publicDir "icon-192.png") -size 192 -hasDarkBackground $true -padding 24
Create-Icon -sourcePath $logoTight -outputPath (Join-Path $publicDir "icon-512.png") -size 512 -hasDarkBackground $true -padding 64

# Generate real favicon.ico using standard ICO header and PNG payload (widely supported by all modern browsers)
function Create-Ico {
    param(
        [string]$pngPath,
        [string]$icoPath
    )
    $pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
    $stream = [System.IO.File]::OpenWrite($icoPath)
    $writer = New-Object System.IO.BinaryWriter($stream)

    # ICONDIR structure: Reserved (2 bytes, 0), Type (2 bytes, 1 for ICO), Count (2 bytes, 1)
    $writer.Write([UInt16]0)
    $writer.Write([UInt16]1)
    $writer.Write([UInt16]1)

    # ICONDIRENTRY structure (16 bytes):
    # Width (1 byte, 32), Height (1 byte, 32), ColorCount (1 byte, 0), Reserved (1 byte, 0)
    # Planes (2 bytes, 1), BitCount (2 bytes, 32), BytesInRes (4 bytes, png size), ImageOffset (4 bytes, 22)
    $writer.Write([Byte]32)
    $writer.Write([Byte]32)
    $writer.Write([Byte]0)
    $writer.Write([Byte]0)
    $writer.Write([UInt16]1)
    $writer.Write([UInt16]32)
    $writer.Write([UInt32]$pngBytes.Length)
    $writer.Write([UInt32]22) # 6 (ICONDIR) + 16 (ICONDIRENTRY) = 22

    # Write PNG payload
    $writer.Write($pngBytes)
    $writer.Flush()
    $writer.Dispose()
    $stream.Dispose()
    Write-Host "Created ICO: $icoPath"
}

Create-Ico -pngPath (Join-Path $publicDir "icon.png") -icoPath (Join-Path $publicDir "favicon.ico")
Create-Ico -pngPath (Join-Path $appDir "icon.png") -icoPath (Join-Path $appDir "favicon.ico")

Write-Host "Favicons and icons generated successfully!"
