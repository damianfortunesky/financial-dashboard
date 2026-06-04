import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { queryKeys } from "../../api/queryKeys";
import { categoriesApi, subcategoriesApi } from "../../api/resourcesApi";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { EmptyState, ErrorState, FieldError } from "../../components/Feedback";
import type { SubCategoryResponse } from "../../types/api";
import { getErrorMessage } from "../../utils/errors";
import styles from "../records/Crud.module.scss";

const schema = z.object({ categoryId: z.coerce.number().min(1, "Seleccioná una categoría."), name: z.string().trim().min(1, "Nombre requerido.").max(100), description: z.string().max(255).optional(), active: z.boolean().optional() });
type FormValues = z.infer<typeof schema>;

export function SubCategoriesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<SubCategoryResponse | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { categoryId: 0, name: "", description: "", active: true } });
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const list = useQuery({ queryKey: queryKeys.subcategories, queryFn: subcategoriesApi.list });
  const save = useMutation({ mutationFn: (v: FormValues) => editing ? subcategoriesApi.update(editing.id, { ...v, description: v.description || null }) : subcategoriesApi.create({ categoryId: v.categoryId, name: v.name, description: v.description || null }), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: queryKeys.subcategories }); setEditing(null); form.reset({ categoryId: 0, name: "", description: "", active: true }); } });
  const remove = useMutation({ mutationFn: subcategoriesApi.remove, onSuccess: async () => queryClient.invalidateQueries({ queryKey: queryKeys.subcategories }) });
  const categoryName = (id: number) => categories.data?.find((x) => x.id === id)?.name ?? "-";
  return <div className={styles.stack}>{(list.error || save.error || remove.error) && <ErrorState message={getErrorMessage(list.error ?? save.error ?? remove.error)} />}<Card title={editing ? "Editar subcategoría" : "Nueva subcategoría"}><form className={styles.form} onSubmit={form.handleSubmit((v) => save.mutate(v))}><div className={styles.field}><label>Categoría</label><select {...form.register("categoryId")}><option value="0">Seleccionar</option>{categories.data?.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select><FieldError message={form.formState.errors.categoryId?.message} /></div><div className={styles.field}><label>Nombre</label><input {...form.register("name")} /><FieldError message={form.formState.errors.name?.message} /></div><div className={styles.field}><label>Descripción</label><input {...form.register("description")} /></div>{editing && <div className={styles.field}><label>Activo</label><select {...form.register("active", { setValueAs: (v) => v === "true" })}><option value="true">Sí</option><option value="false">No</option></select></div>}<div className={styles.actions}><Button>{editing ? "Guardar" : "Crear"}</Button>{editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); form.reset({ categoryId: 0, name: "", description: "", active: true }); }}>Cancelar</Button>}</div></form></Card><Card title="Listado">{(list.data?.length ?? 0) === 0 ? <EmptyState /> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID</th><th>Categoría</th><th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{list.data?.map((item) => <tr key={item.id}><td>{item.id}</td><td>{categoryName(item.categoryId)}</td><td>{item.name}</td><td>{item.description ?? "-"}</td><td><span className={`${styles.badge} ${item.active ? styles.positive : styles.negative}`}>{item.active ? "Activo" : "Inactivo"}</span></td><td><div className={styles.rowActions}><Button size="small" variant="secondary" onClick={() => { setEditing(item); form.reset({ categoryId: item.categoryId, name: item.name, description: item.description ?? "", active: item.active }); }}>Editar</Button><Button size="small" variant="danger" onClick={() => remove.mutate(item.id)}>Eliminar</Button></div></td></tr>)}</tbody></table></div>}</Card></div>;
}
