import Vue from 'vue'
import { 
    Button ,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Aside,
    Header,
    Main
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)


//挂载 全局的 方法
Vue.prototype.$message=Message;