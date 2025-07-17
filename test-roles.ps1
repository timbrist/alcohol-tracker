Write-Host "========================================" -ForegroundColor Green
Write-Host "Testing Role-Based Access Control" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Test admin access
Write-Host "`n1. Testing Admin Access..." -ForegroundColor Yellow
Write-Host "---------------------------" -ForegroundColor Yellow
try {
    $authResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username": "admin", "password": "admin123"}'
    $adminToken = $authResponse.access_token
    $adminHeaders = @{
        "Authorization" = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }
    
    # Test admin can access users endpoint
    $users = Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET -Headers $adminHeaders
    Write-Host "Admin can access users endpoint: SUCCESS" -ForegroundColor Green
    
    # Test admin can create products
    $newProduct = @{
        name = "Test Product"
        totalCl = 100
        remainingCl = 100
    }
    $product = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers $adminHeaders -Body ($newProduct | ConvertTo-Json)
    Write-Host "Admin can create products: SUCCESS" -ForegroundColor Green
    $testProductId = $product.id
    
} catch {
    Write-Host "Admin access test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing Unauthorized Access..." -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Yellow
try {
    # Test accessing protected endpoint without token
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method GET -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 401) {
        Write-Host "Unauthorized access properly blocked: SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "Unauthorized access not properly blocked: FAILED" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "Unauthorized access properly blocked: SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Invalid Token..." -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Yellow
try {
    $invalidHeaders = @{
        "Authorization" = "Bearer invalid_token_here"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method GET -Headers $invalidHeaders -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 401) {
        Write-Host "Invalid token properly rejected: SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "Invalid token not properly rejected: FAILED" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "Invalid token properly rejected: SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Clean up test product
if ($testProductId) {
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/api/products/$testProductId" -Method DELETE -Headers $adminHeaders
        Write-Host "`nTest product cleaned up successfully" -ForegroundColor Green
    } catch {
        Write-Host "`nFailed to clean up test product: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Role-based access control tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green 