export default {
    methods: {
        //点位的随机色彩
        RandomColor() {
             const num=parseInt(1+Math.random()*7);
            switch (num) {
                case 1:
                    return '#FE0000'; // 红色
                case 2:
                    return '#FFAD5B'; //橙色
                case 3:
                    return '#FFFF00'; //黄
                case 4:
                    return '#0000FE'; //蓝色
                case 5:
                    return '#000080';
                case 6:
                    return '#4DB5D0';
                case 7:
                    return '#FF8C00';
            }
        },
        //绑定 信息窗口的 显示切换的  点击处理函数
        mountEvent(arrtribute) {//arrtribute :表示 存储 visible的信息在Vue 实例的那个属性上
            //定义 坐标点 点击的事件 ，显示 提示框
            const self = this;
            this.events = {
                click(event) {
                    const vid = event.target.F.vid;
                    // 高德地图只支持同时一个信息窗体的显示。
                    self[arrtribute][vid].visible = false;

                    //dom 更新完之后才 显示
                    self.$nextTick(() => {
                        self[arrtribute][vid].visible = true; //点击 显示
                    });
                }
            };
        },
    }
};
