
#[macro_use]
extern crate actix_web;
#[macro_use]
extern crate diesel;

use std::{env, io};
use dotenvy::dotenv;

use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, middleware};
use diesel::r2d2::ConnectionManager;
use diesel::PgConnection;
use r2d2::{Pool, PooledConnection};
use server::*;
use actix_web::web::Path;
use actix_web::web::Data;

// mod constants;
// mod like;
// mod response;
// mod schema;
// mod tweet;

pub type DBPool = Pool<ConnectionManager<PgConnection>>;
pub type DBPooledConnection = PooledConnection<ConnectionManager<PgConnection>>;


#[get("/derp/{key}")]
pub async fn hello(path: Path<(String,)>, pool: Data<DBPool>) -> HttpResponse {
    let conn = pool.get().expect("couldn't get DB connection from pool");
    let (name, ) = path.into_inner();
    println!("{}", name);
    HttpResponse::Ok().body("Hey there!").into()
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