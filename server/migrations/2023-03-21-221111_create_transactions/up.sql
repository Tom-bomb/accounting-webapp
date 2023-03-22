CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transactiondate date not null,
    AccountNumber int not null,
    Description text not null,
    vendor text not null,
    category text not null,
    transactiontype int not null,
    fromaccount text not null,
    toaccount text not null
)