import JSEncrypt from "jsencrypt/bin/jsencrypt.min";

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANLl4LkZIuyk+MzOL7IMFD7HQ1FLXptT
 gVgTW0iJUejRm995xuQ6BmoYOTnuA9DdwKfTrff6jkTs0dECbmuliMMCAwEAAQ==`;

const privateKey = `MIIBVwIBADANBgkqhkiG9w0BAQEFAASCAUEwggE9AgEAAkEA0uXguRki7KT4zM4v
 sgwUPsdDUUtem1OBWBNbSIlR6NGb33nG5DoGahg5Oe4D0N3Ap9Ot9/qOROzR0QJu
 a6WIwwIDAQABAkEAk1iAdVIWkHeCTLURpbfCvUnCwp2B78ub5sk/UaJ/U8U6Bsw2
 rIKqSLm+zmQEptSRKA5d5PLQVrjetq9BtYBNAQIhAOvCV6bJOEW3V1IW8dPF8kjk
 x4BJbD7pFyWdiG9HR9VhAiEA5QEfAjNruEU8tlZ5NRp0tyNIQmrET8wjvLVJxx28
 LKMCIQDfwxLiMDWCpeLw/OoFb+jnmoxnjEh65Uyc3QnzZBofwQIhAMMhgG2cqSX8
 AS6RYnhoUZmXe8P0O9CO7simZPZAlQ4nAiEA40BxoBfp4Ia7XsmQVt/yyOwLsvVN
 AKStjLWeN0aRZcg=`;

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt); // 对数据进行解密
}
