use rsa::{ pkcs8::{EncodePrivateKey, EncodePublicKey}, RsaPrivateKey, RsaPublicKey};
use std::error::Error;
use rand::prelude::*;
use rand_chacha::ChaCha20Rng;

fn generate_rsa_key_objects() -> Result<(RsaPublicKey, RsaPrivateKey), Box<dyn Error>> {
    let mut rng = ChaCha20Rng::from_entropy();
    let bits = 2048;
    let priv_key = RsaPrivateKey::new(&mut rng, bits)?;
    let pub_key = RsaPublicKey::from(&priv_key);

    Ok((pub_key, priv_key))
}

pub fn generate_rsa_keys() -> Result<(String, String), Box<dyn Error>> {
    let (pubkey, privkey) = generate_rsa_key_objects()?;

    let pubkey_output = pubkey.to_public_key_pem(rsa::pkcs8::LineEnding::CRLF)?;
    let privkey_output = String::from(privkey.to_pkcs8_pem(rsa::pkcs8::LineEnding::CRLF)?.as_str());

    Ok((pubkey_output, privkey_output))
}