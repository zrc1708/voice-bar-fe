<template>
    <el-card class="my-card">
        <my-loginout></my-loginout>
    </el-card>
</template>

<script>
import articlebox from '../components/articlebox'

export default {
    components:{
      'my-loginout':articlebox
    },
    data(){
        return{

        }
    },
    created(){
        console.log(this.$route.params.id);
    }
}
</script>
<style lang="less" scoped>

</style>