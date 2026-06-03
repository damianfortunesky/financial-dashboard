import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categoriesApi, merchantsApi, paymentMethodsApi, subcategoriesApi } from "@/api/resources";
import { queryKeys } from "@/api/queryKeys";
import { getApiErrorMessage } from "@/api/httpClient";
import { AsyncError, LoadingCard } from "@/components/AsyncState";
import { ConfirmButton } from "@/components/ConfirmButton";
import { PageHeader } from "@/components/PageHeader";
import { Toast, type ToastState } from "@/components/Toast";
import ui from "@/components/ui.module.scss";
import type { CategoryResponse, ID, MerchantResponse, PaymentMethodResponse, SubCategoryResponse } from "@/types/api";
import type { ReactNode } from "react";

type NamedEntity = CategoryResponse | PaymentMethodResponse | MerchantResponse;
type NamedForm = { name: string; description?: string | null; active?: boolean };

const namedSchema = z.object({ name: z.string().trim().min(1, "El nombre es requerido").max(150), description: z.string().max(255).optional().nullable(), active: z.boolean().optional() });

function NamedCrudPage<T extends NamedEntity>({ title, subtitle, resource, queryKey, maxName = 100 }: { title: string; subtitle: string; resource: ReturnType<typeof createNamedAdapter<T>>; queryKey: readonly unknown[]; maxName?: number }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<T | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const list = useQuery({ queryKey, queryFn: resource.list });
  const form = useForm<NamedForm>({ resolver: zodResolver(namedSchema.extend({ name: z.string().trim().min(1).max(maxName) })), defaultValues: { name: "", description: "", active: true } });
  const reset = () => { setEditing(null); form.reset({ name: "", description: "", active: true }); };
  const save = useMutation({ mutationFn: (values: NamedForm) => editing ? resource.update(editing.id, values) : resource.create(values), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey }); await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }); setToast({ type: "success", message: "Registro guardado" }); reset(); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  const remove = useMutation({ mutationFn: resource.remove, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey }); setToast({ type: "success", message: "Registro eliminado" }); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  return <>
    <PageHeader eyebrow="Configuración" title={title} subtitle={subtitle} />
    <Toast toast={toast} onClose={() => setToast(null)} />
    <section className={ui.grid2}>
      <article className={ui.card}>
        <h2>{editing ? "Editar" : "Crear"}</h2>
        <form className={ui.form} onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <Field label="Nombre" error={form.formState.errors.name?.message}><input className={ui.input} {...form.register("name")} /></Field>
          <Field label="Descripción" error={form.formState.errors.description?.message}><textarea className={ui.input} rows={3} {...form.register("description")} /></Field>
          {editing ? <label><input type="checkbox" {...form.register("active")} /> Activo</label> : null}
          <div className={ui.toolbar}><button className={ui.button} type="submit" disabled={save.isPending}>Guardar</button>{editing ? <button className={ui.buttonGhost} type="button" onClick={reset}>Cancelar</button> : null}</div>
        </form>
      </article>
      <article className={ui.card}>
        <h2>Listado</h2>
        {list.isLoading ? <LoadingCard /> : null}{list.error ? <AsyncError error={list.error} /> : null}
        <div className={ui.tableWrap}><table className={ui.table}><thead><tr><th>Nombre</th><th>Descripción</th><th>Estado</th><th /></tr></thead><tbody>{(list.data ?? []).map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.description ?? "—"}</td><td><span className={`${ui.badge} ${row.active ? ui.badgeGreen : ui.badgeRed}`}>{row.active ? "Activo" : "Inactivo"}</span></td><td className={ui.actions}><button className={ui.buttonGhost} type="button" onClick={() => { setEditing(row); form.reset({ name: row.name, description: row.description ?? "", active: row.active }); }}>Editar</button><ConfirmButton onConfirm={() => remove.mutate(row.id)} disabled={remove.isPending} /></td></tr>)}</tbody></table></div>
      </article>
    </section>
  </>;
}

function createNamedAdapter<T extends NamedEntity>(api: typeof categoriesApi) { return api as unknown as { list: () => Promise<T[]>; create: (body: NamedForm) => Promise<T>; update: (id: ID, body: NamedForm) => Promise<T>; remove: (id: ID) => Promise<void> }; }
export function CategoriesPage() { return <NamedCrudPage title="Categorías" subtitle="Clasificación principal de gastos y productos." resource={createNamedAdapter<CategoryResponse>(categoriesApi)} queryKey={queryKeys.categories} />; }
export function PaymentMethodsPage() { return <NamedCrudPage title="Medios de pago" subtitle="Tarjetas, efectivo, billeteras y cualquier medio usado en gastos o compras." resource={createNamedAdapter<PaymentMethodResponse>(paymentMethodsApi)} queryKey={queryKeys.paymentMethods} />; }
export function MerchantsPage() { return <NamedCrudPage title="Comercios" subtitle="Lugares donde se realizan gastos y compras." resource={createNamedAdapter<MerchantResponse>(merchantsApi)} queryKey={queryKeys.merchants} maxName={150} />; }

const subSchema = z.object({ categoryId: z.coerce.number().min(1, "Seleccioná una categoría"), name: z.string().trim().min(1, "El nombre es requerido").max(100), description: z.string().max(255).optional().nullable(), active: z.boolean().optional() });
type SubForm = z.infer<typeof subSchema>;

export function SubCategoriesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<SubCategoryResponse | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const list = useQuery({ queryKey: queryKeys.subcategories, queryFn: subcategoriesApi.list });
  const form = useForm<SubForm>({ resolver: zodResolver(subSchema), defaultValues: { categoryId: 0, name: "", description: "", active: true } });
  const reset = () => { setEditing(null); form.reset({ categoryId: 0, name: "", description: "", active: true }); };
  const save = useMutation({ mutationFn: (values: SubForm) => editing ? subcategoriesApi.update(editing.id, values) : subcategoriesApi.create(values), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: queryKeys.subcategories }), queryClient.invalidateQueries({ queryKey: queryKeys.products }), queryClient.invalidateQueries({ queryKey: queryKeys.expenses() })]); setToast({ type: "success", message: "Subcategoría guardada" }); reset(); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  const remove = useMutation({ mutationFn: subcategoriesApi.remove, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: queryKeys.subcategories }); setToast({ type: "success", message: "Subcategoría eliminada" }); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  const categoryName = (id: ID) => categories.data?.find((cat) => cat.id === id)?.name ?? `#${id}`;
  return <><PageHeader eyebrow="Configuración" title="Subcategorías" subtitle="Dependen de una categoría y evitan combinaciones inválidas en formularios." /><Toast toast={toast} onClose={() => setToast(null)} /><section className={ui.grid2}><article className={ui.card}><h2>{editing ? "Editar" : "Crear"}</h2><form className={ui.form} onSubmit={form.handleSubmit((values) => save.mutate(values))}><Field label="Categoría" error={form.formState.errors.categoryId?.message}><select className={ui.input} {...form.register("categoryId")}><option value={0}>Seleccionar</option>{(categories.data ?? []).map((cat) => <option value={cat.id} key={cat.id}>{cat.name}</option>)}</select></Field><Field label="Nombre" error={form.formState.errors.name?.message}><input className={ui.input} {...form.register("name")} /></Field><Field label="Descripción" error={form.formState.errors.description?.message}><textarea className={ui.input} rows={3} {...form.register("description")} /></Field>{editing ? <label><input type="checkbox" {...form.register("active")} /> Activo</label> : null}<div className={ui.toolbar}><button className={ui.button} type="submit" disabled={save.isPending}>Guardar</button>{editing ? <button className={ui.buttonGhost} type="button" onClick={reset}>Cancelar</button> : null}</div></form></article><article className={ui.card}><h2>Listado</h2>{list.isLoading ? <LoadingCard /> : null}{list.error ? <AsyncError error={list.error} /> : null}<div className={ui.tableWrap}><table className={ui.table}><thead><tr><th>Nombre</th><th>Categoría</th><th>Estado</th><th /></tr></thead><tbody>{(list.data ?? []).map((row) => <tr key={row.id}><td>{row.name}</td><td>{categoryName(row.categoryId)}</td><td><span className={`${ui.badge} ${row.active ? ui.badgeGreen : ui.badgeRed}`}>{row.active ? "Activo" : "Inactivo"}</span></td><td className={ui.actions}><button className={ui.buttonGhost} type="button" onClick={() => { setEditing(row); form.reset({ categoryId: row.categoryId, name: row.name, description: row.description ?? "", active: row.active }); }}>Editar</button><ConfirmButton onConfirm={() => remove.mutate(row.id)} disabled={remove.isPending} /></td></tr>)}</tbody></table></div></article></section></>;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className={ui.field}><span className={ui.label}>{label}</span>{children}{error ? <span className={ui.error}>{error}</span> : null}</label>; }
