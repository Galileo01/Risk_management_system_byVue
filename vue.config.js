module.exports={
    configureWebpack:{
        resolve:{
            alias:{  
                'assets':'@/assets',
                'commonjs':'@/commonjs',
                'components':'@/components',
                'network':'@/network',
                'views':'@/views'
            }
        }
    },
    publicPath:"./",
        devServer: {
          // proxy: {//代理
          //     '/api':{
          //         target:'http://139.224.68.137:8081',
          //       //   changeOrigin:true,
          //         pathRewrite: {
          //           '/api': ''
          //       }
          //     }
          // }
        }
}
      