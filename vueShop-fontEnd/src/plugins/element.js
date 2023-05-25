import Vue from 'vue'
import {
    Button, Input, Form, FormItem, Message, Container, Main, Aside, Header, Menu,
    Submenu, MenuItem, BreadcrumbItem, Breadcrumb, Card, Row, Col, Table, TableColumn,
    Pagination, Switch, Dialog, Tooltip, MessageBox, Select, Option, Tag, Tree, Alert,
    Cascader, Tabs, TabPane, Steps, Step, CheckboxGroup, Checkbox, Upload, Timeline, TimelineItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)  
Vue.use(Upload)
Vue.use(Timeline)  
Vue.use(TimelineItem)  

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm