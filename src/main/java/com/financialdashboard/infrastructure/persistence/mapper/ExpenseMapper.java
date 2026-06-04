package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.Expense;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface ExpenseMapper {
    @Insert("INSERT INTO core.expenses (expense_date, amount, category_id, subcategory_id, payment_method_id, merchant_id, is_necessary, description) VALUES (#{expenseDate}, #{amount}, #{categoryId}, #{subcategoryId}, #{paymentMethodId}, #{merchantId}, #{necessary}, #{description})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "expense_id")
    void insert(Expense expense);

    @Update("UPDATE core.expenses SET expense_date = #{expenseDate}, amount = #{amount}, category_id = #{categoryId}, subcategory_id = #{subcategoryId}, payment_method_id = #{paymentMethodId}, merchant_id = #{merchantId}, is_necessary = #{necessary}, description = #{description}, updated_at = SYSUTCDATETIME() WHERE expense_id = #{id}")
    void update(Expense expense);

    @Select("SELECT * FROM core.expenses WHERE expense_id = #{id}")
    @Results(id = "ExpenseResult", value = {@Result(column = "expense_id", property = "id", id = true),
            @Result(column = "expense_date", property = "expenseDate"),
            @Result(column = "amount", property = "amount"),
            @Result(column = "category_id", property = "categoryId"),
            @Result(column = "subcategory_id", property = "subcategoryId"),
            @Result(column = "payment_method_id", property = "paymentMethodId"),
            @Result(column = "merchant_id", property = "merchantId"),
            @Result(column = "is_necessary", property = "necessary"),
            @Result(column = "description", property = "description"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<Expense> findById(Long id);

    @Select("SELECT * FROM core.expenses")
    @ResultMap("ExpenseResult")
    List<Expense> findAll();

    @Delete("DELETE FROM core.expenses WHERE expense_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.expenses SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE expense_id = #{id}")
    void softDeleteById(Long id);

    @Select({"<script>",
            "SELECT * FROM core.expenses",
            "<where>",
            "<if test='dateFrom != null'>AND expense_date &gt;= #{dateFrom}</if>",
            "<if test='dateTo != null'>AND expense_date &lt;= #{dateTo}</if>",
            "<if test='categoryId != null'>AND category_id = #{categoryId}</if>",
            "<if test='subcategoryId != null'>AND subcategory_id = #{subcategoryId}</if>",
            "<if test='paymentMethodId != null'>AND payment_method_id = #{paymentMethodId}</if>",
            "<if test='merchantId != null'>AND merchant_id = #{merchantId}</if>",
            "<if test='necessary != null'>AND is_necessary = #{necessary}</if>",
            "</where>",
            "</script>"})
    @ResultMap("ExpenseResult")
    List<Expense> findAllFiltered(@Param("dateFrom") LocalDate dateFrom,
                                  @Param("dateTo") LocalDate dateTo,
                                  @Param("categoryId") Long categoryId,
                                  @Param("subcategoryId") Long subcategoryId,
                                  @Param("paymentMethodId") Long paymentMethodId,
                                  @Param("merchantId") Long merchantId,
                                  @Param("necessary") Boolean necessary);

}
