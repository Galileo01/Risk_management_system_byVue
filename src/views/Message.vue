<template>
    <div class="messages">
        <el-container direction="vertical">
            <GeneralHeader> </GeneralHeader>
            <BreadNav :texts="['消息查看']" />
            <el-main>
                <el-timeline>
                    <el-timeline-item
                        v-for="(item, index) in messages"
                        :key="index"
                        :timestamp="item.createTime"
                        placement="bottom"
                        :color="item.statue === 1 ? '#f56c6c' : '#67c23a'"
                    >
                        <el-card class="message-item">
                            <div>
                                <span class="sender">{{ item.sender }}:</span>
                                <div class="content">{{ item.content }}</div>
                            </div>
                            <el-button
                                icon="el-icon-circle-check"
                                size="medium"
                                :type="item.statue === 1 ? 'danger' : 'success'"
                                :disabled="item.statue === 0"
                                @click="checkMessage(item.messageID, index)"
                            >
                                {{
                                    item.statue === 1 ? '确认收到' : '已经确认'
                                }}</el-button
                            >
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import GeneralHeader from 'components/com/GeneralHeader';
import { sendMessage, checkOneMessage, getMyMessages } from 'network/message';
export default {
    name: 'Message',

    data() {
        return {
            messages: [],
        };
    },
    methods: {
        async getData() {
            const res = await getMyMessages({});
            console.log(res);
            if (!res.flag) return this.$message.error('消息获取失败');
            else {
                this.messages = res.messages;
            }
        },
        async checkMessage(messageID, index) {
            const res = await checkOneMessage(messageID);
            console.log(res);
            if (!res.flag) return this.$message.error('消息确认失败');
            this.$message.success('消息已经确认');
            this.messages[index].statue = 0; //0是已经确认
            const find = this.messages.find((item) => item.statue === 1); //寻找 是否还有 没有确认的消息
            if (!find) {
                this.$store.commit('changeMiss', false);
                console.log('all');
            }
        },
    },
    async created() {
        this.getData();
    },
    components: {
        GeneralHeader,
    },
};
</script>

<style scoped lang="less">
/deep/ .message-item .el-card__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .sender {
        margin-right: 10px;
    }
    .content {
        font-weight: 700;
    }
    div {
        display: flex;
    }
}
</style>
