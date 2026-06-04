package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.PaymentMethod;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface PaymentMethodMapper {
    @Insert("INSERT INTO core.payment_methods (name, description, is_active) VALUES (#{name}, #{description}, #{active})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "payment_method_id")
    void insert(PaymentMethod paymentMethod);

    @Update("UPDATE core.payment_methods SET name = #{name}, description = #{description}, is_active = #{active}, updated_at = SYSUTCDATETIME() WHERE payment_method_id = #{id}")
    void update(PaymentMethod paymentMethod);

    @Select("SELECT * FROM core.payment_methods WHERE payment_method_id = #{id}")
    @Results(id = "PaymentMethodResult", value = {@Result(column = "payment_method_id", property = "id", id = true),
            @Result(column = "name", property = "name"),
            @Result(column = "description", property = "description"),
            @Result(column = "is_active", property = "active"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<PaymentMethod> findById(Long id);

    @Select("SELECT * FROM core.payment_methods WHERE is_active = 1")
    @ResultMap("PaymentMethodResult")
    List<PaymentMethod> findAll();

    @Delete("DELETE FROM core.payment_methods WHERE payment_method_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.payment_methods SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE payment_method_id = #{id}")
    void softDeleteById(Long id);

    @Select("SELECT CASE WHEN COUNT(1) > 0 THEN 1 ELSE 0 END FROM core.payment_methods WHERE LOWER(name) = LOWER(#{name})")
    boolean existsByName(String name);

}
