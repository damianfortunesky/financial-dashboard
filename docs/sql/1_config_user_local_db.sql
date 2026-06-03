/*
========================================================
SQL SERVER - CONFIGURACIÓN LOCAL SIMPLE
Crea base, schemas y usuario usados por los scripts Python.
========================================================
*/

USE master;
GO

IF DB_ID('db_financial_dashboard') IS NULL
BEGIN
    CREATE DATABASE db_financial_dashboard;
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.server_principals
    WHERE name = 'admin_financial_dashboard'
)
BEGIN
    CREATE LOGIN admin_financial_dashboard
    WITH PASSWORD = 'ApiFinancialDashboard132!',
         CHECK_POLICY = OFF,
         CHECK_EXPIRATION = OFF;
END
GO

USE db_financial_dashboard;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.schemas
    WHERE name = 'core'
)
BEGIN
    EXEC('CREATE SCHEMA core');
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_principals
    WHERE name = 'admin_financial_dashboard'
)
BEGIN
    CREATE USER admin_financial_dashboard
        FOR LOGIN admin_financial_dashboard;
END
GO

ALTER ROLE db_datareader
ADD MEMBER admin_financial_dashboard;
GO

ALTER ROLE db_datawriter
ADD MEMBER admin_financial_dashboard;
GO

GRANT EXECUTE TO admin_financial_dashboard;
GO

GRANT SELECT, INSERT, UPDATE, DELETE
ON SCHEMA::core
TO admin_financial_dashboard;
GO