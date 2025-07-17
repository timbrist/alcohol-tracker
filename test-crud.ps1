Write-Host "========================================" -ForegroundColor Green
Write-Host "Testing CRUD Operations" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Get authentication token
$authResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username": "admin", "password": "admin123"}'
$token = $authResponse.access_token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n1. Testing Product Creation..." -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Yellow
try {
    $newProduct = @{
        name = "Jack Daniels Whiskey"
        categoryId = 1
        totalCl = 750
        remainingCl = 750
        pricePerCl = 0.15
        location = "Main Bar Shelf"
    }
    
    $product = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers $headers -Body ($newProduct | ConvertTo-Json)
    Write-Host "Product created successfully! ID: $($product.id), Name: $($product.name)" -ForegroundColor Green
    $productId = $product.id
} catch {
    Write-Host "Product creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

Write-Host "`n2. Testing Product Update..." -ForegroundColor Yellow
Write-Host "---------------------------" -ForegroundColor Yellow
try {
    $updateData = @{
        remainingCl = 650
        note = "Consumed 100cl"
    }
    
    $updatedProduct = Invoke-RestMethod -Uri "http://localhost:3000/api/products/$productId" -Method PATCH -Headers $headers -Body ($updateData | ConvertTo-Json)
    Write-Host "Product updated successfully! Remaining: $($updatedProduct.remainingCl)cl" -ForegroundColor Green
} catch {
    Write-Host "Product update failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing CL Updates History..." -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow
try {
    $clUpdates = Invoke-RestMethod -Uri "http://localhost:3000/api/cl-updates/product/$productId" -Method GET -Headers $headers
    Write-Host "CL Updates retrieved successfully! Count: $($clUpdates.Count)" -ForegroundColor Green
    if ($clUpdates.Count -gt 0) {
        $clUpdates | ForEach-Object { 
            Write-Host "  - Old: $($_.oldCl)cl, New: $($_.newCl)cl, Difference: $($_.newCl - $_.oldCl)cl" -ForegroundColor White 
        }
    }
} catch {
    Write-Host "CL Updates retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing Low Stock Products..." -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow
try {
    $lowStock = Invoke-RestMethod -Uri "http://localhost:3000/api/products/low-stock?threshold=700" -Method GET -Headers $headers
    Write-Host "Low stock products retrieved successfully! Count: $($lowStock.Count)" -ForegroundColor Green
    $lowStock | ForEach-Object { 
        Write-Host "  - $($_.name): $($_.remainingCl)cl remaining" -ForegroundColor White 
    }
} catch {
    Write-Host "Low stock retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Testing Product Deletion..." -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/products/$productId" -Method DELETE -Headers $headers
    Write-Host "Product deleted successfully!" -ForegroundColor Green
} catch {
    Write-Host "Product deletion failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "CRUD tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green 