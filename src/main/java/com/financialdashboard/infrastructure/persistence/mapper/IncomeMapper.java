package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.Income;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface IncomeMapper {
    @Insert("INSERT INTO core.incomes (income_date, amount, description) VALUES (#{incomeDate}, #{amount}, #{description})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "income_id")
    void insert(Income income);

    @Update("UPDATE core.incomes SET income_date = #{incomeDate}, amount = #{amount}, description = #{description}, updated_at = SYSUTCDATETIME() WHERE income_id = #{id}")
    void update(Income income);

    @Select("SELECT * FROM core.incomes WHERE income_id = #{id}")
    @Results(id = "IncomeResult", value = {@Result(column = "income_id", property = "id", id = true),
            @Result(column = "income_date", property = "incomeDate"),
            @Result(column = "amount", property = "amount"),
            @Result(column = "description", property = "description"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<Income> findById(Long id);

    @Select("SELECT * FROM core.incomes")
    @ResultMap("IncomeResult")
    List<Income> findAll();

    @Delete("DELETE FROM core.incomes WHERE income_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.incomes SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE income_id = #{id}")
    void softDeleteById(Long id);

    @Select({"<script>",
            "SELECT * FROM core.incomes",
            "<where>",
            "<if test='dateFrom != null'>AND income_date &gt;= #{dateFrom}</if>",
            "<if test='dateTo != null'>AND income_date &lt;= #{dateTo}</if>",
            "</where>",
            "</script>"})
    @ResultMap("IncomeResult")
    List<Income> findAllFiltered(@Param("dateFrom") LocalDate dateFrom, @Param("dateTo") LocalDate dateTo);

}
