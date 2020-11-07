<template>
    <div class="articlebox">
        <div class="article-box-title">{{boxTitle}}</div>
        <div class="article-box-content">
            <img :src="fileUrl" alt="">
            <div class="article-box-content-right">
                <span>主题：{{title}}</span>
                <span>发帖人：{{author}}</span>
                <span>发帖人注册时间：{{authorbirth | toMydate}}</span>
                <span>发帖时间：{{posttime | toMydate}}</span>
            </div>
        </div>
        <el-row>
            <el-input
                class="my-showcontent-input"
                type="textarea"
                disabled
                :autosize="{ minRows: 1, maxRows: 10}"
                v-model="content"></el-input>
        </el-row>
        <el-row class="footbox">
            <audio class="audio" controls :src="voiceUrl"></audio>
            <span class="preview" v-if="showpraise" @click="addPraise">赞：{{praise}}</span>
        </el-row>
    </div>
</template>

<script>
export default {
    props:['boxTitle','filename','title','author','authorbirth','posttime','content','voiceName','praise','showpraise'],
    data(){
        return{

        }
    },
    filters: {
        toMydate: function (value) {
            if (!value) return ''
            return (new Date(value)).toLocaleString()
        }
    },
    computed:{
        voiceUrl(){
            if(this.voiceName){
                return `http://127.0.0.1:8877/getvoice/`+this.voiceName
            }else{
                return ''
            }
        },
        fileUrl(){
            if(this.filename){
                return `http://127.0.0.1:8877/getimage/`+this.filename
            }else{
                return ''
            }
        }
    },
    methods:{
        addPraise(){
            this.$emit('praiseClick',{
                praise:this.praise
            })
        }
    }
}
</script>

<style lang="less" scoped>
.articlebox{
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    margin-bottom: 10px;
}
.article-box-title{
    padding: 10px 0 7px 20px;
    border-bottom: 1px solid #eeeeee;
}
.article-box-content{
    display: flex;
    img{
        padding: 10px;
        width: 130px;
        grid-row-end: span 4;
    }
    .article-box-content-right{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
.audio{
    background-color: #f1f3f4;
    border-radius: 4px;
    margin-left: 10px;
    height: 30px;
}
.footbox{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.preview{
    display: inline-block;
    height: 30px;
    background-color: #f1f3f4;
    margin-left: 15px;
    border-radius: 3px;
    padding: 0 10px;
    line-height: 30px;
    cursor: pointer;
}
</style>