use rand::prelude::*;
use rand_chacha::ChaCha20Rng;

fn generate_random_string(bits: i32) -> Vec<u8> {

    let bytes: i32 = bits/8;

    let mut rng = ChaCha20Rng::from_entropy();
    let mut key: Vec<u8> = Vec::new(); 

    for _ in 0..bytes {
        let key_byte: u8 = rng.gen();
        key.push(key_byte);
    } 

    key
}

pub fn generate_content_encryption_key() -> Vec<u8> {
    generate_random_string(256)
}

pub fn generate_iv() -> Vec<u8> {
    generate_random_string(128)
}

pub fn generate_hmac_256() -> Vec<u8> {
    generate_random_string(256)
}

pub fn generate_xsrf() -> Vec<u8> {
    generate_random_string(256)
}

pub fn generate_salt() -> Vec<u8> {
    generate_random_string(256)
}
