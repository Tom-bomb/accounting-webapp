use server::*;

fn main() {
    let connection = &mut establish_connection();

    let post = create_transaction(connection);
    println!("\nSaved draft with id {}", post.id);

}