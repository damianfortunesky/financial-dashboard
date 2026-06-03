CREATE OR ALTER VIEW core.vw_monthly_summary
AS
SELECT
    YEAR(p.purchase_date) AS year_number,
    MONTH(p.purchase_date) AS month_number,
    DATEFROMPARTS(
        YEAR(p.purchase_date),
        MONTH(p.purchase_date),
        1
    ) AS month_date,
    COUNT(DISTINCT p.purchase_id) AS purchase_count,
    SUM(p.total_amount) AS total_expenses,
    AVG(p.total_amount) AS average_purchase_amount
FROM core.purchases p
GROUP BY
    YEAR(p.purchase_date),
    MONTH(p.purchase_date);
GO

CREATE OR ALTER VIEW core.vw_top_products
AS
SELECT
    pr.product_id,
    pr.name AS product_name,

    COUNT(pi.purchase_item_id) AS purchase_count,

    SUM(pi.quantity) AS total_quantity,

    SUM(pi.subtotal) AS total_spent,

    AVG(pi.unit_price) AS average_unit_price
FROM core.purchase_items pi
INNER JOIN core.products pr
    ON pr.product_id = pi.product_id
GROUP BY
    pr.product_id,
    pr.name;
GO

CREATE OR ALTER VIEW core.vw_top_merchants
AS
SELECT
    m.merchant_id,
    m.name AS merchant_name,

    COUNT(p.purchase_id) AS purchase_count,

    SUM(p.total_amount) AS total_spent,

    AVG(p.total_amount) AS average_ticket
FROM core.purchases p
INNER JOIN core.merchants m
    ON m.merchant_id = p.merchant_id
GROUP BY
    m.merchant_id,
    m.name;
GO

CREATE OR ALTER VIEW core.vw_expenses_by_category
AS
SELECT
    c.category_id,
    c.name AS category_name,

    SUM(pi.subtotal) AS total_spent,

    SUM(pi.quantity) AS total_quantity,

    COUNT(pi.purchase_item_id) AS transaction_count
FROM core.purchase_items pi
INNER JOIN core.products pr
    ON pr.product_id = pi.product_id

INNER JOIN core.categories c
    ON c.category_id = pr.category_id

GROUP BY
    c.category_id,
    c.name;
GO

CREATE OR ALTER VIEW core.vw_expenses_by_subcategory
AS
SELECT
    s.subcategory_id,
    s.name AS subcategory_name,

    c.category_id,
    c.name AS category_name,

    SUM(pi.subtotal) AS total_spent,

    SUM(pi.quantity) AS total_quantity,

    COUNT(pi.purchase_item_id) AS transaction_count
FROM core.purchase_items pi

INNER JOIN core.products pr
    ON pr.product_id = pi.product_id

INNER JOIN core.subcategories s
    ON s.subcategory_id = pr.subcategory_id

INNER JOIN core.categories c
    ON c.category_id = s.category_id

GROUP BY
    s.subcategory_id,
    s.name,
    c.category_id,
    c.name;
GO

CREATE OR ALTER VIEW core.vw_product_price_history
AS
SELECT
    pr.product_id,
    pr.name AS product_name,

    YEAR(p.purchase_date) AS year_number,
    MONTH(p.purchase_date) AS month_number,

    AVG(pi.unit_price) AS average_price,

    MIN(pi.unit_price) AS minimum_price,

    MAX(pi.unit_price) AS maximum_price
FROM core.purchase_items pi

INNER JOIN core.products pr
    ON pr.product_id = pi.product_id

INNER JOIN core.purchases p
    ON p.purchase_id = pi.purchase_id

GROUP BY
    pr.product_id,
    pr.name,
    YEAR(p.purchase_date),
    MONTH(p.purchase_date);
GO