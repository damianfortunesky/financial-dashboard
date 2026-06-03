import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { queryKeys } from "../../api/queryKeys";
import { categoriesApi, productsApi, subcategoriesApi } from "../../api/resourcesApi";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { EmptyState, ErrorState, FieldError } from "../../components/Feedback";
import type { ProductResponse } from "../../types/api";
import { getErrorMessage } from "../../utils/errors";
import styles from "./Crud.module.scss";

const optionalId = z.preprocess((v) => v === "" ? null : Number(v), z.number().nullable().optional());
const schema = z.object({ name: z.string().trim().min(1).max(150), description: z.string().max(100).optional(), unitOfMeasure: z.string().trim().min(1).max(50), categoryId: z.coerce.number().min(1), subcategoryId: optionalId, active: z.boolean().optional() });
type FormValues = z.infer<typeof schema>;
const defaults: FormValues = { name: "", description: "", unitOfMeasure: "unidad", categoryId: 0, subcategoryId: null, active: true };

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProductResponse | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: defaults });
  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const list = useQuery({ queryKey: queryKeys.products, queryFn: productsApi.list });
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const subcategories = useQuery({ queryKey: queryKeys.subcategoriesByCategory(categoryId), queryFn: () => subcategoriesApi.listByCategory(Number(categoryId)), enabled: Number(categoryId) > 0 });
  useEffect(() => { form.setValue("subcategoryId", null); }, [categoryId, form]);
  const save = useMutation({ mutationFn: (v: FormValues) => editing ? productsApi.update(editing.id, { ...v, description: v.description || null }) : productsApi.create({ ...v, description: v.description || null }), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: queryKeys.products }); setEditing(null); form.reset(defaults); } });
  const remove = useMutation({ mutationFn: productsApi.remove, onSuccess: async () => queryClient.invalidateQueries({ queryKey: queryKeys.products }) });
  const categoryName = (id: number) => categories.data?.find((x) => x.id === id)?.name ?? "-";
  return <div className={styles.stack}>{(list.error || save.error || remove.error) && <ErrorState message={getErrorMessage(list.error ?? save.error ?? remove.error)} />}<Card title={editing ? "Editar producto" : "Nuevo producto"}><form className={styles.form} onSubmit={form.handleSubmit((v) => save.mutate(v))}><div className={styles.field}><label>Nombre</label><input {...form.register("name")} /><FieldError message={form.formState.errors.name?.message} /></div><div className={styles.field}><label>Unidad</label><input {...form.register("unitOfMeasure")} /><FieldError message={form.formState.errors.unitOfMeasure?.message} /></div><div className={styles.field}><label>Categoría</label><select {...form.register("categoryId")}><option value="0">Seleccionar</option>{categories.data?.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select><FieldError message={form.formState.errors.categoryId?.message} /></div><div className={styles.field}><label>Subcategoría</label><select {...form.register("subcategoryId")}><option value="">Sin subcategoría</option>{subcategories.data?.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div><div className={styles.field}><label>Descripción</label><input {...form.register("description")} /></div>{editing && <div className={styles.field}><label>Activo</label><select {...form.register("active", { setValueAs: (v) => v === "true" })}><option value="true">Sí</option><option value="false">No</option></select></div>}<div className={styles.actions}><Button>{editing ? "Guardar" : "Crear"}</Button>{editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); form.reset(defaults); }}>Cancelar</Button>}</div></form></Card><Card title="Listado">{(list.data?.length ?? 0) === 0 ? <EmptyState /> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID</th><th>Nombre</th><th>Unidad</th><th>Categoría</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{list.data?.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td>{item.unitOfMeasure}</td><td>{categoryName(item.categoryId)}</td><td><span className={`${styles.badge} ${item.active ? styles.positive : styles.negative}`}>{item.active ? "Activo" : "Inactivo"}</span></td><td><div className={styles.rowActions}><Button size="small" variant="secondary" onClick={() => { setEditing(item); form.reset({ ...item, subcategoryId: item.subcategoryId ?? null, description: item.description ?? "" }); }}>Editar</Button><Button size="small" variant="danger" onClick={() => remove.mutate(item.id)}>Eliminar</Button></div></td></tr>)}</tbody></table></div>}</Card></div>;
}
