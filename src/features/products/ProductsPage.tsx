import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categoriesApi, productsApi, subcategoriesApi } from "@/api/resources";
import { queryKeys } from "@/api/queryKeys";
import { getApiErrorMessage } from "@/api/httpClient";
import { AsyncError, LoadingCard } from "@/components/AsyncState";
import { ConfirmButton } from "@/components/ConfirmButton";
import { PageHeader } from "@/components/PageHeader";
import { Toast, type ToastState } from "@/components/Toast";
import ui from "@/components/ui.module.scss";
import type { ID, ProductResponse } from "@/types/api";
import type { ReactNode } from "react";

const schema = z.object({ name: z.string().trim().min(1).max(150), description: z.string().max(100).optional().nullable(), unitOfMeasure: z.string().trim().min(1).max(50), categoryId: z.coerce.number().min(1), subcategoryId: z.coerce.number().optional().nullable(), active: z.boolean().optional() });
type FormValues = z.infer<typeof schema>;
const nullableId = (value?: number | null) => value && value > 0 ? value : null;

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProductResponse | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const list = useQuery({ queryKey: queryKeys.products, queryFn: productsApi.list });
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", description: "", unitOfMeasure: "unidad", categoryId: 0, subcategoryId: null, active: true } });
  const categoryId = form.watch("categoryId");
  const subcategories = useQuery({ queryKey: queryKeys.subcategoriesByCategory(categoryId), queryFn: () => subcategoriesApi.listByCategory(categoryId), enabled: categoryId > 0 });
  useEffect(() => { form.setValue("subcategoryId", null); }, [categoryId]);
  const reset = () => { setEditing(null); form.reset({ name: "", description: "", unitOfMeasure: "unidad", categoryId: 0, subcategoryId: null, active: true }); };
  const save = useMutation({ mutationFn: (values: FormValues) => { const body = { ...values, subcategoryId: nullableId(values.subcategoryId) }; return editing ? productsApi.update(editing.id, body) : productsApi.create(body); }, onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: queryKeys.products }), queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })]); setToast({ type: "success", message: "Producto guardado" }); reset(); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  const remove = useMutation({ mutationFn: productsApi.remove, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: queryKeys.products }); setToast({ type: "success", message: "Producto eliminado" }); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  const categoryName = (id: ID) => categories.data?.find((row) => row.id === id)?.name ?? `#${id}`;
  return <><PageHeader eyebrow="Catálogo" title="Productos" subtitle="Catálogo para ítems de compra con unidad de medida y clasificación." /><Toast toast={toast} onClose={() => setToast(null)} /><section className={ui.grid2}><article className={ui.card}><h2>{editing ? "Editar producto" : "Nuevo producto"}</h2><form className={ui.form} onSubmit={form.handleSubmit((values) => save.mutate(values))}><div className={ui.formGrid}><Field label="Nombre"><input className={ui.input} {...form.register("name")} /></Field><Field label="Unidad"><input className={ui.input} placeholder="unidad, kg, litro" {...form.register("unitOfMeasure")} /></Field><Field label="Categoría"><select className={ui.input} {...form.register("categoryId")}><option value={0}>Seleccionar</option>{(categories.data ?? []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field><Field label="Subcategoría"><select className={ui.input} {...form.register("subcategoryId")} disabled={categoryId <= 0}><option value={0}>Sin subcategoría</option>{(subcategories.data ?? []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field></div><Field label="Descripción"><textarea className={ui.input} rows={3} {...form.register("description")} /></Field>{editing ? <label><input type="checkbox" {...form.register("active")} /> Activo</label> : null}<div className={ui.toolbar}><button className={ui.button} disabled={save.isPending}>Guardar</button>{editing ? <button type="button" className={ui.buttonGhost} onClick={reset}>Cancelar</button> : null}</div></form></article><article className={ui.card}><h2>Tips</h2><p className={ui.subtitle}>Usá unidades consistentes para comparar cantidades en el ranking del dashboard.</p></article></section><article className={ui.card} style={{ marginTop: "1rem" }}><h2>Listado</h2>{list.isLoading ? <LoadingCard /> : null}{list.error ? <AsyncError error={list.error} /> : null}<div className={ui.tableWrap}><table className={ui.table}><thead><tr><th>Nombre</th><th>Unidad</th><th>Categoría</th><th>Estado</th><th /></tr></thead><tbody>{(list.data ?? []).map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.unitOfMeasure}</td><td>{categoryName(row.categoryId)}</td><td><span className={`${ui.badge} ${row.active ? ui.badgeGreen : ui.badgeRed}`}>{row.active ? "Activo" : "Inactivo"}</span></td><td className={ui.actions}><button type="button" className={ui.buttonGhost} onClick={() => { setEditing(row); form.reset({ name: row.name, description: row.description ?? "", unitOfMeasure: row.unitOfMeasure, categoryId: row.categoryId, subcategoryId: row.subcategoryId, active: row.active }); }}>Editar</button><ConfirmButton onConfirm={() => remove.mutate(row.id)} disabled={remove.isPending} /></td></tr>)}</tbody></table></div></article></>;
}
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className={ui.field}><span className={ui.label}>{label}</span>{children}</label>; }
