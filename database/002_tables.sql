IF OBJECT_ID('core.categories','U') IS NULL
CREATE TABLE core.categories (
  category_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_categories PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  description NVARCHAR(255) NULL,
  is_active BIT NOT NULL CONSTRAINT df_categories_active DEFAULT 1,
  created_at DATETIME2 NOT NULL CONSTRAINT df_categories_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL,
  CONSTRAINT uq_categories_name UNIQUE (name)
);
GO
IF OBJECT_ID('core.subcategories','U') IS NULL
CREATE TABLE core.subcategories (
  subcategory_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_subcategories PRIMARY KEY,
  category_id BIGINT NOT NULL,
  name NVARCHAR(100) NOT NULL,
  description NVARCHAR(255) NULL,
  is_active BIT NOT NULL CONSTRAINT df_subcategories_active DEFAULT 1,
  created_at DATETIME2 NOT NULL CONSTRAINT df_subcategories_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL,
  CONSTRAINT fk_subcategories_categories FOREIGN KEY (category_id) REFERENCES core.categories(category_id),
  CONSTRAINT uq_subcategories_category_name UNIQUE (category_id, name)
);
GO
IF OBJECT_ID('core.payment_methods','U') IS NULL
CREATE TABLE core.payment_methods (
  payment_method_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_payment_methods PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  description NVARCHAR(255) NULL,
  is_active BIT NOT NULL CONSTRAINT df_payment_methods_active DEFAULT 1,
  created_at DATETIME2 NOT NULL CONSTRAINT df_payment_methods_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL,
  CONSTRAINT uq_payment_methods_name UNIQUE (name)
);
GO
IF OBJECT_ID('core.merchants','U') IS NULL
CREATE TABLE core.merchants (
  merchant_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_merchants PRIMARY KEY,
  name NVARCHAR(150) NOT NULL,
  description NVARCHAR(255) NULL,
  is_active BIT NOT NULL CONSTRAINT df_merchants_active DEFAULT 1,
  created_at DATETIME2 NOT NULL CONSTRAINT df_merchants_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL,
  CONSTRAINT uq_merchants_name UNIQUE (name)
);
GO
IF OBJECT_ID('core.incomes','U') IS NULL
CREATE TABLE core.incomes (
  income_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_incomes PRIMARY KEY,
  income_date DATE NOT NULL,
  amount DECIMAL(18,2) NOT NULL CONSTRAINT ck_incomes_amount_positive CHECK (amount > 0),
  description NVARCHAR(255) NULL,
  created_at DATETIME2 NOT NULL CONSTRAINT df_incomes_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL
);
GO
IF OBJECT_ID('core.expenses','U') IS NULL
CREATE TABLE core.expenses (
  expense_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_expenses PRIMARY KEY,
  expense_date DATE NOT NULL,
  amount DECIMAL(18,2) NOT NULL CONSTRAINT ck_expenses_amount_positive CHECK (amount > 0),
  category_id BIGINT NOT NULL,
  subcategory_id BIGINT NULL,
  payment_method_id BIGINT NOT NULL,
  merchant_id BIGINT NULL,
  is_necessary BIT NOT NULL,
  description NVARCHAR(255) NULL,
  created_at DATETIME2 NOT NULL CONSTRAINT df_expenses_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL,
  CONSTRAINT fk_expenses_categories FOREIGN KEY (category_id) REFERENCES core.categories(category_id),
  CONSTRAINT fk_expenses_subcategories FOREIGN KEY (subcategory_id) REFERENCES core.subcategories(subcategory_id),
  CONSTRAINT fk_expenses_payment_methods FOREIGN KEY (payment_method_id) REFERENCES core.payment_methods(payment_method_id),
  CONSTRAINT fk_expenses_merchants FOREIGN KEY (merchant_id) REFERENCES core.merchants(merchant_id)
);
GO
IF OBJECT_ID('core.products','U') IS NULL
CREATE TABLE core.products (
  product_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_products PRIMARY KEY,
  name NVARCHAR(150) NOT NULL,
  description NVARCHAR(255) NULL,
  unit_of_measure VARCHAR(20) NOT NULL,
  category_id BIGINT NOT NULL,
  subcategory_id BIGINT NULL,
  is_active BIT NOT NULL CONSTRAINT df_products_active DEFAULT 1,
  created_at DATETIME2 NOT NULL CONSTRAINT df_products_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL,
  CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES core.categories(category_id),
  CONSTRAINT fk_products_subcategories FOREIGN KEY (subcategory_id) REFERENCES core.subcategories(subcategory_id),
  CONSTRAINT uq_products_name UNIQUE (name)
);
GO
IF OBJECT_ID('core.purchases','U') IS NULL
CREATE TABLE core.purchases (
  purchase_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_purchases PRIMARY KEY,
  purchase_date DATE NOT NULL,
  merchant_id BIGINT NOT NULL,
  payment_method_id BIGINT NOT NULL,
  total_amount DECIMAL(18,2) NOT NULL CONSTRAINT ck_purchases_total_positive CHECK (total_amount > 0),
  notes NVARCHAR(255) NULL,
  created_at DATETIME2 NOT NULL CONSTRAINT df_purchases_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL,
  CONSTRAINT fk_purchases_merchants FOREIGN KEY (merchant_id) REFERENCES core.merchants(merchant_id),
  CONSTRAINT fk_purchases_payment_methods FOREIGN KEY (payment_method_id) REFERENCES core.payment_methods(payment_method_id)
);
GO
IF OBJECT_ID('core.purchase_items','U') IS NULL
CREATE TABLE core.purchase_items (
  purchase_item_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT pk_purchase_items PRIMARY KEY,
  purchase_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity DECIMAL(18,3) NOT NULL CONSTRAINT ck_purchase_items_quantity_positive CHECK (quantity > 0),
  unit_price DECIMAL(18,2) NOT NULL CONSTRAINT ck_purchase_items_unit_price_positive CHECK (unit_price > 0),
  subtotal DECIMAL(18,2) NOT NULL,
  notes NVARCHAR(255) NULL,
  created_at DATETIME2 NOT NULL CONSTRAINT df_purchase_items_created DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NULL,
  CONSTRAINT ck_purchase_items_subtotal CHECK (subtotal > 0),
  CONSTRAINT fk_purchase_items_purchases FOREIGN KEY (purchase_id) REFERENCES core.purchases(purchase_id),
  CONSTRAINT fk_purchase_items_products FOREIGN KEY (product_id) REFERENCES core.products(product_id)
);
GO
