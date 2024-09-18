use rand::prelude::*;
use rand_chacha::ChaCha20Rng;
use hmac::{Hmac, Mac};
use sha2::Sha256;
use aes::cipher::{block_padding::Pkcs7, BlockEncryptMut, BlockDecryptMut, KeyIvInit};
use rsa::{ 
    pkcs8::{ DecodePublicKey, DecodePrivateKey}, 
    Pkcs1v15Encrypt, 
    RsaPublicKey, 
    RsaPrivateKey
};
use axum::extract::Extension;
use std::sync::{Arc, RwLock};

use crate::structs::*;
use crate::randstrings::*;

use crate::error_types::JweError;

type HmacSha256 = Hmac<Sha256>;
type Aes128CbcEnc = cbc::Encryptor<aes::Aes128>;
type Aes128CbcDec = cbc::Decryptor<aes::Aes128>;
type SharedState = Arc<RwLock<ApplicationState>>;

fn generate_authtag(ciphertext: &[u8], cek: &[u8], iv: &[u8], aad: &[u8]) -> Vec<u8> {

    let hmac_key = &cek[..16];

    let bits_length: i64 = aad.len() as i64  * 8;
    let al = bits_length.to_be_bytes();


    let mut mac_data: Vec<u8> = Vec::new();
    mac_data.extend_from_slice(aad);
    mac_data.extend_from_slice(iv);
    mac_data.extend_from_slice(ciphertext);
    mac_data.extend_from_slice(&al);

    let mut mac = HmacSha256::new_from_slice(hmac_key).unwrap(); 
    mac.update(&mac_data);
    let hmac = mac.finalize().into_bytes();

    let auth_tag: Vec<u8> = Vec::from(&hmac[0..16]); 

    auth_tag
}

pub struct AES128CBCHMACSHA256 {}

impl AES128CBCHMACSHA256 {
    pub fn encode(plaintext: String, cek: &[u8], iv: &[u8], aad: &[u8]) -> Result<(Vec<u8>, Vec<u8>), anyhow::Error> {

        let aes_key = &cek[16..];

        let length = plaintext.len();

        let mut buf_vec: Vec<u8> = vec![0; 2* length]; 
        let buf = &mut buf_vec[..2*length] ;
        buf[..length].copy_from_slice(&plaintext.as_bytes());

        let ciphertext_result= Aes128CbcEnc::new(aes_key.into(), iv.into())
        .encrypt_padded_mut::<Pkcs7>(buf, length);

        let ciphertext: &[u8] = match ciphertext_result {
            Ok(result) => result,
            Err(_) => return Err(JweError::new("Unable to create JWE token").into())
        };

        let authtag = generate_authtag(ciphertext, cek, iv, aad);

        Ok((Vec::from(ciphertext), authtag))
    }

    pub fn decode(mut ciphertext: Vec<u8>, cek: &[u8], iv: &[u8], aad: &[u8], authtag: &[u8]) -> Result<String, anyhow::Error> {
        let authtag_check = generate_authtag(&ciphertext.clone(), &cek, iv, aad);

        if authtag != authtag_check {
            return Err(JweError::new("Failed integrity check").into())
        }

        let aes_key = &cek[16..];
        let plaintext_result = Aes128CbcDec::new(aes_key.into(), iv.into())
        .decrypt_padded_mut::<Pkcs7>(&mut ciphertext);

        let plaintext_bytes = match plaintext_result {
            Ok(result) => result,
            Err(_) => return Err(JweError::new("Unable to decode JWE token").into())
        };

        let plaintext = String::from_utf8(Vec::from(plaintext_bytes))?;

        Ok(plaintext)
    }
}


fn generate_jwt(state: SharedState, iss: &str, sub: &str, iat: &str, exp: &str, xsrf: &str) -> Result<String, anyhow::Error> {
    let jose_header = JWTHeader {
        typ: "JWT",
        alg: "HS256"
    };
    let jose_header_b64url: String = base64_url::encode(&serde_json::to_string(&jose_header)?); 


    let jwt_claims_set = JWTBody {
        iss: String::from(iss),
        sub: String::from(sub),
        iat: String::from(iat), 
        exp: String::from(exp),
        xsrf: String::from(xsrf)
    };
    let jwt_claims_set_b64url: String = base64_url::encode(&serde_json::to_string(&jwt_claims_set)?);

    let jwt_data = format!("{jose_header_b64url}.{jwt_claims_set_b64url}");

    let mac_key = base64_url::decode(&state.read().unwrap().mac_key)?;

    let mut mac = HmacSha256::new_from_slice(&mac_key)?; 
    mac.update(jwt_data.as_bytes());
    let hmac = mac.finalize().into_bytes();
    let jws = base64_url::encode(hmac.as_slice()); 

    let jwt = format!("{jose_header_b64url}.{jwt_claims_set_b64url}.{jws}");

    Ok(jwt)
}


pub fn generate_jwe(Extension(state): Extension<SharedState>, iss: &str, sub: &str, iat: &str, exp: &str, xsrf: &str) -> Result<String, anyhow::Error> {
    let jwe_header = JWEHeader {
        alg: "RSA-Pkcs1v15",
        enc: "A128CBC-HS256"
    }; 

    let jwe_header_b64: String = base64_url::encode(&serde_json::to_string(&jwe_header)?);

    let pubkey: RsaPublicKey;

    {
        pubkey = RsaPublicKey::from_public_key_pem(&state.read().unwrap().rsa_public_key)?;
    }

    let cek = generate_content_encryption_key();
    let iv = generate_iv();
    let aad = jwe_header_b64.as_bytes();


    let plaintext = generate_jwt(state, iss, sub, iat, exp, xsrf)?;

    let (ciphertext, authtag) = AES128CBCHMACSHA256::encode(plaintext, &cek, &iv, aad)?; 

    let pubkey_encrypt_cek = pubkey.encrypt(&mut ChaCha20Rng::from_entropy(), Pkcs1v15Encrypt, &cek)?; 
    let cek_b64 = base64_url::encode(&pubkey_encrypt_cek);

    let iv_b64 = base64_url::encode(&iv);
    let ciphertext_b64 = base64_url::encode(&ciphertext);
    let authtag_b64 = base64_url::encode(&authtag);
    
    let jwe = format!("{jwe_header_b64}.{cek_b64}.{iv_b64}.{ciphertext_b64}.{authtag_b64}");


    Ok(jwe)
}



fn extract_token_body(header_b64: &str, key_b64: &str, iv_b64: &str, ciphertext_b64: &str, authtag_b64: &str, mac_key: &[u8], private_key: String) -> Result<String, anyhow::Error> {

    let header_bytes = base64_url::decode(&header_b64)?;
    let header_string = String::from_utf8(header_bytes)?;

    let cek_encoded = base64_url::decode(&key_b64)?;
    let iv = base64_url::decode(&iv_b64)?;
    let ciphertext = base64_url::decode(&ciphertext_b64)?;
    let authtag = base64_url::decode(&authtag_b64)?;

    let header: serde_json::Value = serde_json::from_str(&header_string)?;
    if header["alg"] != "RSA-Pkcs1v15" || header["enc"] != "A128CBC-HS256" {
        return Err(JweError::new("This JWE header type is not supported").into());
    }

    let privkey: RsaPrivateKey = RsaPrivateKey::from_pkcs8_pem(&private_key)?;

    let cek = privkey.decrypt(Pkcs1v15Encrypt, &cek_encoded)?;
    let aad = base64_url::encode(header_string.as_bytes());

    let plaintext = AES128CBCHMACSHA256::decode(ciphertext, &cek, &iv, aad.as_bytes(), &authtag)?;
    let jwt_information: Vec<&str> = plaintext.split(".").collect();

    let jwt_header = String::from_utf8(base64_url::decode(jwt_information[0])?)?;
    let header_json: serde_json::Value = serde_json::from_str(&jwt_header)?;

    if header_json["typ"] != "JWT" || header_json["alg"] != "HS256" {
        return Err(JweError::new("This JWT header type is not supported").into())
    }

    let jwt_body = String::from_utf8(base64_url::decode(jwt_information[1])?)?;

    let jwt_data = format!("{}.{}", jwt_information[0], jwt_information[1]);
    let mut mac = HmacSha256::new_from_slice(&mac_key)?; 
    mac.update(jwt_data.as_bytes());
    let hmac = mac.finalize().into_bytes();
    let jws = base64_url::encode(hmac.as_slice()); 

    if jws != jwt_information[2] {
        return Err(JweError::new("Failed token integrity check").into())
    } 

    Ok(jwt_body)
}


pub fn validate_jwe(private_key: String, mac_key_string: String, jwe: String) -> Result<String, anyhow::Error> {

    let jwe_elements: Vec<&str> = jwe.split(".").collect();

    if jwe_elements.len() < 5 {
        return Err(anyhow::Error::msg("Invalid JWE"));
    }

    let header_b64 = jwe_elements[0];
    let key_b64 = jwe_elements[1];
    let iv_b64 = jwe_elements[2];
    let ciphertext_b64 = jwe_elements[3];
    let authtag_b64 = jwe_elements[4];


    let mac_key: Vec<u8> = base64_url::decode(&mac_key_string)?;
    
    let result = extract_token_body(header_b64, key_b64, iv_b64, ciphertext_b64, authtag_b64, &mac_key, private_key)?;

    return Ok(result);
}
