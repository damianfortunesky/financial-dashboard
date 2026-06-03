package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.application.dto.dashboard.*;
import java.math.BigDecimal;
import java.util.List;
import org.apache.ibatis.annotations.*;

@Mapper
public interface DashboardMapper {
    @Select("SELECT COALESCE(SUM(amount),0) FROM core.incomes WHERE income_date >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) AND income_date < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))")
    BigDecimal monthlyIncome();

    @Select("SELECT COALESCE(SUM(amount),0) FROM core.expenses WHERE expense_date >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) AND expense_date < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))")
    BigDecimal monthlyExpense();

    @Select("SELECT c.name AS category, SUM(e.amount) AS amount, CASE WHEN SUM(SUM(e.amount)) OVER() = 0 THEN 0 ELSE (SUM(e.amount) * 100.0 / SUM(SUM(e.amount)) OVER()) END AS percentage FROM core.expenses e JOIN core.categories c ON c.category_id = e.category_id GROUP BY c.name ORDER BY amount DESC")
    List<CategoryExpenseResponse> expensesByCategory();

    @Select("SELECT COALESCE(SUM(CASE WHEN is_necessary = 1 THEN amount ELSE 0 END),0) AS necessary, COALESCE(SUM(CASE WHEN is_necessary = 0 THEN amount ELSE 0 END),0) AS notNecessary FROM core.expenses")
    NecessityDistributionResponse necessityDistribution();

    @Select("WITH i AS (SELECT YEAR(income_date) y, MONTH(income_date) m, SUM(amount) income FROM core.incomes GROUP BY YEAR(income_date), MONTH(income_date)), e AS (SELECT YEAR(expense_date) y, MONTH(expense_date) m, SUM(amount) expense FROM core.expenses GROUP BY YEAR(expense_date), MONTH(expense_date)) SELECT COALESCE(i.y,e.y) AS year, COALESCE(i.m,e.m) AS month, COALESCE(i.income,0) AS income, COALESCE(e.expense,0) AS expense, COALESCE(i.income,0)-COALESCE(e.expense,0) AS balance FROM i FULL OUTER JOIN e ON i.y=e.y AND i.m=e.m ORDER BY year DESC, month DESC")
    List<MonthlyBalanceResponse> monthlyBalance();

    @Select("SELECT TOP 10 COALESCE(m.name, 'Sin comercio') AS merchant, SUM(e.amount) AS amount FROM core.expenses e LEFT JOIN core.merchants m ON m.merchant_id=e.merchant_id GROUP BY m.name ORDER BY amount DESC")
    List<TopMerchantResponse> topMerchants();

    @Select("SELECT TOP 10 c.name AS category, SUM(e.amount) AS amount, 0 AS percentage FROM core.expenses e JOIN core.categories c ON c.category_id=e.category_id GROUP BY c.name ORDER BY amount DESC")
    List<CategoryExpenseResponse> topCategories();

    @Select("SELECT TOP 10 p.name AS product, SUM(pi.quantity) AS quantity, SUM(pi.subtotal) AS amount FROM core.purchase_items pi JOIN core.products p ON p.product_id=pi.product_id GROUP BY p.name ORDER BY amount DESC")
    List<TopProductResponse> topProducts();
}
