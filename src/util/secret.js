/**
 * Created by Seven on 2019/9/23.
 * project: bpl-admin-frontend
 * email: fighting20xx@126.com
 */

import CryptoJS from 'crypto-js'
const key = 'MINGDUREALTECHCO' // 16位
const iv = 'MINGDUREALTECHCO' // 16位

const secret = {
	// aes加密
	encrypt(word, secretKey = key, secretIv = iv) {
		let encrypted = ''
		if (typeof word === 'string') {
			const srcs = CryptoJS.enc.Utf8.parse(word) // 先将字符串转换为utf8字符数组，加密
			encrypted = CryptoJS.AES.encrypt(srcs, utf8Parse(secretKey), {
				iv: utf8Parse(secretIv),
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			}) //  AES加密
		} else if (typeof word === 'object') {
			// 对象格式的转成json字符串
			const data = JSON.stringify(word)
			const srcs = CryptoJS.enc.Utf8.parse(data)
			encrypted = CryptoJS.AES.encrypt(srcs, utf8Parse(secretKey), {
				iv: utf8Parse(secretIv),
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			})
		}
		return encrypted.ciphertext.toString(CryptoJS.enc.Base64) // 再Base64加密;
	},
	// aes解密
	decrypt(word, secretKey = key, secretIv = iv) {
		const encryptedHexStr = CryptoJS.enc.Base64.parse(word) // Base64解密
		const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr) // Base64解密
		const decrypt = CryptoJS.AES.decrypt(srcs, utf8Parse(secretKey), {
			iv: utf8Parse(secretIv),
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}) // AES解密
		const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
		return decryptedStr.toString() // 再转回utf8
	}
}

function utf8Parse(value) {
	return CryptoJS.enc.Utf8.parse(value) // 16位
}

export default secret
