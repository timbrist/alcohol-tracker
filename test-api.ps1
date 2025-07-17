Write-Host "========================================" -ForegroundColor Green
Write-Host "Testing Alcohol Tracker API" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n1. Testing Authentication..." -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Yellow

$authResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username": "admin", "password": "admin123"}'
Write-Host "Authentication successful!" -ForegroundColor Green
Write-Host "User: $($authResponse.user.username), Role: $($authResponse.user.role)" -ForegroundColor Cyan

$token = $authResponse.access_token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n2. Testing Categories..." -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method GET -Headers $headers
    Write-Host "Categories retrieved successfully! Count: $($categories.Count)" -ForegroundColor Green
    $categories | ForEach-Object { Write-Host "  - $($_.name)" -ForegroundColor White }
} catch {
    Write-Host "Categories test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing Products..." -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET -Headers $headers
    Write-Host "Products retrieved successfully! Count: $($products.Count)" -ForegroundColor Green
} catch {
    Write-Host "Products test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing CL Updates..." -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow
try {
    $clUpdates = Invoke-RestMethod -Uri "http://localhost:3000/api/cl-updates" -Method GET -Headers $headers
    Write-Host "CL Updates retrieved successfully! Count: $($clUpdates.Count)" -ForegroundColor Green
} catch {
    Write-Host "CL Updates test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Testing Users (admin only)..." -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET -Headers $headers
    Write-Host "Users retrieved successfully! Count: $($users.Count)" -ForegroundColor Green
    $users | ForEach-Object { Write-Host "  - $($_.username) ($($_.role))" -ForegroundColor White }
} catch {
    Write-Host "Users test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green 