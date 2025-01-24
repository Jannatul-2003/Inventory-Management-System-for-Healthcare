# PowerShell script to create project structure

# Define directories
$directories = @(
    "app/config",
    "app/models",
    "app/repositories",
    "app/services",
    "app/api/v1/endpoints",
    "app/schemas",
    "app/utils",
    "tests/test_repositories",
    "tests/test_services",
    "tests/test_api",
    "alembic/versions"
)

# Create directories
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir
}

# Define files
$files = @(
    "app/__init__.py",
    "app/main.py",
    "app/config/__init__.py",
    "app/config/database.py",
    "app/models/__init__.py",
    "app/models/order.py",
    "app/models/product.py",
    "app/models/customer.py",
    "app/models/supplier.py",
    "app/models/inventory.py",
    "app/models/shipment.py",
    "app/models/payment.py",
    "app/repositories/__init__.py",
    "app/repositories/dashboard_repo.py",
    "app/repositories/product_repo.py",
    "app/repositories/order_repo.py",
    "app/repositories/supplier_repo.py",
    "app/repositories/shipment_repo.py",
    "app/repositories/customer_repo.py",
    "app/repositories/inventory_repo.py",
    "app/repositories/analytics_repo.py",
    "app/repositories/payment_repo.py",
    "app/services/__init__.py",
    "app/services/dashboard_service.py",
    "app/services/product_service.py",
    "app/services/order_service.py",
    "app/services/supplier_service.py",
    "app/services/shipment_service.py",
    "app/services/customer_service.py",
    "app/services/inventory_service.py",
    "app/services/analytics_service.py",
    "app/services/payment_service.py",
    "app/api/__init__.py",
    "app/api/v1/__init__.py",
    "app/api/v1/endpoints/__init__.py",
    "app/api/v1/endpoints/dashboard.py",
    "app/api/v1/endpoints/products.py",
    "app/api/v1/endpoints/orders.py",
    "app/api/v1/endpoints/suppliers.py",
    "app/api/v1/endpoints/shipments.py",
    "app/api/v1/endpoints/customers.py",
    "app/api/v1/endpoints/inventory.py",
    "app/api/v1/endpoints/analytics.py",
    "app/api/v1/endpoints/payments.py",
    "app/api/v1/router.py",
    "app/schemas/__init__.py",
    "app/schemas/dashboard.py",
    "app/schemas/product.py",
    "app/schemas/order.py",
    "app/schemas/supplier.py",
    "app/schemas/shipment.py",
    "app/schemas/customer.py",
    "app/schemas/inventory.py",
    "app/schemas/analytics.py",
    "app/schemas/payment.py",
    "app/utils/__init__.py",
    "app/utils/database_utils.py",
    "tests/__init__.py",
    "requirements.txt",
    ".env",
    ".gitignore",
    "README.md",
    "alembic.ini"
)

# Create files
foreach ($file in $files) {
    New-Item -ItemType File -Force -Path $file
}

# Add content to .gitignore
@"
__pycache__/
*.pyc
.env
venv/
.idea/
.vscode/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host "Project structure created successfully!"
