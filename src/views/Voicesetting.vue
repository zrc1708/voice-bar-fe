<template>
    <el-card class="box-card my-card">
        <el-form ref="publishForm" :model="form" label-width="80px" class="form">
            <el-form-item label="发声人">
                <el-select v-model="form.per" class="select" placeholder="请选择发声人">
                    <el-option label="女" :value="0"></el-option>
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="度逍遥" :value="3"></el-option>
                    <el-option label="度丫丫" :value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="语速">
                <el-select v-model="form.spd" class="select" placeholder="请选择语速">
                    <el-option v-for="item in 9" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="语调">
                <el-select v-model="form.pit" class="select" placeholder="请选择语调">
                    <el-option v-for="item in 9" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="音量">
                <el-select v-model="form.vol" class="select" placeholder="请选择音量">
                    <el-option v-for="item in 9" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <p>注：此配置更改后，只在您本人之后发表的文章及评论中生效。对于已经存在或其他用户的文章评论不生效。</p>
            <el-form-item>
                <el-button type="primary" @click="onRegister">提交修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script>
export default {
    data(){
        return{
            form:{
                per:'', //发音人选择, 0为女声，1为男声，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女
                spd:'', //语速，取值0-9，默认为5中语速
                pit:'', //音调，取值0-9，默认为5中语调
                vol:'', //音量，取值0-15，默认为5中音量
            }
        }
    },
    created(){
        this.getSetting()
    },
    methods:{
        async getSetting(){
            let id = sessionStorage.getItem('id')
            let {data:res} = await this.$http.get(`/getvoicesetting/${id}`)
            if(res.code==200){
                this.form.per = res.rs.per
                this.form.spd = res.rs.spd
                this.form.pit = res.rs.pit
                this.form.vol = res.rs.vol
            }else{
                this.$message.error('获取失败')
            }
        },
        async onRegister() {
            let data = this.form
            data.id = sessionStorage.getItem('id')

            let {data:res} = await this.$http.post('/changevoicesetting',data)
            if(res.code==200){
                this.$message.success('修改成功')
                this.getSetting()
            }else{
                this.$message.error('修改失败')
            }
        },
    }
}
</script>
<style lang="less" scoped>

</style>