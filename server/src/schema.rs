// @generated automatically by Diesel CLI.

diesel::table! {
    transactions (id) {
        id -> Int4,
        transactiondate -> Date,
        accountnumber -> Int4,
        description -> Text,
        vendor -> Text,
        category -> Text,
        transactiontype -> Int4,
        fromaccount -> Text,
        toaccount -> Text,
    }
}
