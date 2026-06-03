import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { incomesApi } from "@/api/resources";
import { queryKeys } from "@/api/queryKeys";
import { getApiErrorMessage } from "@/api/httpClient";
import { AsyncError, LoadingCard } from "@/components/AsyncState";
import { ConfirmButton } from "@/components/ConfirmButton";
import { PageHeader } from "@/components/PageHeader";
import { Toast, type ToastState } from "@/components/Toast";
import ui from "@/components/ui.module.scss";
import type { DateFilters, IncomeResponse } from "@/types/api";
import { formatCurrency, todayISO } from "@/utils/format";
import type { ReactNode } from "react";

const schema = z.object({ incomeDate: z.string().min(1, "Fecha requerida"), amount: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"), description: z.string().max(255).optional().nullable() });
type FormValues = z.infer<typeof schema>;

export function IncomesPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DateFilters>({});
  const [editing, setEditing] = useState<IncomeResponse | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const list = useQuery({ queryKey: queryKeys.incomes(filters), queryFn: () => incomesApi.list(filters) });
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { incomeDate: todayISO(), amount: 0, description: "" } });
  const reset = () => { setEditing(null); form.reset({ incomeDate: todayISO(), amount: 0, description: "" }); };
  const save = useMutation({ mutationFn: (values: FormValues) => editing ? incomesApi.update(editing.id, values) : incomesApi.create(values), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ["incomes"] }), queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })]); setToast({ type: "success", message: "Ingreso guardado" }); reset(); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  const remove = useMutation({ mutationFn: incomesApi.remove, onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ["incomes"] }), queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })]); setToast({ type: "success", message: "Ingreso eliminado" }); }, onError: (error) => setToast({ type: "error", message: getApiErrorMessage(error) }) });
  return <><PageHeader eyebrow="Movimientos" title="Ingresos" subtitle="Registra entradas de dinero con filtros por rango de fechas." /><Toast toast={toast} onClose={() => setToast(null)} /><section className={ui.grid2}><article className={ui.card}><h2>{editing ? "Editar ingreso" : "Nuevo ingreso"}</h2><form className={ui.form} onSubmit={form.handleSubmit((values) => save.mutate(values))}><Field label="Fecha" error={form.formState.errors.incomeDate?.message}><input className={ui.input} type="date" {...form.register("incomeDate")} /></Field><Field label="Monto" error={form.formState.errors.amount?.message}><input className={ui.input} type="number" step="0.01" {...form.register("amount")} /></Field><Field label="Descripción" error={form.formState.errors.description?.message}><textarea className={ui.input} rows={3} {...form.register("description")} /></Field><div className={ui.toolbar}><button className={ui.button} disabled={save.isPending}>Guardar</button>{editing ? <button className={ui.buttonGhost} type="button" onClick={reset}>Cancelar</button> : null}</div></form></article><article className={ui.card}><h2>Filtros</h2><div className={ui.formGrid}><input className={ui.input} type="date" onChange={(event) => setFilters((prev) => ({ ...prev, dateFrom: event.target.value }))} /><input className={ui.input} type="date" onChange={(event) => setFilters((prev) => ({ ...prev, dateTo: event.target.value }))} /></div></article></section><article className={ui.card} style={{ marginTop: "1rem" }}><h2>Listado</h2>{list.isLoading ? <LoadingCard /> : null}{list.error ? <AsyncError error={list.error} /> : null}<div className={ui.tableWrap}><table className={ui.table}><thead><tr><th>Fecha</th><th>Monto</th><th>Descripción</th><th /></tr></thead><tbody>{(list.data ?? []).map((row) => <tr key={row.id}><td>{row.incomeDate}</td><td>{formatCurrency(row.amount)}</td><td>{row.description ?? "—"}</td><td className={ui.actions}><button className={ui.buttonGhost} type="button" onClick={() => { setEditing(row); form.reset({ incomeDate: row.incomeDate, amount: row.amount, description: row.description ?? "" }); }}>Editar</button><ConfirmButton onConfirm={() => remove.mutate(row.id)} disabled={remove.isPending} /></td></tr>)}</tbody></table></div></article></>;
}
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className={ui.field}><span className={ui.label}>{label}</span>{children}{error ? <span className={ui.error}>{error}</span> : null}</label>; }
