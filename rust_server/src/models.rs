use diesel::prelude::*;
use crate::schema::transactions;
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Insertable, Queryable, Serialize, Deserialize)]
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

impl Transaction {
    pub fn to_transaction(&self) -> Transaction {
        Transaction {
            id: self.id,
            transactiondate: self.transactiondate,
            accountnumber: self.accountnumber,
            description: self.description.to_string(),
            vendor: self.vendor.to_string(),
            category: self.category.to_string(),
            transactiontype: self.transactiontype,
            fromaccount: self.fromaccount.to_string(),
            toaccount: self.toaccount.to_string()
        }
    }
}