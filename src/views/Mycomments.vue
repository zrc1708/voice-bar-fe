<template>
    <el-card class="my-card">
        <p v-if="dataList.length==0">暂无评论</p>
        <my-commitbox
            v-for="item in dataList"
            :key="item.id"
            boxTitle='评论'
            :id='item.id'
            :userid='item.userid'
            :updatecommit='true'
            :commitarticletitle='item.title'
            :commitarticleid='item.articleid'
            :commitarticleviews='item.views'
            :filename='item.filename'
            :posttime="item.posttime"
            :content="item.content"
            :voiceName="item.voice"
            @showUpdateCommit="showUpdateCommit"></my-commitbox>

        <el-row class="my-row">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-row>

        <el-dialog
            title="编辑评论"
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
                <el-button type="primary" @click="update">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
import commitbox from '../components/commitbox'

export default {
    components:{
      'my-commitbox':commitbox
    },
    data(){
        return{
            dataList:[],
            dialogVisible:false,
            form:{
                content:''
            },
            currentPage: 1,
            pageSize:5,
            total:0,
        }
    },
    created(){
        this.getTotal()
        this.getMyCommit(1)
    },
    methods:{
        async getTotal(){
            let id = sessionStorage.getItem('id')
            let {data:res} = await this.$http.get(`/getusercommitscount/${id}`)
            if(res.code==200){
                this.total = res.total
            }else{
                this.$message.error('获取失败')
            }
        },

        async getMyCommit(currentPage){
            let id = sessionStorage.getItem('id')
            let pageSize = this.pageSize
            let {data:res} = await this.$http.get(`/getusercommits/${id}/${currentPage}/${pageSize}`)
            if(res.code==200){
                this.dataList = res.rs
            }else{
                this.$message.error('获取失败')
            }
        },

        showUpdateCommit(item){
            this.form = item
            this.dialogVisible = true
        },

        async update(){
            let data = this.form
            let {data:res} = await this.$http.post(`/updatecommit`,data)
            if(res.code==200){
                this.getMyCommit()
                this.dialogVisible = false
                this.$message.success('编辑评论成功')
            }else{
                this.$message.error('编辑评论失败')
            }
        },

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getMyCommit(val)
        }
    }
}
</script>
<style lang="less" scoped>

</style>