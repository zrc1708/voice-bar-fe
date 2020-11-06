<template>
    <el-card class="my-card">
        <div class="myarticle" v-show="showMyarticle">
            <el-row class="my-row">
                <el-input class="my-input" v-model="searchInput" placeholder="请输入标题"></el-input>
                <el-button @click="search">搜索</el-button>
            </el-row>
            <el-row class="my-row">
                <el-button @click="showMyarticle = false">发表文章</el-button>
            </el-row>

            <el-table :data="dataList" stripe border style="width: 100%">
                <el-table-column prop="views" label="阅读人数">
                </el-table-column>
                <el-table-column prop="commits" label="评论人数">
                </el-table-column>
                <el-table-column prop="title" label="文章标题">
                </el-table-column>
                <el-table-column label="发表日期">
                    <template slot-scope="scope">
                        {{scope.row.posttime | toMydate}}
                    </template>
                </el-table-column>
                <el-table-column label="最新评论日期">
                    <template slot-scope="scope">
                        {{scope.row.latestcommit | toMydate}}
                    </template>
                </el-table-column>
                <el-table-column prop="userid" label="作者">
                    <template slot-scope="scope">
                        {{scope.row.userid | toName}}
                    </template>
                </el-table-column>
                <el-table-column prop="userid" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="readArticle(scope.row)" size="mini">阅读</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="my-row" v-show="showpage">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-row>
        </div>
        <div class="push" v-show="!showMyarticle">
            <el-row class="my-row">
                <el-input class="my-input2" v-model="form.title" placeholder="文章标题"></el-input>
            </el-row>
            <el-row class="my-row">
                <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                    v-model="form.content">
                </el-input>
            </el-row>
            <el-row class="my-row">
                <el-button type="primary"  @click="publish">发表</el-button>
                <el-button @click="showMyarticle = true">返回</el-button>
            </el-row>
        </div>
    </el-card>
</template>
<script>
export default {
    data(){
        return{
            searchInput:'',
            showMyarticle:true,
            form:{
                title:'',
                content:''
            },
            dataList:[],
            currentPage: 1,
            pageSize:10,
            total:0,
            showpage:true
        }
    },
    created(){
        this.getTotal()
        this.getArticle(1)
    },
    filters: {
        toMydate: function (value) {
            if (!value) return '-'
            return (new Date(value)).toLocaleString()
        },
        toName: function(value) {
            return value==sessionStorage.getItem('id')?sessionStorage.getItem('username'):'未知'
        }
    },
    methods:{
        async getTotal(){
            let id = sessionStorage.getItem('id')
            let {data:res} = await this.$http.get(`/getmyarticlecount/${id}`)
            if(res.code==200){
                this.total = res.total
            }else{
                this.$message.error('获取失败')
            }
        },
        async publish(){
            let data = this.form
            data.id = sessionStorage.getItem('id')

            let {data:res} = await this.$http.post('/publish',data)
            if(res.code==200){
                this.$message.success('发表成功')
                this.getTotal()
                this.getArticle(1)
                this.form = {}
                this.showMyarticle = true
            }else{
                this.$message.error('发表失败')
            }
        },
        async getArticle(currentPage){
            let id = sessionStorage.getItem('id')
            let pageSize = this.pageSize
            let {data:res} = await this.$http.get(`/getmyarticle/${id}/${currentPage}/${pageSize}`)
            if(res.code==200){
                this.dataList = res.rs
            }else{
                this.$message.error('获取失败')
            }
        },
        readArticle(item){
            this.$http.get(`/addviews/${item.id}/${item.views}`)
            this.$router.push(`/home/readarticle/${item.id}`)
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.getArticle(val)
        },
        async search(){
            if(this.searchInput==''){
                this.getArticle(1)
                this.showpage = true
                return
            }
            let searchInput = this.searchInput
            let id = sessionStorage.getItem('id')
            let {data:res} = await this.$http.get(`/searchMyArticle/${id}/${searchInput}`)
            if(res.code==200){
                this.dataList = res.rs
                this.showpage = false
                this.searchInput = ''
            }else{
                this.$message.error('获取失败')
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>