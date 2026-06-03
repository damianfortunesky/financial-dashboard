package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.Merchant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface MerchantMapper {
    @Insert("INSERT INTO core.merchants (name, description, is_active) VALUES (#{name}, #{description}, #{active})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "merchant_id")
    void insert(Merchant merchant);

    @Update("UPDATE core.merchants SET name = #{name}, description = #{description}, is_active = #{active}, updated_at = SYSUTCDATETIME() WHERE merchant_id = #{id}")
    void update(Merchant merchant);

    @Select("SELECT * FROM core.merchants WHERE merchant_id = #{id}")
    @Results(id = "MerchantResult", value = {@Result(column = "merchant_id", property = "id", id = true),
            @Result(column = "name", property = "name"),
            @Result(column = "description", property = "description"),
            @Result(column = "is_active", property = "active"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<Merchant> findById(Long id);

    @Select("SELECT * FROM core.merchants WHERE is_active = 1")
    @ResultMap("MerchantResult")
    List<Merchant> findAll();

    @Delete("DELETE FROM core.merchants WHERE merchant_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.merchants SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE merchant_id = #{id}")
    void softDeleteById(Long id);

    @Select("SELECT CASE WHEN COUNT(1) > 0 THEN 1 ELSE 0 END FROM core.merchants WHERE LOWER(name) = LOWER(#{name})")
    boolean existsByName(String name);

}
