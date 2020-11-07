<template>
    <div class="articlebox">
        <div class="article-box-title">{{boxTitle}}</div>
        <div class="article-box-content">
            <img :src="fileUrl" alt="">
            <div class="article-box-content-right">
                <span v-if="author">评论人：{{author}}</span>
                <span v-if="commitarticletitle">
                    评论文章：<el-link class="my-link" @click="readarticle" type="primary">{{commitarticletitle}}</el-link>
                </span>
                <span v-if="authorbirth">评论人注册时间：{{authorbirth | toMydate}}</span>
                <span>评论时间：{{posttime | toMydate}}</span>
                <span v-if="updatecommit">
                    <el-link type="primary" @click="showUpdateCommit">评论编辑</el-link>
                </span>
                <span v-if="deletecommit">
                    <el-link type="danger" @click="showUpdateDelete">删除评论</el-link>
                </span>
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
    props:['boxTitle','filename','author','authorbirth','posttime','id' ,'userid',
            'content','voiceName','commitarticletitle','commitarticleid',
            'commitarticleviews','updatecommit','praise','showpraise',
            'deletecommit'],
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
        readarticle(){
            let id = this.commitarticleid
            let views = this.commitarticleviews
            this.$http.get(`/addviews/${id}/${views}`)
            this.$router.push(`/home/readarticle/${id}`)
        },
        showUpdateCommit(){
            this.$emit('showUpdateCommit',{
                id:this.id,
                content:this.content,
                voiceName:this.voiceName,
                userid:this.userid})
        },
        addPraise(){
            this.$emit('praiseClick',{
                id:this.id,
                praise:this.praise
            })
        },
        showUpdateDelete(){
            this.$emit('showDeleteCommit',{
                id:this.id,
                articleid:this.commitarticleid,
                content:this.content,
                voiceName:this.voiceName,
                userid:this.userid})
        }
    }
}
</script>

<style lang="less" scoped>
.articlebox{
    font-size: 14px;
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
    margin-bottom: -10px;
    img{
        padding: 10px;
        width: 90px;
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
.my-link{
    transform: translateY(-2px);
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