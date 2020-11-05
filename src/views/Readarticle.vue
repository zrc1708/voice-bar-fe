<template>
    <el-card class="my-card">
        <my-articlebox 
            boxTitle='文章'
            :filename='myArticle.filename'
            :title="myArticle.title"
            :author="myArticle.username"
            :authorbirth="myArticle.birthtime"
            :posttime="myArticle.posttime"
            :content="myArticle.content"
            :voiceName="myArticle.voice"></my-articlebox>
        <el-row class="my-row">
            <el-button @click="showCommit">评论</el-button>
        </el-row>
        <my-commitbox
            v-for="item in commitList"
            :key="item.id"
            boxTitle='评论'
            :filename='item.filename'
            :author="item.username"
            :authorbirth="item.birthtime"
            :posttime="item.posttime"
            :content="item.content"
            :voiceName="item.voice"></my-commitbox>


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
            <!-- <el-row class="my-row">
                <el-button type="primary"  @click="publish">发表</el-button>
            </el-row> -->

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
            commitList:[]
        }
    },
    created(){
        new Promise((resolve,reject)=>{
            this.getArticle()
            resolve()
        }).then(()=>{
            this.getCommit()
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
            // console.log(this.myArticle);
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
        showCommit(){
            this.dialogVisible = true
        }
    }
}
</script>
<style lang="less" scoped>

</style>