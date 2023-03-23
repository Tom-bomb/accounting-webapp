
#[macro_use]
extern crate actix_web;
#[macro_use]
extern crate diesel;

use std::{env, io, error};
use dotenvy::dotenv;

use actix_web::{web, get, App, HttpResponse, HttpServer, Responder, middleware};
use diesel::r2d2::ConnectionManager;
use diesel::PgConnection;
use r2d2::{Pool, PooledConnection};
use server::*;
use actix_web::web::Path;
use actix_web::web::Data;
use self::models::*;
use diesel::prelude::*;
use server::*;
use serde::{Deserialize, Serialize};


// mod constants;
// mod like;
// mod response;
// mod schema;
// mod tweet;

pub type DBPool = Pool<ConnectionManager<PgConnection>>;
pub type DBPooledConnection = PooledConnection<ConnectionManager<PgConnection>>;
pub const APPLICATION_JSON: &str = "application/json";
pub const CONNECTION_POOL_ERROR: &str = "couldn't get DB connection from pool";



#[derive(Debug, Deserialize, Serialize)]
pub struct Response<T> {
    pub results: Vec<T>,
}

impl<T> Response<T> {
    pub fn new() -> Self {
        Self { results: vec![] }
    }
}

pub type Transactions = Response<Transaction>;


pub fn list_transactions(pool: Data<DBPool>) -> Result<Transactions, &'static str> {

    let conn = &mut pool.get().expect(CONNECTION_POOL_ERROR);
    use crate::schema::transactions::dsl::*;

    let _transactions: Vec<Transaction> = match transactions
        .load::<Transaction>(conn)
    {
        Ok(lks) => lks,
        Err(_) => vec![]
    };

    Ok(Transactions {
        results: _transactions
            .into_iter()
            .map(|l| l.to_transaction())
            .collect::<Vec<Transaction>>(),
    })
}


#[get("/derp/{key}")]
pub async fn hello(path: Path<(String,)>, pool: Data<DBPool>) -> HttpResponse {

    let transactions =
        web::block(move || list_transactions(pool)).await;

    match transactions {
        Ok(transactions) => 
            HttpResponse::Ok()
            .content_type("application/json")
            .json(transactions),
        Error => HttpResponse::Ok()
            .content_type("application/json")
            .json(Transactions::new()),
    }
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    dotenv().ok();
    env::set_var("RUST_LOG", "actix_web=debug,actix_server=info");
    env_logger::init();

    // set up database connection pool
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool");

    HttpServer::new(move || {
        App::new()
            // Set up DB pool to be used with web::Data<Pool> extractor
            .data(pool.clone())
            // enable logger - always register actix-web Logger middleware last
            .wrap(middleware::Logger::default())
            // register HTTP requests handlers
            .service(hello)
            // .service(tweet::get)
            // .service(tweet::create)
            // .service(tweet::delete)
            // .service(like::list)
            // .service(like::plus_one)
            // .service(like::minus_one)
    })
    .bind("0.0.0.0:9090")?
    .run()
    .await
}