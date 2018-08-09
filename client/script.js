/**
 * @description 创建一个随机的函数名
 * @return {string}
 */
const createCallbackName = function () {
    return `callback${(Math.random() * 1000000).toFixed(0)}`
}
/**
 * @description 插入一个script标签
 * @param url {string}
 */
const insertScript = function (url) {
    let script = document.createElement('script')
    script.onload = script.onerror = function () {
        document.body.removeChild(script)
    }
    script.setAttribute('src', url)
    document.body.appendChild(script)
}
/**
 * @description 拼接字符串参数
 * @param url {string} url
 * @param data {object} 要拼接的query数据
 * @return url {string} 拼接完成后的新url
 */
const setQuery = function (url, data) {
    const keys = Object.keys(data)
    if (keys.length === 0) {
        return url
    } else{
        const pairs = keys.map(key => `${key}=${data[key]}`)
        url = url.includes('?') ? url : `${url}?`
        url += pairs.join('&')
        return url
    }
}
/**
 * @description jsonp函数
 * @param url {string} 请求地址
 * @param config {object} 接口配置设置
 * @return {Promise}
 */
const jsonp = function (url, config = {}) {
    let data = config.data || {}
    let timeout = config.timeout || 5000
    let timer
    const funcName = createCallbackName()
    data.callback = funcName
    return new Promise((resolve, reject) => {
        window[funcName] = function (res) {
            if (timer) {
                clearTimeout(timer)
            }
            delete window[funcName]
            resolve(res)
        }
        url = setQuery(url, data)
        timer = setTimeout(() => {
            delete window[funcName]
            reject(new Error(`fetch ${url} fail`))
        }, timeout)
        insertScript(url)
    })
}

jsonp('http://localhost:3000')
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
