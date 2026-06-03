CREATE INDEX ix_subcategories_category_id ON core.subcategories(category_id);
CREATE INDEX ix_incomes_income_date ON core.incomes(income_date);
CREATE INDEX ix_expenses_expense_date ON core.expenses(expense_date);
CREATE INDEX ix_expenses_category_id ON core.expenses(category_id);
CREATE INDEX ix_expenses_merchant_id ON core.expenses(merchant_id);
CREATE INDEX ix_expenses_payment_method_id ON core.expenses(payment_method_id);
CREATE INDEX ix_products_category_id ON core.products(category_id);
CREATE INDEX ix_products_subcategory_id ON core.products(subcategory_id);
CREATE INDEX ix_purchases_purchase_date ON core.purchases(purchase_date);
CREATE INDEX ix_purchases_merchant_id ON core.purchases(merchant_id);
CREATE INDEX ix_purchases_payment_method_id ON core.purchases(payment_method_id);
CREATE INDEX ix_purchase_items_purchase_id ON core.purchase_items(purchase_id);
CREATE INDEX ix_purchase_items_product_id ON core.purchase_items(product_id);
CREATE INDEX ix_purchase_items_created_at ON core.purchase_items(created_at);
GO
