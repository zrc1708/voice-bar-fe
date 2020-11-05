<template>
    <div class="articlebox">
        <div class="article-box-title">{{boxTitle}}</div>
        <div class="article-box-content">
            <img :src="fileUrl" alt="">
            <div class="article-box-content-right">
                <span>评论人：{{author}}</span>
                <span>评论人注册时间：{{authorbirth | toMydate}}</span>
                <span>评论时间：{{posttime | toMydate}}</span>
            </div>
        </div>
        <el-input
            class="my-showcontent-input"
            type="textarea"
            disabled
            :autosize="{ minRows: 1, maxRows: 10}"
            v-model="content"></el-input>
        <audio class="audio" controls :src="voiceUrl"></audio>
    </div>
</template>

<script>
export default {
    props:['boxTitle','filename','author','authorbirth','posttime','content','voiceName'],
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
        width: 100px;
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
    margin-bottom: 5px;
}

</style>