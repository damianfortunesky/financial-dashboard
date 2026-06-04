import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { queryKeys } from "../../api/queryKeys";
import { categoriesApi, productsApi, subcategoriesApi } from "../../api/resourcesApi";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { EmptyState, ErrorState, FieldError } from "../../components/Feedback";
import type { ProductResponse } from "../../types/api";
import { getErrorMessage } from "../../utils/errors";
import { normalizeUnitOfMeasure } from "../../utils/formParsers";
import styles from "./Crud.module.scss";

const schema = z.object({
  name: z.string().trim().min(1).max(150),
  description: z.string().max(100).optional(),
  unitOfMeasure: z.preprocess(normalizeUnitOfMeasure, z.string().min(1).max(50)),
  categoryId: z.coerce.number().min(1),
  subcategoryId: z.coerce.number().min(1),
  active: z.boolean().optional()
});
type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;
const defaults: FormInput = { name: "", description: "", unitOfMeasure: "UNIDAD", categoryId: 0, subcategoryId: 0, active: true };

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProductResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const previousCategoryId = useRef<number | undefined>(undefined);
  const form = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema), defaultValues: defaults });
  const unitOfMeasureField = form.register("unitOfMeasure", { setValueAs: normalizeUnitOfMeasure });
  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const productFilters = statusFilter === "all" ? {} : { active: statusFilter === "active" };
  const list = useQuery({ queryKey: queryKeys.products(productFilters), queryFn: () => productsApi.list(productFilters) });
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const allSubcategories = useQuery({ queryKey: queryKeys.subcategories, queryFn: subcategoriesApi.list });
  const subcategories = useQuery({
    queryKey: queryKeys.subcategoriesByCategory(categoryId),
    queryFn: () => subcategoriesApi.listByCategory(Number(categoryId)),
    enabled: Number(categoryId) > 0
  });

  useEffect(() => {
    const normalizedCategoryId = Number(categoryId);
    const previous = previousCategoryId.current;

    if (previous !== undefined && previous > 0 && previous !== normalizedCategoryId) {
      form.setValue("subcategoryId", 0);
    }

    previousCategoryId.current = normalizedCategoryId;
  }, [categoryId, form]);

  const save = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        ...values,
        unitOfMeasure: normalizeUnitOfMeasure(values.unitOfMeasure),
        description: values.description || null
      };

      return editing ? productsApi.update(editing.id, payload) : productsApi.create(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      setEditing(null);
      form.reset(defaults);
    }
  });
  const remove = useMutation({ mutationFn: productsApi.remove, onSuccess: async () => queryClient.invalidateQueries({ queryKey: queryKeys.products() }) });
  const categoryName = (id: number) => categories.data?.find((category) => category.id === id)?.name ?? "-";
  const subcategoryName = (id: number | null) => id ? allSubcategories.data?.find((subcategory) => subcategory.id === id)?.name ?? "-" : "-";
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalizedSearchTerm) {
      return list.data ?? [];
    }

    return (list.data ?? []).filter((item) => {
      const searchableValues = [
        String(item.id),
        item.name,
        item.description ?? "",
        item.unitOfMeasure,
        categoryName(item.categoryId),
        subcategoryName(item.subcategoryId),
        item.active ? "activo" : "inactivo"
      ];

      return searchableValues.some((value) => value.toLocaleLowerCase().includes(normalizedSearchTerm));
    });
  }, [list.data, normalizedSearchTerm, categories.data, allSubcategories.data]);
  const error = list.error ?? save.error ?? remove.error ?? allSubcategories.error;

  return (
    <div className={styles.stack}>
      {error && <ErrorState message={getErrorMessage(error)} />}
      <Card title={editing ? "Editar producto" : "Nuevo producto"}>
        <form className={styles.form} onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <div className={styles.field}>
            <label>Nombre</label>
            <input {...form.register("name")} />
            <FieldError message={form.formState.errors.name?.message} />
          </div>
          <div className={styles.field}>
            <label>Unidad</label>
            <input
              {...unitOfMeasureField}
              list="product-unit-options"
              onBlur={(event) => {
                unitOfMeasureField.onBlur(event);
                form.setValue("unitOfMeasure", normalizeUnitOfMeasure(event.target.value), { shouldValidate: true });
              }}
            />
            <datalist id="product-unit-options">
              <option value="UNIDAD" />
              <option value="KG" />
              <option value="LITRO" />
              <option value="GRAMO" />
            </datalist>
            <FieldError message={form.formState.errors.unitOfMeasure?.message} />
          </div>
          <div className={styles.field}>
            <label>Categoría</label>
            <select {...form.register("categoryId")}>
              <option value="0">Seleccionar</option>
              {categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <FieldError message={form.formState.errors.categoryId?.message} />
          </div>
          <div className={styles.field}>
            <label>Subcategoría</label>
            <select {...form.register("subcategoryId")}>
              <option value="0">Seleccionar</option>
              {subcategories.data?.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>)}
            </select>
            <FieldError message={form.formState.errors.subcategoryId?.message} />
          </div>
          <div className={styles.field}>
            <label>Descripción</label>
            <input {...form.register("description")} />
          </div>
          {editing && (
            <div className={styles.field}>
              <label>Activo</label>
              <select {...form.register("active", { setValueAs: (value) => value === "true" })}>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          )}
          <div className={styles.actions}>
            <Button disabled={save.isPending}>{editing ? "Guardar" : "Crear"}</Button>
            {editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); form.reset(defaults); }}>Cancelar</Button>}
          </div>
        </form>
      </Card>
      <Card title="Listado">
        <div className={styles.listHeader}>
          <div className={styles.searchField}>
            <label htmlFor="products-search">Buscar en productos</label>
            <input
              id="products-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Filtrar por nombre, categoría, subcategoría, unidad o estado..."
            />
          </div>
          <div className={styles.statusFilter}>
            <label htmlFor="products-status-filter">Estado</label>
            <select id="products-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "active" | "inactive" | "all")}>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="all">Todos</option>
            </select>
          </div>
          <span className={styles.resultCount}>
            {filteredProducts.length} de {list.data?.length ?? 0} productos
          </span>
        </div>
        {(list.data?.length ?? 0) === 0 ? (
          <EmptyState />
        ) : filteredProducts.length === 0 ? (
          <EmptyState message="No hay productos que coincidan con la búsqueda." />
        ) : (
          <div className={`${styles.tableWrap} ${styles.scrollableList}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Categoría</th>
                  <th>Subcategoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.unitOfMeasure}</td>
                    <td>{categoryName(item.categoryId)}</td>
                    <td>{subcategoryName(item.subcategoryId)}</td>
                    <td><span className={`${styles.badge} ${item.active ? styles.positive : styles.negative}`}>{item.active ? "Activo" : "Inactivo"}</span></td>
                    <td>
                      <div className={styles.rowActions}>
                        <Button size="small" variant="secondary" onClick={() => { setEditing(item); form.reset({ ...item, subcategoryId: item.subcategoryId ?? 0, description: item.description ?? "" }); }}>Editar</Button>
                        <Button size="small" variant="danger" onClick={() => remove.mutate(item.id)}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
