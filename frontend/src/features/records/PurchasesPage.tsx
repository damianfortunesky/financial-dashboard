import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { queryKeys } from "../../api/queryKeys";
import { merchantsApi, paymentMethodsApi, productsApi, purchaseItemsApi, purchasesApi } from "../../api/resourcesApi";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { EmptyState, ErrorState, FieldError } from "../../components/Feedback";
import type { PurchaseItemResponse, PurchaseResponse } from "../../types/api";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency, todayISO } from "../../utils/formatters";
import styles from "./Crud.module.scss";

const schema = z.object({
  purchaseDate: z.string().min(1),
  merchantId: z.coerce.number().min(1),
  paymentMethodId: z.coerce.number().min(1),
  totalAmount: z.coerce.number().min(0.01),
  notes: z.string().max(255).optional()
});
const itemSchema = z.object({
  purchaseId: z.coerce.number().min(1),
  productId: z.coerce.number().min(1),
  quantity: z.coerce.number().min(0.01),
  unitPrice: z.coerce.number().min(0.01),
  notes: z.string().max(255).optional()
});
type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;
type ItemInput = z.input<typeof itemSchema>;
type ItemValues = z.output<typeof itemSchema>;

const purchaseDefaults: FormInput = { purchaseDate: todayISO(), merchantId: 0, paymentMethodId: 0, totalAmount: 0, notes: "" };
const itemDefaults = (purchaseId: number | null): ItemInput => ({ purchaseId: purchaseId ?? 0, productId: 0, quantity: 1, unitPrice: 0, notes: "" });

export function PurchasesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PurchaseResponse | null>(null);
  const [editingItem, setEditingItem] = useState<PurchaseItemResponse | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<number | null>(null);
  const form = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema), defaultValues: purchaseDefaults });
  const itemForm = useForm<ItemInput, unknown, ItemValues>({ resolver: zodResolver(itemSchema), defaultValues: itemDefaults(null) });
  const list = useQuery({ queryKey: queryKeys.purchases(), queryFn: () => purchasesApi.list() });
  const merchants = useQuery({ queryKey: queryKeys.merchants, queryFn: merchantsApi.list });
  const payments = useQuery({ queryKey: queryKeys.paymentMethods, queryFn: paymentMethodsApi.list });
  const products = useQuery({ queryKey: queryKeys.products, queryFn: productsApi.list });
  const items = useQuery({
    queryKey: queryKeys.purchaseItemsByPurchase(selectedPurchase ?? 0),
    queryFn: () => purchaseItemsApi.listByPurchase(selectedPurchase ?? 0),
    enabled: Boolean(selectedPurchase)
  });

  const resetItemForm = (purchaseId = selectedPurchase) => {
    setEditingItem(null);
    itemForm.reset(itemDefaults(purchaseId));
  };

  const save = useMutation({
    mutationFn: (values: FormValues) => editing ? purchasesApi.update(editing.id, { ...values, notes: values.notes || null }) : purchasesApi.create({ ...values, notes: values.notes || null }),
    onSuccess: async (purchase) => {
      await queryClient.invalidateQueries({ queryKey: ["purchases"] });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      setEditing(null);
      setSelectedPurchase(purchase.id);
      resetItemForm(purchase.id);
      form.reset(purchaseDefaults);
    }
  });
  const addItem = useMutation({
    mutationFn: (values: ItemValues) => purchaseItemsApi.create({ ...values, notes: values.notes || null }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.purchaseItemsByPurchase(selectedPurchase ?? 0) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      resetItemForm();
    }
  });
  const updateItem = useMutation({
    mutationFn: (values: ItemValues) => {
      if (!editingItem) {
        throw new Error("Seleccioná un ítem para modificarlo");
      }

      return purchaseItemsApi.update(editingItem.id, { productId: values.productId, quantity: values.quantity, unitPrice: values.unitPrice, notes: values.notes || null });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.purchaseItemsByPurchase(selectedPurchase ?? 0) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      resetItemForm();
    }
  });
  const remove = useMutation({ mutationFn: purchasesApi.remove, onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["purchases"] }) });
  const removeItem = useMutation({
    mutationFn: purchaseItemsApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.purchaseItemsByPurchase(selectedPurchase ?? 0) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      resetItemForm();
    }
  });
  const selectItem = (item: PurchaseItemResponse) => {
    setEditingItem(item);
    itemForm.reset({ purchaseId: selectedPurchase ?? item.purchaseId, productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, notes: item.notes ?? "" });
  };
  const name = <T extends { id: number; name: string }>(xs: T[] | undefined, id: number) => xs?.find((x) => x.id === id)?.name ?? "-";
  const error = list.error ?? save.error ?? addItem.error ?? updateItem.error ?? remove.error ?? removeItem.error ?? items.error;

  return (
    <div className={styles.stack}>
      {error && <ErrorState message={getErrorMessage(error)} />}
      <Card title={editing ? "Editar compra" : "Nueva compra"}>
        <form className={styles.form} onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <div className={styles.field}><label>Fecha</label><input type="date" {...form.register("purchaseDate")} /></div>
          <div className={styles.field}><label>Comercio</label><select {...form.register("merchantId")}><option value="0">Seleccionar</option>{merchants.data?.map((merchant) => <option key={merchant.id} value={merchant.id}>{merchant.name}</option>)}</select><FieldError message={form.formState.errors.merchantId?.message} /></div>
          <div className={styles.field}><label>Medio de pago</label><select {...form.register("paymentMethodId")}><option value="0">Seleccionar</option>{payments.data?.map((payment) => <option key={payment.id} value={payment.id}>{payment.name}</option>)}</select><FieldError message={form.formState.errors.paymentMethodId?.message} /></div>
          <div className={styles.field}><label>Total</label><input type="number" step="0.01" {...form.register("totalAmount")} /><FieldError message={form.formState.errors.totalAmount?.message} /></div>
          <div className={styles.field}><label>Notas</label><input {...form.register("notes")} /></div>
          <div className={styles.actions}>
            <Button disabled={save.isPending}>{editing ? "Guardar" : "Crear"}</Button>
            {editing && <Button type="button" variant="secondary" onClick={() => { setEditing(null); form.reset(purchaseDefaults); }}>Cancelar</Button>}
          </div>
        </form>
      </Card>
      <Card title="Listado de compras">
        {(list.data?.length ?? 0) === 0 ? <EmptyState /> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID</th><th>Fecha</th><th>Comercio</th><th>Pago</th><th>Total</th><th>Acciones</th></tr></thead><tbody>{list.data?.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.purchaseDate}</td><td>{name(merchants.data, item.merchantId)}</td><td>{name(payments.data, item.paymentMethodId)}</td><td>{formatCurrency(item.totalAmount)}</td><td><div className={styles.rowActions}><Button size="small" variant="secondary" onClick={() => { setSelectedPurchase(item.id); resetItemForm(item.id); }}>Ítems</Button><Button size="small" variant="secondary" onClick={() => { setEditing(item); form.reset({ ...item, notes: item.notes ?? "" }); }}>Editar</Button><Button size="small" variant="danger" onClick={() => remove.mutate(item.id)}>Eliminar</Button></div></td></tr>)}</tbody></table></div>}
      </Card>
      {selectedPurchase && (
        <Card title={`Ítems de compra #${selectedPurchase}`}>
          <form className={styles.form} onSubmit={itemForm.handleSubmit((values) => addItem.mutate(values))}>
            <input type="hidden" {...itemForm.register("purchaseId")} />
            <div className={styles.field}><label>Producto</label><select {...itemForm.register("productId")}><option value="0">Seleccionar</option>{products.data?.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select><FieldError message={itemForm.formState.errors.productId?.message} /></div>
            <div className={styles.field}><label>Cantidad</label><input type="number" step="0.01" {...itemForm.register("quantity")} /><FieldError message={itemForm.formState.errors.quantity?.message} /></div>
            <div className={styles.field}><label>Precio unitario</label><input type="number" step="0.01" {...itemForm.register("unitPrice")} /><FieldError message={itemForm.formState.errors.unitPrice?.message} /></div>
            <div className={styles.field}><label>Notas</label><input {...itemForm.register("notes")} /></div>
            <div className={styles.actions}>
              <Button disabled={addItem.isPending}>Agregar ítem</Button>
              <Button type="button" variant="secondary" disabled={!editingItem || updateItem.isPending} onClick={itemForm.handleSubmit((values) => updateItem.mutate(values))}>Modificar ítem</Button>
              <Button type="button" variant="danger" disabled={!editingItem || removeItem.isPending} onClick={() => editingItem && removeItem.mutate(editingItem.id)}>Eliminar ítem</Button>
              {editingItem && <Button type="button" variant="ghost" onClick={() => resetItemForm()}>Cancelar selección</Button>}
            </div>
          </form>
          {(items.data?.length ?? 0) === 0 ? <EmptyState message="Esta compra todavía no tiene ítems." /> : <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Producto</th><th>Cantidad</th><th>Unitario</th><th>Subtotal</th><th>Acciones</th></tr></thead><tbody>{items.data?.map((item) => <tr key={item.id} className={editingItem?.id === item.id ? styles.selectedRow : undefined}><td>{name(products.data, item.productId)}</td><td>{item.quantity}</td><td>{formatCurrency(item.unitPrice)}</td><td>{formatCurrency(item.subtotal)}</td><td><div className={styles.rowActions}><Button size="small" variant="secondary" onClick={() => selectItem(item)}>{editingItem?.id === item.id ? "Seleccionado" : "Seleccionar"}</Button></div></td></tr>)}</tbody></table></div>}
        </Card>
      )}
    </div>
  );
}
