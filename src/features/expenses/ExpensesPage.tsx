import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categoriesApi, expensesApi, merchantsApi, paymentMethodsApi, subcategoriesApi } from "@/api/resources";
import { queryKeys } from "@/api/queryKeys";
import { getApiErrorMessage } from "@/api/httpClient";
import { AsyncError, LoadingCard } from "@/components/AsyncState";
import { ConfirmButton } from "@/components/ConfirmButton";
import { PageHeader } from "@/components/PageHeader";
import { Toast, type ToastState } from "@/components/Toast";
import ui from "@/components/ui.module.scss";
import type { ExpenseFilters, ExpenseResponse, ID } from "@/types/api";
import { formatCurrency, todayISO } from "@/utils/format";
import type { ReactNode } from "react";

const schema = z.object({ expenseDate: z.string().min(1), amount: z.coerce.number().min(0.01), categoryId: z.coerce.number().min(1), subcategoryId: z.coerce.number().optional().nullable(), paymentMethodId: z.coerce.number().min(1), merchantId: z.coerce.number().optional().nullable(), necessary: z.boolean(), description: z.string().max(255).optional().nullable() });
type FormValues = z.infer<typeof schema>;
const nullableId = (value?: number | null) => value && value > 0 ? value : null;

export function ExpensesPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [editing, setEditing] = useState<ExpenseResponse | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const list = useQuery({ queryKey: queryKeys.expenses(filters), queryFn: () => expensesApi.list(filters) });
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const payments = useQuery({ queryKey: queryKeys.paymentMethods, queryFn: paymentMethodsApi.list });
  const merchants = useQuery({ queryKey: queryKeys.merchants, queryFn: merchantsApi.list });
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { expenseDate: todayISO(), amount: 0, categoryId: 0, subcategoryId: null, paymentMethodId: 0, merchantId: null, necessary: true, description: "" } });
  const categoryId = form.watch("categoryId");
  const subcategories = useQuery({ queryKey: queryKeys.subcategoriesByCategory(categoryId), queryFn: () => subcategoriesApi.listByCategory(categoryId), enabled: categoryId > 0 });
  useEffect(() => { form.setValue("subcategoryId", null); }, [categoryId]);
  const reset = () => { setEditing(null); form.reset({ expenseDate: todayISO(), amount: 0, categoryId: 0, subcategoryId: null, paymentMethodId: 0, merchantId: null, necessary: true, description: "" }); };
  const save = useMutation({ mutationFn: (values: FormValues) => { const body = { ...values, subcategoryId: nullableId(values.subcategoryId), merchantId: nullableId(values.merchantId) }; return editing ? expensesApi.update(editing.id, body) : expensesApi.create(body); }, onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ["expenses"] }), queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })]); setToast({ type: "success", message: "Gasto guardado" }); reset(); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  const remove = useMutation({ mutationFn: expensesApi.remove, onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ["expenses"] }), queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })]); setToast({ type: "success", message: "Gasto eliminado" }); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  const nameById = <T extends { id: ID; name: string }>(rows: T[] | undefined, id: ID | null) => rows?.find((row) => row.id === id)?.name ?? (id ? `#${id}` : "—");
  return <><PageHeader eyebrow="Movimientos" title="Gastos" subtitle="Alta, edición, filtros y selects dependientes categoría/subcategoría como espera el backend." /><Toast toast={toast} onClose={() => setToast(null)} /><section className={ui.grid2}><article className={ui.card}><h2>{editing ? "Editar gasto" : "Nuevo gasto"}</h2><form className={ui.form} onSubmit={form.handleSubmit((values) => save.mutate(values))}><div className={ui.formGrid}><Field label="Fecha"><input className={ui.input} type="date" {...form.register("expenseDate")} /></Field><Field label="Monto"><input className={ui.input} type="number" step="0.01" {...form.register("amount")} /></Field><Field label="Categoría"><select className={ui.input} {...form.register("categoryId")}><option value={0}>Seleccionar</option>{(categories.data ?? []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field><Field label="Subcategoría"><select className={ui.input} {...form.register("subcategoryId")} disabled={categoryId <= 0}><option value={0}>Sin subcategoría</option>{(subcategories.data ?? []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field><Field label="Medio de pago"><select className={ui.input} {...form.register("paymentMethodId")}><option value={0}>Seleccionar</option>{(payments.data ?? []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field><Field label="Comercio"><select className={ui.input} {...form.register("merchantId")}><option value={0}>Sin comercio</option>{(merchants.data ?? []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></Field></div><label><input type="checkbox" {...form.register("necessary")} /> Gasto necesario</label><Field label="Descripción"><textarea className={ui.input} rows={3} {...form.register("description")} /></Field><div className={ui.toolbar}><button className={ui.button} disabled={save.isPending}>Guardar</button>{editing ? <button type="button" className={ui.buttonGhost} onClick={reset}>Cancelar</button> : null}</div></form></article><article className={ui.card}><h2>Filtros rápidos</h2><div className={ui.form}><div className={ui.formGrid}><input className={ui.input} type="date" onChange={(e) => setFilters((p) => ({ ...p, dateFrom: e.target.value }))} /><input className={ui.input} type="date" onChange={(e) => setFilters((p) => ({ ...p, dateTo: e.target.value }))} /></div><select className={ui.input} onChange={(e) => setFilters((p) => ({ ...p, categoryId: Number(e.target.value) || undefined }))}><option value="">Todas las categorías</option>{(categories.data ?? []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></div></article></section><article className={ui.card} style={{ marginTop: "1rem" }}><h2>Listado</h2>{list.isLoading ? <LoadingCard /> : null}{list.error ? <AsyncError error={list.error} /> : null}<div className={ui.tableWrap}><table className={ui.table}><thead><tr><th>Fecha</th><th>Monto</th><th>Categoría</th><th>Pago</th><th>Necesario</th><th /></tr></thead><tbody>{(list.data ?? []).map((row) => <tr key={row.id}><td>{row.expenseDate}</td><td>{formatCurrency(row.amount)}</td><td>{nameById(categories.data, row.categoryId)}</td><td>{nameById(payments.data, row.paymentMethodId)}</td><td><span className={`${ui.badge} ${row.necessary ? ui.badgeGreen : ui.badgeRed}`}>{row.necessary ? "Sí" : "No"}</span></td><td className={ui.actions}><button type="button" className={ui.buttonGhost} onClick={() => { setEditing(row); form.reset({ expenseDate: row.expenseDate, amount: row.amount, categoryId: row.categoryId, subcategoryId: row.subcategoryId, paymentMethodId: row.paymentMethodId, merchantId: row.merchantId, necessary: row.necessary, description: row.description ?? "" }); }}>Editar</button><ConfirmButton onConfirm={() => remove.mutate(row.id)} disabled={remove.isPending} /></td></tr>)}</tbody></table></div></article></>;
}
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className={ui.field}><span className={ui.label}>{label}</span>{children}</label>; }
