# 010_seed_data.md

## Objetivo

Implementar la carga inicial de datos maestros necesarios para que la aplicación Financial Dashboard sea utilizable inmediatamente después de la instalación.

El objetivo es evitar que el usuario tenga que cargar manualmente categorías, subcategorías, medios de pago y comercios básicos antes de comenzar a registrar ingresos y gastos.

---

## Contexto

Actualmente existen los siguientes módulos:

```text
003_modelo_datos.md

004_categoria_crud.md

005_subcategoria_crud.md

008_payment_method_crud.md

009_merchant_crud.md
```

El módulo de gastos depende de estos datos para funcionar correctamente.

---

## Alcance

Crear scripts SQL de carga inicial para:

* Categorías
* Subcategorías
* Medios de Pago
* Comercios Frecuentes

Los scripts deben poder ejecutarse múltiples veces sin generar duplicados.

---

## Base de Datos

```text
Database:
db_financial_dashboard

Schema:
core
```

---

## Entregables

Crear carpeta:

```text
database/seeds
```

Crear archivos:

```text
001_seed_categories.sql

002_seed_subcategories.sql

003_seed_payment_methods.sql

004_seed_merchants.sql
```

---

## Convención

Todos los inserts deben validar previamente la existencia del registro.

Ejemplo:

```sql
IF NOT EXISTS (
    SELECT 1
    FROM core.categories
    WHERE name = 'Comida'
)
BEGIN

    INSERT INTO core.categories
    (
        name,
        description,
        is_active,
        created_at
    )
    VALUES
    (
        'Comida',
        'Gastos relacionados a alimentación',
        1,
        SYSDATETIME()
    );

END
```

No utilizar:

```sql
TRUNCATE
DELETE
DROP
```

---

# Categorías Iniciales

Insertar:

```text
Vivienda
Comida
Transporte
Salud
Entrenamiento
Tecnología
Ocio
Impuestos
Inversiones
Educación
Mascotas
Indumentaria
Servicios
Otros
```

---

# Subcategorías Iniciales

## Vivienda

```text
Alquiler
Expensas
ABL
Luz
Gas
Agua
Internet
```

---

## Comida

```text
Supermercado
Carnicería
Verdulería
Panadería
Delivery
Restaurante
```

---

## Transporte

```text
Combustible
Peajes
Uber
Taxi
Subte
Colectivo
Tren
```

---

## Salud

```text
Obra Social
Medicamentos
Consultas Médicas
Estudios
```

---

## Entrenamiento

```text
Gimnasio
Suplementos
Indumentaria Deportiva
```

---

## Tecnología

```text
Hardware
Software
Suscripciones
Telefonía
```

---

## Ocio

```text
Streaming
Cine
Salidas
Vacaciones
Videojuegos
```

---

## Inversiones

```text
Acciones
Bonos
CEDEARs
Criptomonedas
Fondos Comunes
```

---

# Medios de Pago Iniciales

Insertar:

```text
Efectivo

Débito

Visa

Mastercard

American Express

Mercado Pago

Transferencia Bancaria

Cuenta Corriente
```

---

# Comercios Iniciales

## Supermercados

```text
Carrefour
Coto
Dia
Jumbo
Disco
```

---

## Combustible

```text
YPF
Shell
Axion
```

---

## Tecnología

```text
Mercado Libre
Amazon
```

---

## Servicios Digitales

```text
Spotify
Netflix
YouTube Premium
Disney Plus
ChatGPT
```

---

## Salud

```text
Swiss Medical
OSDE
Galeno
```

---

## Comida

```text
McDonalds
Burger King
Mostaza
PedidosYa
Rappi
```

---

# Reglas Técnicas

## Categorías

No permitir duplicados.

Validar por:

```text
name
```

---

## Subcategorías

Validar por:

```text
category_id
name
```

No permitir duplicados dentro de una misma categoría.

---

## Medios de Pago

Validar por:

```text
name
```

---

## Comercios

Validar por:

```text
name
```

---

# Criterios de Aceptación

✅ Los scripts ejecutan sin errores.

✅ Pueden ejecutarse múltiples veces.

✅ No generan registros duplicados.

✅ Todas las categorías quedan disponibles.

✅ Todas las subcategorías quedan disponibles.

✅ Todos los medios de pago quedan disponibles.

✅ Todos los comercios quedan disponibles.

✅ El módulo de gastos puede utilizar inmediatamente los datos cargados.

---

# Resultado Esperado

Una vez ejecutados los scripts, el usuario debe poder:

```text
Crear Gastos

Crear Ingresos

Asignar Categorías

Asignar Subcategorías

Seleccionar Comercios

Seleccionar Medios de Pago
```

sin necesidad de realizar cargas manuales previas.

---

## Fuera de Alcance

No implementar:

* Productos.
* Compras.
* Dashboard.
* KPIs.
* Alquiler.
* Inflación.
* Importación desde Excel.
* Frontend.
* APIs REST.

Esta tarea únicamente debe generar los datos maestros iniciales de la aplicación.
