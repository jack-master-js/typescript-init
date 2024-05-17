import crypto from 'crypto';

class Cryptor {
    algorithm: any;
    key: string;
    iv: string;
    constructor(algorithm: any, key: string, iv = '') {
        this.algorithm = algorithm; //openssl list -cipher-algorithms will display the available cipher algorithms.
        this.key = key; //秘钥
        this.iv = iv; //初始化向量
    }

    encrypt(strBuf: any) {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        cipher.setAutoPadding(true);
        let encrypted = cipher.update(strBuf, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(encrypted: any) {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.key,
            this.iv
        );
        decipher.setAutoPadding(true);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

export default new Cryptor('aes-128-ccm', '!@#123');
