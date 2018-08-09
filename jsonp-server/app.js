const http = require('http')
const url = require('url')

const jsonpServer = http.createServer((req, res) => {
    let data = {
        status: true,
        msg: 'hello jsonp'
    }
    const body = url.parse(req.url, true)
    // jsonp请求中会包含一个callback参数，例如 http://baidu.com.js?callback=hello
    // 获取请求的url中的callback参数的值,callback是一个函数名
    const callback = body.query.callback
    // 将对象数据转为字符串
    data = JSON.stringify(data)
    // 拼接成js代码
    // 举个例子，假设这个callback回调的名字是 test
    // 拼接完就是 test({status: true,msg: 'hello jsonp'})
    // 显然，就是一段js代码，作用就是执行这个函数
    const js = `${callback}(${data})`
    // 返回js代码给客户端
    res.end(js)
})

jsonpServer.listen('3000', (err) => {
    if (!err) {
        console.log('server is running at localhost:3000')
    }
})