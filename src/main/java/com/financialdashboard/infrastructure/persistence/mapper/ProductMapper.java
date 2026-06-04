package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.Product;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface ProductMapper {
    @Insert("INSERT INTO core.products (name, description, unit_of_measure, category_id, subcategory_id, is_active) VALUES (#{name}, #{description}, #{unitOfMeasure}, #{categoryId}, #{subcategoryId}, #{active})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "product_id")
    void insert(Product product);

    @Update("UPDATE core.products SET name = #{name}, description = #{description}, unit_of_measure = #{unitOfMeasure}, category_id = #{categoryId}, subcategory_id = #{subcategoryId}, is_active = #{active}, updated_at = SYSUTCDATETIME() WHERE product_id = #{id}")
    void update(Product product);

    @Select("SELECT * FROM core.products WHERE product_id = #{id}")
    @Results(id = "ProductResult", value = {@Result(column = "product_id", property = "id", id = true),
            @Result(column = "name", property = "name"),
            @Result(column = "description", property = "description"),
            @Result(column = "unit_of_measure", property = "unitOfMeasure"),
            @Result(column = "category_id", property = "categoryId"),
            @Result(column = "subcategory_id", property = "subcategoryId"),
            @Result(column = "is_active", property = "active"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<Product> findById(Long id);

    @Select({
            "<script>",
            "SELECT * FROM core.products",
            "<where>",
            "  <if test='active != null'>",
            "    is_active = #{active}",
            "  </if>",
            "</where>",
            "ORDER BY product_id",
            "</script>"
    })
    @ResultMap("ProductResult")
    List<Product> findAll(@Param("active") Boolean active);

    @Delete("DELETE FROM core.products WHERE product_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.products SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE product_id = #{id}")
    void softDeleteById(Long id);

    @Select("SELECT CASE WHEN COUNT(1) > 0 THEN 1 ELSE 0 END FROM core.products WHERE LOWER(name) = LOWER(#{name})")
    boolean existsByName(String name);

}
