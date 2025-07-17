@echo off
echo ========================================
echo Testing Alcohol Tracker API
echo ========================================

echo.
echo 1. Testing Authentication...
echo ----------------------------
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"admin123\"}" > auth_response.json
echo Authentication test completed.

echo.
echo 2. Testing Categories (with auth)...
echo ------------------------------------
for /f "tokens=*" %%i in ('type auth_response.json ^| findstr "access_token"') do set TOKEN=%%i
set TOKEN=%TOKEN:"access_token":"=%
set TOKEN=%TOKEN:",=%
curl -X GET http://localhost:3000/api/categories -H "Authorization: Bearer %TOKEN%" > categories_response.json
echo Categories test completed.

echo.
echo 3. Testing Products (with auth)...
echo ----------------------------------
curl -X GET http://localhost:3000/api/products -H "Authorization: Bearer %TOKEN%" > products_response.json
echo Products test completed.

echo.
echo 4. Testing CL Updates (with auth)...
echo ------------------------------------
curl -X GET http://localhost:3000/api/cl-updates -H "Authorization: Bearer %TOKEN%" > clupdates_response.json
echo CL Updates test completed.

echo.
echo 5. Testing Users (admin only)...
echo --------------------------------
curl -X GET http://localhost:3000/api/users -H "Authorization: Bearer %TOKEN%" > users_response.json
echo Users test completed.

echo.
echo ========================================
echo All tests completed. Check response files.
echo ======================================== 