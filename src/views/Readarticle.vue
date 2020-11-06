<template>
    <el-card class="my-card">
        <my-articlebox 
            boxTitle='文章'
            :showpraise="true"
            :praise="myArticle.praise"
            :filename='myArticle.filename'
            :title="myArticle.title"
            :author="myArticle.username"
            :authorbirth="myArticle.birthtime"
            :posttime="myArticle.posttime"
            :content="myArticle.content"
            :voiceName="myArticle.voice"
            @praiseClick="addArticlePraise"></my-articlebox>
        <my-commitbox
            v-if="hotest"
            boxTitle='热评'
            :id='hotest.id'
            :showpraise="true"
            :praise="hotest.praise"
            :filename='hotest.filename'
            :author="hotest.username"
            :authorbirth="hotest.birthtime"
            :posttime="hotest.posttime"
            :content="hotest.content"
            :voiceName="hotest.voice"
            @praiseClick="addPraise"></my-commitbox>
        <div class="nohot" v-else>
            热评空缺中，还不快枪
        </div>
        <el-row class="my-row">
            <el-button @click="showCommit">评论</el-button>
        </el-row>

        <my-commitbox
            v-for="item in commitList"
            :key="item.id"
            boxTitle='评论'
            :id='item.id'
            :showpraise="true"
            :praise="item.praise"
            :filename='item.filename'
            :author="item.username"
            :authorbirth="item.birthtime"
            :posttime="item.posttime"
            :content="item.content"
            :voiceName="item.voice"
            @praiseClick="addPraise"></my-commitbox>


        <el-dialog
            title="回复"
            :visible.sync="dialogVisible"
            width="70%">

            <el-row class="my-row">
                <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                    v-model="form.content">
                </el-input>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="publish">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
import articlebox from '../components/articlebox'
import commitbox from '../components/commitbox'

export default {
    components:{
      'my-articlebox':articlebox,
      'my-commitbox':commitbox
    },
    data(){
        return{
            myArticle:{},
            dialogVisible:false,
            form:{
                content:''
            },
            commitList:[],
            hotest:null,
        }
    },
    created(){
        new Promise((resolve,reject)=>{
            this.getArticle()
            resolve()
        }).then(async ()=>{
            await this.getCommit()
            this.getHostest()
        })
    },
    methods:{
        async getArticle(){
            let id = this.$route.params.id
            let {data:res} = await this.$http.get(`/getarticle/${id}`)
            if(res.code==200){
                this.myArticle = res.rs[0]
            }else{
                this.$message.error('获取失败')
            }
        },

        async getCommit(){
            let id = this.$route.params.id
            let {data:res} = await this.$http.get(`/getcommits/${id}`)
            if(res.code==200){
                this.commitList = res.rs
            }else{
                this.$message.error('获取失败')
            }
            // console.log(this.commitList);
        },

        async publish(){
            let data = this.form
            data.userid = sessionStorage.getItem('id')
            data.articleid = this.myArticle.id
            data.commits = this.myArticle.commits

            let {data:res} = await this.$http.post('/publishcommit',data)
            if(res.code==200){
                this.$message.success('评论成功')
                this.form = {}
                this.getCommit()
            }else{
                this.$message.error('评论失败')
            }
            this.dialogVisible = false
        },

        // 获取热评
        getHostest(){
            let itemindex = 0
            let max =0
            this.commitList.forEach((item,index)=>{
                if(item.praise >= max){
                    max = item.praise
                    itemindex = index
                }
            })
            if(max!==0){
                this.hotest = this.commitList[itemindex]
            }
        },

        // 点赞
        async addPraise(item){
            let {data:res} = await this.$http.post('/praisecommit',item)
            if(res.code==200){
                this.$message.success('点赞成功')
                await this.getCommit()    
                this.getHostest()
                
            }else{
                this.$message.error('点赞失败')
            }
        },
        async addArticlePraise(item){
            item.id = this.$route.params.id
            let {data:res} = await this.$http.post('/praisearticle',item)
            if(res.code==200){
                this.$message.success('点赞成功')
                this.getArticle()
            }else{
                this.$message.error('点赞失败')
            }
        },
        showCommit(){
            this.dialogVisible = true
        },

        showUpdateCommit(item){
            console.log(item);
        }
    }
}
</script>
<style lang="less" scoped>
.nohot{
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    padding: 20px;
    font-size: 14px;
}
</style>