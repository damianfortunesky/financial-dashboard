package com.financialdashboard.infrastructure.persistence.mapper;

import com.financialdashboard.domain.model.PurchaseItem;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.*;

@Mapper
public interface PurchaseItemMapper {
    @Insert("INSERT INTO core.purchase_items (purchase_id, product_id, quantity, unit_price, subtotal, notes) VALUES (#{purchaseId}, #{productId}, #{quantity}, #{unitPrice}, #{subtotal}, #{notes})")
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "purchase_item_id")
    void insert(PurchaseItem purchaseItem);

    @Update("UPDATE core.purchase_items SET purchase_id = #{purchaseId}, product_id = #{productId}, quantity = #{quantity}, unit_price = #{unitPrice}, subtotal = #{subtotal}, notes = #{notes}, updated_at = SYSUTCDATETIME() WHERE purchase_item_id = #{id}")
    void update(PurchaseItem purchaseItem);

    @Select("SELECT * FROM core.purchase_items WHERE purchase_item_id = #{id}")
    @Results(id = "PurchaseItemResult", value = {@Result(column = "purchase_item_id", property = "id", id = true),
            @Result(column = "purchase_id", property = "purchaseId"),
            @Result(column = "product_id", property = "productId"),
            @Result(column = "quantity", property = "quantity"),
            @Result(column = "unit_price", property = "unitPrice"),
            @Result(column = "subtotal", property = "subtotal"),
            @Result(column = "notes", property = "notes"),
            @Result(column = "created_at", property = "createdAt"),
            @Result(column = "updated_at", property = "updatedAt")})
    Optional<PurchaseItem> findById(Long id);

    @Select("SELECT * FROM core.purchase_items")
    @ResultMap("PurchaseItemResult")
    List<PurchaseItem> findAll();

    @Delete("DELETE FROM core.purchase_items WHERE purchase_item_id = #{id}")
    void deleteById(Long id);

    @Update("UPDATE core.purchase_items SET is_active = 0, updated_at = SYSUTCDATETIME() WHERE purchase_item_id = #{id}")
    void softDeleteById(Long id);

    @Select("SELECT * FROM core.purchase_items WHERE purchase_id = #{purchaseId}")
    @ResultMap("PurchaseItemResult")
    List<PurchaseItem> findByPurchaseId(Long purchaseId);

}
