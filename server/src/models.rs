use diesel::prelude::*;
use crate::schema::transactions;
use chrono::NaiveDate;

#[derive(Insertable, Queryable)]
#[diesel(table_name = transactions)]
pub struct Transaction {
    pub id: i32,
    pub transactiondate: NaiveDate,
    pub accountnumber: i32,
    pub description: String,
    pub vendor: String,
    pub category: String,
    pub transactiontype: i32,
    pub fromaccount: String,
    pub toaccount: String
}