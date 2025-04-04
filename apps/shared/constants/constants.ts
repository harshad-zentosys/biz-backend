export enum USER_ROLES {
    OWNER = 'owner',
    USER = 'user'
}

export enum DEVICE_TYPES {
    APP = 'app',
    CONNECTOR = 'connector'
}

export enum DEVICE_STATUSES {
    UNREGISTERED = 'unregistered',
    ACTIVE = 'active',
    BLOCKED = 'blocked'
}

export enum USER_STATUSES {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}  

export enum DURATION_TYPES {
    DAYS = 'days',
    MONTHS = 'months',
    YEARS = 'years'
}

export enum PAYMENT_STATUSES {
    SUCCESS = 'success',
    PENDING = 'pending',
    FAILED = 'failed'
}

export enum PRIMARY_GROUPS {
    CAPITAL_ACCOUNT = 'capitalaccount',
    RESERVES_AND_SURPLUS = 'reservesandsurplus',
    LOANS = 'loans',
    BANK_OD_ACCOUNTS = 'bankodaccounts',
    SECURED_LOANS = 'securedloans',
    UNSECURED_LOANS = 'unsecuredloans',
    CURRENT_LIABILITIES = 'currentliabilities',
    SUNDRY_CREDITORS = 'sundrycreditors',
    DUTIES_AND_TAXES = 'dutiesandtaxes',
    PROVISIONS = 'provisions',
    FIXED_ASSETS = 'fixedassets',
    INVESTMENTS = 'investments',
    CURRENT_ASSETS = 'currentassets',
    STOCK_IN_HAND = 'stockinhand',
    SUNDRY_DEBTORS = 'sundrydebtors',
    CASH_IN_HAND = 'cashinhand',
    BANK_ACCOUNTS = 'bankaccounts',
    SALES_ACCOUNTS = 'salesaccounts',
    DIRECT_INCOMES = 'directincomes',
    INDIRECT_INCOMES = 'indirectincomes',
    PURCHASE_ACCOUNTS = 'purchaseaccounts',
    DIRECT_EXPENSES = 'directexpenses',
    INDIRECT_EXPENSES = 'indirectexpenses',
    BRANCH_DIVISIONS = 'branchdivisions',
    SUSPENSE_ACCOUNT = 'suspenseaccount',
    MISCELLANEOUS_EXPENSES = 'miscellaneousexpenses',
    DEPRECIATION_ACCOUNT = 'depreciationaccount',
    PROFIT_AND_LOSS_ACCOUNT = 'profitandlossaccount',    
}

export const PRIMARY_GROUP_KEYS = Object.values(PRIMARY_GROUPS)







