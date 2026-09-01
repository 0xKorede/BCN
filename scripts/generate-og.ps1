Add-Type -AssemblyName System.Drawing

$projectRoot = "c:\Users\USER\Desktop\BCN"
$publicDir = Join-Path $projectRoot "public"
$appDir = Join-Path $projectRoot "app"

$width = 1200
$height = 630

$bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# 1. Background: Dark sleek luxury gradient
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 18, 18, 20),
    [System.Drawing.Color]::FromArgb(255, 8, 8, 10),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
)
$g.FillRectangle($bgBrush, $rect)
$bgBrush.Dispose()

# Ambient glow (Amber on top-left, warm gold on right)
$pathGlow1 = New-Object System.Drawing.Drawing2D.GraphicsPath
$pathGlow1.AddEllipse(-100, -100, 600, 500)
$pbg1 = New-Object System.Drawing.Drawing2D.PathGradientBrush($pathGlow1)
$pbg1.CenterColor = [System.Drawing.Color]::FromArgb(60, 255, 132, 0)
$pbg1.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
$g.FillPath($pbg1, $pathGlow1)
$pbg1.Dispose()
$pathGlow1.Dispose()

$pathGlow2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$pathGlow2.AddEllipse(700, 100, 600, 500)
$pbg2 = New-Object System.Drawing.Drawing2D.PathGradientBrush($pathGlow2)
$pbg2.CenterColor = [System.Drawing.Color]::FromArgb(50, 255, 180, 50)
$pbg2.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
$g.FillPath($pbg2, $pathGlow2)
$pbg2.Dispose()
$pathGlow2.Dispose()

# Subtle grid lines
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(15, 255, 255, 255), 1)
for ($x = 40; $x -lt $width; $x += 40) {
    $g.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 40; $y -lt $height; $y += 40) {
    $g.DrawLine($gridPen, 0, $y, $width, $y)
}
$gridPen.Dispose()

# Outer subtle border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(50, 255, 132, 0), 2)
$g.DrawRectangle($borderPen, 1, 1, $width - 2, $height - 2)
$borderPen.Dispose()

# 2. Draw BCN Logo at top left (Standalone tight gold mark + bold title)
$markPath = Join-Path $projectRoot "public\images\logo\bcn-logo-standalone-tight.png"
if (Test-Path $markPath) {
    $markImg = [System.Drawing.Image]::FromFile($markPath)
    $markSize = 58
    $g.DrawImage($markImg, 60, 42, $markSize, $markSize)
    $markImg.Dispose()
}

$brandFont1 = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
$brandFont2 = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$brandWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 241, 232))
$brandGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 150, 30))

$g.DrawString("BUILDING CREATIVES", $brandFont1, $brandWhite, 128, 44)
$g.DrawString("NETWORK  -  COMMUNITY HANGOUT", $brandFont2, $brandGold, 130, 68)

$brandFont1.Dispose()
$brandFont2.Dispose()
$brandWhite.Dispose()
$brandGold.Dispose()

# 3. Left Column Content: Event Badges & Headings
$fontTag = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$fontTheme = New-Object System.Drawing.Font("Arial", 38, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Regular)
$fontDetail = New-Object System.Drawing.Font("Arial", 15, [System.Drawing.FontStyle]::Bold)
$fontVenue = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Regular)

# Event Tag Badge
$tagRect = New-Object System.Drawing.Rectangle(60, 130, 210, 30)
$tagBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(50, 255, 132, 0))
$g.FillRectangle($tagBg, $tagRect)
$tagBg.Dispose()
$tagBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 255, 132, 0), 1)
$g.DrawRectangle($tagBorder, $tagRect)
$tagBorder.Dispose()

$amberBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 150, 30))
$g.DrawString("BCN HANGOUT 2026", $fontTag, $amberBrush, 72, 137)

# Main Theme Headline: "Creators with a" / "Difference"
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 241, 232))
$g.DrawString("Creators with a", $fontTheme, $whiteBrush, 58, 180)
$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 160, 40))
$g.DrawString("Difference.", $fontTheme, $goldBrush, 58, 230)

# Subtitle
$grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 185, 178, 168))
$g.DrawString("Where African innovators, designers & developers connect.", $fontSub, $grayBrush, 60, 300)

# Feature Badges
$features = @("Practical Skills", "Strategic Networking", "Spiritual Charge")
$fx = 60
$fFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
foreach ($f in $features) {
    $fSize = $g.MeasureString($f, $fFont)
    $fRect = New-Object System.Drawing.Rectangle($fx, 345, [int]($fSize.Width + 24), 28)
    $fBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 255, 255, 255))
    $g.FillRectangle($fBg, $fRect)
    $fBg.Dispose()
    $fPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 255, 255, 255), 1)
    $g.DrawRectangle($fPen, $fRect)
    $fPen.Dispose()
    $fBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 215, 205))
    $g.DrawString($f, $fFont, $fBrush, $fx + 12, 351)
    $fBrush.Dispose()
    $fx += [int]($fSize.Width + 34)
}
$fFont.Dispose()

# Event Date & Venue Card (Glassmorphic box)
$cardRect = New-Object System.Drawing.Rectangle(60, 400, 540, 115)
$cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 20, 20, 24))
$g.FillRectangle($cardBg, $cardRect)
$cardBg.Dispose()
$cardBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 132, 0), 1.5)
$g.DrawRectangle($cardBorder, $cardRect)
$cardBorder.Dispose()

$g.DrawString("DATE: SATURDAY, SEPT 19, 2026   |   TIME: 10:00 AM", $fontDetail, $goldBrush, 80, 420)
$g.DrawString("VENUE: KHMS Hall, LFC Lokongoma, Lokoja", $fontVenue, $whiteBrush, 80, 455)
$feeFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$freeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 80, 210, 120))
$g.DrawString("FREE REGISTRATION  *  LIMITED SEATS AVAILABLE", $feeFont, $freeBrush, 80, 485)
$feeFont.Dispose()
$freeBrush.Dispose()

# 4. Right Column: Featured Speakers Visual Showcase
$hostPath = Join-Path $projectRoot "public\images\speakers\samuel-oboh.png"
if (Test-Path $hostPath) {
    # Draw host card box
    $hostBox = New-Object System.Drawing.Rectangle(650, 70, 240, 445)
    $hBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 22, 22, 26))
    $g.FillRectangle($hBg, $hostBox)
    $hBg.Dispose()
    $hPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 132, 0), 1.5)
    $g.DrawRectangle($hPen, $hostBox)
    $hPen.Dispose()

    # Clip & Draw Host image
    $saveState = $g.Save()
    $clipRegion = New-Object System.Drawing.Region($hostBox)
    $g.Clip = $clipRegion

    $hImg = [System.Drawing.Image]::FromFile($hostPath)
    $g.DrawImage($hImg, 640, 70, 260, 360)
    $hImg.Dispose()

    # Gradient fade at bottom of host photo inside card
    $fadeRect = New-Object System.Drawing.Rectangle(650, 330, 240, 185)
    $fadeBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $fadeRect,
        [System.Drawing.Color]::FromArgb(0, 22, 22, 26),
        [System.Drawing.Color]::FromArgb(255, 22, 22, 26),
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    )
    $g.FillRectangle($fadeBrush, $fadeRect)
    $fadeBrush.Dispose()

    $g.Restore($saveState)
    $clipRegion.Dispose()

    # Host Label
    $hBadgeFont = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
    $hNameFont = New-Object System.Drawing.Font("Arial", 15, [System.Drawing.FontStyle]::Bold)
    $hRoleFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Regular)

    $badgeRect = New-Object System.Drawing.Rectangle(665, 430, 60, 20)
    $bBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 132, 0))
    $g.FillRectangle($bBg, $badgeRect)
    $bBg.Dispose()
    $bTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 10, 10))
    $g.DrawString("HOST", $hBadgeFont, $bTextBrush, 672, 433)
    $bTextBrush.Dispose()

    $g.DrawString("Mr. Samuel Oboh", $hNameFont, $whiteBrush, 665, 456)
    $g.DrawString("Lead Convener, BCN", $hRoleFont, $grayBrush, 665, 480)

    $hBadgeFont.Dispose()
    $hNameFont.Dispose()
    $hRoleFont.Dispose()
}

# Draw 4 speakers on the right side in a vertical stack
$speakersList = @(
    @{ Name = "T-Spice"; File = "t-spice.png" },
    @{ Name = "Mr. Favour Jigah"; File = "favour-jigah.png" },
    @{ Name = "Mr. Gideon Bello"; File = "gideon-bello.png" },
    @{ Name = "Pst. Stephen Yusuf"; File = "stephen-yusuf.png" }
)

$sy = 70
$sCardW = 260
$sCardH = 98
$sFontName = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Bold)
$sFontRole = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Regular)

foreach ($spk in $speakersList) {
    $sBox = New-Object System.Drawing.Rectangle(915, $sy, $sCardW, $sCardH)
    $sBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 22, 22, 26))
    $g.FillRectangle($sBg, $sBox)
    $sBg.Dispose()
    $sPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 255, 255, 255), 1)
    $g.DrawRectangle($sPen, $sBox)
    $sPen.Dispose()

    # Draw circular avatar
    $spkImgPath = Join-Path $projectRoot ("public\images\speakers\" + $spk.File)
    if (Test-Path $spkImgPath) {
        $avatarSize = 74
        $ax = 930
        $ay = $sy + 12

        $avatarPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $avatarPath.AddEllipse($ax, $ay, $avatarSize, $avatarSize)

        $saveA = $g.Save()
        $g.SetClip($avatarPath)
        $spkImg = [System.Drawing.Image]::FromFile($spkImgPath)
        $g.DrawImage($spkImg, $ax, $ay, $avatarSize, [int]($avatarSize * 1.35))
        $spkImg.Dispose()
        $g.Restore($saveA)

        $avBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 255, 132, 0), 2)
        $g.DrawPath($avBorder, $avatarPath)
        $avBorder.Dispose()
        $avatarPath.Dispose()
    }

    # Name and role
    $g.DrawString($spk.Name, $sFontName, $whiteBrush, 1015, $sy + 28)
    $speakerBadgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 160, 40))
    $g.DrawString("Featured Speaker", $sFontRole, $speakerBadgeBrush, 1015, $sy + 52)
    $speakerBadgeBrush.Dispose()

    $sy += 115
}
$sFontName.Dispose()
$sFontRole.Dispose()

# 5. Bottom Brand & Registration Bar
$barRect = New-Object System.Drawing.Rectangle(0, 545, $width, 85)
$barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 10, 12))
$g.FillRectangle($barBrush, $barRect)
$barBrush.Dispose()
$barLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 132, 0), 1)
$g.DrawLine($barLine, 0, 545, $width, 545)
$barLine.Dispose()

$urlFont = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
$ctaFont = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)

$g.DrawString("buildingcreativesnetwork.com", $urlFont, $goldBrush, 60, 577)
$g.DrawString("SECURE YOUR SPOT  -  NETWORKING  -  SKILL CONVERSATIONS  -  IMPACT", $ctaFont, $grayBrush, 490, 580)

# Save high quality JPEG (<300KB for WhatsApp) and PNG
$jpgCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 88L)

$ogJpg = Join-Path $publicDir "og-image.jpg"
$ogPng = Join-Path $publicDir "og-image.png"
$ogAppPng = Join-Path $appDir "opengraph-image.png"
$twAppPng = Join-Path $appDir "twitter-image.png"

$bitmap.Save($ogJpg, $jpgCodec, $encoderParams)
$bitmap.Save($ogPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Save($ogAppPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Save($twAppPng, [System.Drawing.Imaging.ImageFormat]::Png)

$bitmap.Dispose()
$g.Dispose()

$jpgSize = (Get-Item $ogJpg).Length / 1KB
Write-Host ("Created Open Graph Image: {0} ({1:N1} KB)" -f $ogJpg, $jpgSize)
