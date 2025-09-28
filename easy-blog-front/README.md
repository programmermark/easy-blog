server component：在 server component 上请求数据，在 client component 中渲染包含数据的内容，把需要渲染的数据作为参数传给 client component。

client component：就是一般的 react 组件。

server action: 用于提交数据的通用方法，可以直接访问数据库；如果有指定的后端（比如：nestjs）提供服务，那么它的作用就被代替。但是仍旧可以作为前端和服务端的中间层，做一些表单验证和预处理等（也可以在前端提前做好，但是服务端也应该具备这个能力，如果服务端对多个客户端提供的话，校验应该由服务端自己做，不该由 server action 代劳）。

react- query 的缓存用法，什么场景用什么缓存，参考一下模版：

模板 1：实时数据
const realTimeQueryConfig = {
staleTime: 0, // 立即过期
refetchInterval: 5000, // 每 5 秒刷新
refetchOnWindowFocus: true, // 窗口聚焦时刷新
refetchOnMount: true, // 挂载时刷新
refetchOnReconnect: true, // 网络重连时刷新
};

模板 2：列表数据
const listQueryConfig = {
staleTime: 2 _ 60 _ 1000, // 2 分钟内使用缓存
refetchOnWindowFocus: true, // 窗口聚焦时刷新
refetchOnMount: true, // 挂载时刷新
refetchOnReconnect: true, // 网络重连时刷新
};

模板 3：详情数据
const detailQueryConfig = {
staleTime: 5 _ 60 _ 1000, // 5 分钟内使用缓存
refetchOnWindowFocus: true, // 窗口聚焦时刷新
refetchOnMount: true, // 挂载时刷新
refetchOnReconnect: false, // 网络重连时不刷新
};

板 4：静态数据
const staticQueryConfig = {
staleTime: 10 _ 60 _ 1000, // 10 分钟内使用缓存
refetchOnWindowFocus: false, // 窗口聚焦时不刷新
refetchOnMount: false, // 挂载时不刷新
refetchOnReconnect: false, // 网络重连时不刷新
};
