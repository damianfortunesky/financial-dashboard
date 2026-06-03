import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { queryKeys } from "../../api/queryKeys";
import { incomesApi } from "../../api/resourcesApi";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { EmptyState, ErrorState, FieldError } from "../../components/Feedback";
import type { IncomeResponse } from "../../types/api";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency, todayISO } from "../../utils/formatters";
import styles from "./Crud.module.scss";

const schema = z.object({ incomeDate: z.string().min(1, "Fecha requerida."), amount: z.coerce.number().min(0.01, "Debe ser mayor a 0."), description: z.string().max(255).optional() });
type FormValues = z.infer<typeof schema>;

export function IncomesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<IncomeResponse | null>(null);
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "" });
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { incomeDate: todayISO(), amount: 0, description: "" } });
  const list = useQuery({ queryKey: queryKeys.incomes(filters), queryFn: () => incomesApi.list(filters) });
  const save = useMutation({ mutationFn: (values: FormValues) => editing ? incomesApi.update(editing.id, { ...values, description: values.description || null }) : incomesApi.create({ ...values, description: values.description || null }), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["incomes"] }); await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }); setEditing(null); form.reset({ incomeDate: todayISO(), amount: 0, description: "" }); } });
  const remove = useMutation({ mutationFn: incomesApi.remove, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["incomes"] }); await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }); } });
  return <div className={styles.stack}>{(list.error || save.error || remove.error) && <ErrorState message={getErrorMessage(list.error ?? save.error ?? remove.error)} />}<Card title={editing ? "Editar ingreso" : "Nuevo ingreso"}><form className={styles.form} onSubmit={form.handleSubmit((v) => save.mutate(v))}><div className={styles.field}><label>Fecha</label><input type="date" {...form.register("incomeDate")} /><FieldError message={form.formState.errors.incomeDate?.message} /></div><div className={styles.field}><label>Monto</label><input type="number" step="0.01" {...form.register("amount")} /><FieldError message={form.formState.errors.amount?.message} /></div><div className={styles.field}><label>Descripción</label><input {...form.register("description")} /></div><div className={styles.actions}><Button disabled={save.isPending}>{editing ? "Guardar" : "Crear"}</Button>{editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); form.reset({ incomeDate: todayISO(), amount: 0, description: "" }); }}>Cancelar</Button>}</div></form></Card><Card title="Filtros"><div className={styles.filters}><div className={styles.field}><label>Desde</label><input type="date" value={filters.dateFrom} onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))} /></div><div className={styles.field}><label>Hasta</label><input type="date" value={filters.dateTo} onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))} /></div><Button variant="secondary" onClick={() => setFilters({ dateFrom: "", dateTo: "" })}>Limpiar</Button></div></Card><Card title="Listado">{(list.data?.length ?? 0) === 0 ? <EmptyState /> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID</th><th>Fecha</th><th>Monto</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody>{list.data?.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.incomeDate}</td><td>{formatCurrency(item.amount)}</td><td>{item.description ?? "-"}</td><td><div className={styles.rowActions}><Button size="small" variant="secondary" onClick={() => { setEditing(item); form.reset({ incomeDate: item.incomeDate, amount: item.amount, description: item.description ?? "" }); }}>Editar</Button><Button size="small" variant="danger" onClick={() => remove.mutate(item.id)}>Eliminar</Button></div></td></tr>)}</tbody></table></div>}</Card></div>;
}
