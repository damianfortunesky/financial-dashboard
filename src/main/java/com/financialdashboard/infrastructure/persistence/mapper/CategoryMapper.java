package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.Category;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface CategoryMapper {
    @Insert("INSERT INTO core.categories (name, description, is_active) VALUES (#{name}, #{description}, #{active})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "category_id")
    void insert(Category category);

    @Update("UPDATE core.categories SET name = #{name}, description = #{description}, is_active = #{active}, updated_at = SYSUTCDATETIME() WHERE category_id = #{id}")
    void update(Category category);

    @Select("SELECT * FROM core.categories WHERE category_id = #{id}")
    @Results(id = "CategoryResult", value = {@Result(column = "category_id", property = "id", id = true),
            @Result(column = "name", property = "name"),
            @Result(column = "description", property = "description"),
            @Result(column = "is_active", property = "active"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<Category> findById(Long id);

    @Select("SELECT * FROM core.categories WHERE is_active = 1")
    @ResultMap("CategoryResult")
    List<Category> findAll();

    @Delete("DELETE FROM core.categories WHERE category_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.categories SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE category_id = #{id}")
    void softDeleteById(Long id);

    @Select("SELECT CASE WHEN COUNT(1) > 0 THEN 1 ELSE 0 END FROM core.categories WHERE LOWER(name) = LOWER(#{name})")
    boolean existsByName(String name);

}
