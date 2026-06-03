package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.Purchase;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface PurchaseMapper {
    @Insert("INSERT INTO core.purchases (purchase_date, merchant_id, payment_method_id, total_amount, notes) VALUES (#{purchaseDate}, #{merchantId}, #{paymentMethodId}, #{totalAmount}, #{notes})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "purchase_id")
    void insert(Purchase purchase);

    @Update("UPDATE core.purchases SET purchase_date = #{purchaseDate}, merchant_id = #{merchantId}, payment_method_id = #{paymentMethodId}, total_amount = #{totalAmount}, notes = #{notes}, updated_at = SYSUTCDATETIME() WHERE purchase_id = #{id}")
    void update(Purchase purchase);

    @Select("SELECT * FROM core.purchases WHERE purchase_id = #{id}")
    @Results(id = "PurchaseResult", value = {@Result(column = "purchase_id", property = "id", id = true),
            @Result(column = "purchase_date", property = "purchaseDate"),
            @Result(column = "merchant_id", property = "merchantId"),
            @Result(column = "payment_method_id", property = "paymentMethodId"),
            @Result(column = "total_amount", property = "totalAmount"),
            @Result(column = "notes", property = "notes"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<Purchase> findById(Long id);

    @Select("SELECT * FROM core.purchases")
    @ResultMap("PurchaseResult")
    List<Purchase> findAll();

    @Delete("DELETE FROM core.purchases WHERE purchase_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.purchases SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE purchase_id = #{id}")
    void softDeleteById(Long id);

    @Select("SELECT * FROM core.purchases WHERE (purchase_date >= #{dateFrom} OR #{dateFrom} IS NULL) AND (purchase_date <= #{dateTo} OR #{dateTo} IS NULL)")
    @ResultMap("PurchaseResult")
    List<Purchase> findAllFiltered(LocalDate dateFrom, LocalDate dateTo);

}
