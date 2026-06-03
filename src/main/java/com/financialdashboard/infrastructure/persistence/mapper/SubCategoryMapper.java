package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.SubCategory;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface SubCategoryMapper {
    @Insert("INSERT INTO core.subcategories (category_id, name, description, is_active) VALUES (#{categoryId}, #{name}, #{description}, #{active})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "subcategory_id")
    void insert(SubCategory subCategory);

    @Update("UPDATE core.subcategories SET category_id = #{categoryId}, name = #{name}, description = #{description}, is_active = #{active}, updated_at = SYSUTCDATETIME() WHERE subcategory_id = #{id}")
    void update(SubCategory subCategory);

    @Select("SELECT * FROM core.subcategories WHERE subcategory_id = #{id}")
    @Results(id = "SubCategoryResult", value = {@Result(column = "subcategory_id", property = "id", id = true),
            @Result(column = "category_id", property = "categoryId"),
            @Result(column = "name", property = "name"),
            @Result(column = "description", property = "description"),
            @Result(column = "is_active", property = "active"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<SubCategory> findById(Long id);

    @Select("SELECT * FROM core.subcategories WHERE is_active = 1")
    @ResultMap("SubCategoryResult")
    List<SubCategory> findAll();

    @Delete("DELETE FROM core.subcategories WHERE subcategory_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.subcategories SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE subcategory_id = #{id}")
    void softDeleteById(Long id);

    @Select("SELECT CASE WHEN COUNT(1) > 0 THEN 1 ELSE 0 END FROM core.subcategories WHERE LOWER(name) = LOWER(#{name}) AND category_id = #{categoryId}")
    boolean existsByNameAndCategoryId(String name, Long categoryId);

    @Select("SELECT * FROM core.subcategories WHERE category_id = #{categoryId} AND is_active = 1")
    @ResultMap("SubCategoryResult")
    List<SubCategory> findByCategoryId(Long categoryId);

}
