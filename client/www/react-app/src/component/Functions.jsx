export function satToBtc(val) {
    // Ensure the value is positive
    val = Math.abs(val);

    // Convert satoshi to BTC
    const btcValue = val / 1e8;

    return btcValue.toFixed(8);
}

// Func 2
const b58set = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
export function valid_base58_addr(s) {
    for (var i = 0; i < s.length; s++) {
        if (b58set.indexOf(s[i]) == -1) {
            return false
        }
    }
    return true
}

//Func 3
export function valid_bech32_addr(s) {
    return (s.length == 62 || s.length == 42) && (s.substr(0, 3) == "bc1" || s.substr(0, 3) == "tc1")
}

//Func 4
export function valid_pubkey(s) {
    if (s.length == 66 && (s.substr(0, 2) == "02" || s.substr(0, 2) == "03")) {
        s = s.toLowerCase()
        for (var i = 0; i < s.length; i++) {
            var c = s[i]
            if (!(c >= '0' && c <= '9' || c >= 'a' && c <= 'f')) return false
        }
        return true
    }
    return false
}

//Func 5
const min_btc_addr_len = 27
export function valid_btc_addr(s) {
    try {
        if (s.length < min_btc_addr_len) return false
        if (s[0] == '#') return false
        if (valid_pubkey(s)) return true
        if (valid_bech32_addr(s)) return true
        if (valid_base58_addr(s)) return true
    } catch (e) {
        console.log("valid_btc_addr:", e)
        return false
    }
}

//Func 6
export function parse_wallet(s) {
    let wallet = new Array()
    try {
        let cont = s.split('\n')
        for (let i = 0; i < cont.length; i++) {
            let line = cont[i].trim()
            let sp_idx = line.indexOf(' ')
            let addr, label
            if (sp_idx == -1) {
                addr = line
                label = ''
            } else {
                addr = line.substr(0, sp_idx)
                label = line.substr(sp_idx + 1)
            }
            if (valid_btc_addr(addr)) {
                wallet.push({ 'addr': addr, 'label': label, 'virgin': cont[i][0] == ' ' })
            }
        }
    } catch (e) {
        console.log("parse_wallet:", e)
    }
    return wallet
}
