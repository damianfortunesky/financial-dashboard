import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AuditedActiveResponse, ID, NamedCreateRequest, NamedUpdateRequest } from "../../types/api";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { EmptyState, ErrorState, FieldError, SuccessState } from "../../components/Feedback";
import { getErrorMessage } from "../../utils/errors";
import styles from "../records/Crud.module.scss";

const schema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido.").max(150, "Máximo 150 caracteres."),
  description: z.string().max(255, "Máximo 255 caracteres.").optional(),
  active: z.boolean().optional()
});

type FormValues = z.infer<typeof schema>;

interface NamedCatalogPageProps {
  title: string;
  queryKey: readonly string[];
  api: {
    list: () => Promise<AuditedActiveResponse[]>;
    create: (body: NamedCreateRequest) => Promise<AuditedActiveResponse>;
    update: (id: ID, body: NamedUpdateRequest) => Promise<AuditedActiveResponse>;
    remove: (id: ID) => Promise<void>;
  };
}

export function NamedCatalogPage({ title, queryKey, api }: NamedCatalogPageProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AuditedActiveResponse | null>(null);
  const [feedback, setFeedback] = useState<string>();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", description: "", active: true } });
  const list = useQuery({ queryKey, queryFn: api.list });

  const save = useMutation({
    mutationFn: (values: FormValues) => editing ? api.update(editing.id, { ...values, description: values.description || null }) : api.create({ name: values.name, description: values.description || null }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      setFeedback(editing ? `${title} actualizado.` : `${title} creado.`);
      setEditing(null);
      form.reset({ name: "", description: "", active: true });
    }
  });

  const remove = useMutation({
    mutationFn: api.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      setFeedback(`${title} eliminado.`);
    }
  });

  const onEdit = (item: AuditedActiveResponse) => {
    setEditing(item);
    form.reset({ name: item.name, description: item.description ?? "", active: item.active });
  };

  return (
    <div className={styles.stack}>
      {(save.error || remove.error || list.error) && <ErrorState message={getErrorMessage(save.error ?? remove.error ?? list.error)} />}
      {feedback && <SuccessState message={feedback} />}
      <Card title={editing ? `Editar ${title}` : `Nuevo ${title}`}>
        <form className={styles.form} onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <div className={styles.field}><label>Nombre</label><input {...form.register("name")} /><FieldError message={form.formState.errors.name?.message} /></div>
          <div className={styles.field}><label>Descripción</label><input {...form.register("description")} /><FieldError message={form.formState.errors.description?.message} /></div>
          {editing && <div className={styles.field}><label>Activo</label><select {...form.register("active", { setValueAs: (value) => value === "true" })}><option value="true">Sí</option><option value="false">No</option></select></div>}
          <div className={styles.actions}><Button disabled={save.isPending}>{editing ? "Guardar" : "Crear"}</Button>{editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); form.reset({ name: "", description: "", active: true }); }}>Cancelar</Button>}</div>
        </form>
      </Card>
      <Card title={`Listado de ${title}`}>
        {(list.data?.length ?? 0) === 0 ? <EmptyState /> : (
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{list.data?.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.name}</td><td>{item.description ?? "-"}</td><td><span className={`${styles.badge} ${item.active ? styles.positive : styles.negative}`}>{item.active ? "Activo" : "Inactivo"}</span></td><td><div className={styles.rowActions}><Button size="small" variant="secondary" onClick={() => onEdit(item)}>Editar</Button><Button size="small" variant="danger" onClick={() => remove.mutate(item.id)}>Eliminar</Button></div></td></tr>)}</tbody></table></div>
        )}
      </Card>
    </div>
  );
}
