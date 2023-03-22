use self::models::*;
use diesel::prelude::*;
use server::*;

fn main() {
    use server::schema::transactions::dsl::transactions;

    let connection = &mut establish_connection();
    let results = transactions
        .limit(50)
        .load::<Transaction>(connection)
        .expect("Error loading transactions");

    println!("Displaying {} transactions", results.len());
    for trans in results {
        println!("{}", trans.description);
        println!("{}", trans.transactiondate);
        println!("{}", trans.vendor);

        println!("{}", trans.category);
        println!("{}", trans.transactiontype);
        println!("{}", trans.fromaccount);
        println!("{}", trans.toaccount);
        println!("-----------\n");
    }
}