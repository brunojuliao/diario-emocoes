// vue.config.js
module.exports = {
    pwa: {
        name: "Diário de Emoções",
        themeColor: '#E1E7E4',
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "Diário de Emoções";
                return args;
            })
    },
}