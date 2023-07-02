pub mod schema;
pub mod models;

use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use self::models::Transaction;
use chrono::NaiveDate;
use rand::Rng;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn create_transaction(conn: &mut PgConnection) -> Transaction {
    use crate::schema::transactions;

    let mut rng = rand::thread_rng();
    let new_post = Transaction { id: rng.gen_range(0..10000), 
                                    accountnumber: rand::random::<i32>(), 
                                    transactiondate: NaiveDate::from_ymd_opt(2015, 3, 14).unwrap(), 
                                    description: "test transaction".to_string(),
                                    vendor: "derps R us".to_string(),
                                    category: "derps".to_string(), 
                                    transactiontype: 1, 
                                    fromaccount: "checking".to_string(), 
                                    toaccount: "nowhere".to_string() };

    diesel::insert_into(transactions::table)
        .values(&new_post)
        .get_result(conn)
        .expect("Error saving new post")
}