<template>
    <el-card class="my-card">
        <el-table :data="dataList" stripe border style="width: 100%">
            <el-table-column prop="views" label="阅读人数">
            </el-table-column>
            <el-table-column prop="commits" label="评论人数">
            </el-table-column>
            <el-table-column prop="title" label="文章标题">
            </el-table-column>
            <el-table-column prop="posttime" label="发表日期">
                <template slot-scope="scope">
                    {{scope.row.posttime | toMydate}}
                </template>
            </el-table-column>
            <el-table-column prop="username" label="作者">
                <template slot-scope="scope">
                    {{scope.row.username}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="readArticle(scope.row)" size="mini">阅读</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
<script>
export default {
    data(){
        return{
            dataList:[],
        }
    },
    filters: {
        toMydate: function (value) {
            if (!value) return ''
            return (new Date(value)).toLocaleString()
        },
        toName: function(value) {
            return value==sessionStorage.getItem('id')?sessionStorage.getItem('username'):'未知'
        }
    },
    created(){
        this.getAllArticle()
    },
    methods:{
        async getAllArticle(){
            let {data:res} = await this.$http.get(`/getallarticles`)
            if(res.code==200){
                this.dataList = res.rs
            }else{
                this.$message.error('获取失败')
            }
            console.log(this.dataList);
        },
        readArticle(item){
            this.$http.get(`/addviews/${item.id}/${item.views}`)
            this.$router.push(`/home/readarticle/${item.id}`)
        }
    }
}
</script>
<style lang="less" scoped>

</style>