<template>
    <el-card class="my-card">
        <input type="file" ref="file" @change="checkField($event)" accept="image/*" v-show="false"/> 
        <el-row class="my-row">
            <el-button type="primary" @click="choose">选择图片</el-button>
            <el-button type="primary" @click="upload" :disabled='cantUpload'>上传图片</el-button>
        </el-row>

        <div class="show-cropperbox" v-show="imageSrc">
            <div class="cropperbox">
                <vueCropper
                    ref="cropper"
                    :img="imageSrc"
                    autoCrop
                    fixed
                    outputType="webp"
                    :autoCropWidth='150'
                    :autoCropHeight='150'
                    :canMove="false"
                    @realTime="realTime"
                ></vueCropper>
            </div>
            <div class="cropper-watch">
                <div :style="previewStyle3"> 
                    <div :style="previews.div">
                        <img :src="previews.url" :style="previews.img">
                    </div>
                </div>
                <div class="circlebox">
                    <div :style="previewStyle3"> 
                        <div :style="previews.div">
                            <img :src="previews.url" :style="previews.img">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-row class="my-row">
            <span class="avatar-box">
                <img :src="imageName" alt="" v-if="imageName">
            </span>
            <span v-if="!imageName">您还未上传过头像</span>
        </el-row>
    </el-card>
</template>
<script>
import { VueCropper }  from 'vue-cropper' 

export default {
    components: {
        VueCropper
    },
    data(){
        return{
            // 选择的文件
            imageSrc:'',
            showCopperBox:false,
            previews:{},
            previewStyle3:{},
            // 展示的头像的文件名
            showImageName:'',
            // 展示的头像的URL
            imageName:'',
            cantUpload:true,
        }
    },
    mounted(){
        this.getImage()
    },
    methods:{
        choose(){
            this.$refs.file.click()
        },
        checkField(e){
            let file = this.$refs.file.files[0]
            // fileReader接口，用于异步读取文件数据
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = e => {
                this.imageSrc = e.target.result
                this.cantUpload = false
            }
            this.showCopperBox = true
        },
        realTime(data) {
            var previews = data;
            var h = 0.5;
            var w = 0.2;
            // 固定为100宽度
            this.previewStyle3 = {
                width: previews.w + "px",
                height: previews.h + "px",
                overflow: "hidden",
                margin: "0",
                zoom: 150 / previews.w
            };
            this.previews = data;
        },
        upload(){
            this.$refs.cropper.getCropBlob(async (data) => {                
                const formData = new FormData()
                formData.append("file",data)
                formData.append("id",sessionStorage.getItem('id'))
                let haveAvatar = this.imageName ? true:false
                formData.append('haveAvatar',haveAvatar)
                formData.append('oldFileName',this.showImageName)

                const {data:res} = await this.$http.post("uploadimage",formData)
                if(res.code==200){
                    this.imageSrc = ''
                    this.showImageName = res.filename
                    this.imageName = `http://127.0.0.1:8877/getimage/${res.filename}`
                    this.cantUpload = true
                    this.$message.success('图片上传成功')

                }else{
                    this.$message.error('图片上传成功')
                }
            })
        },
        // 获取用户头像
        async getImage(){
            let id = sessionStorage.getItem('id')
            let {data:res} = await this.$http.get(`/getimagename/${id}`)

            if(res.code==200){
                this.showImageName = res.rs.filename
                this.imageName = `http://127.0.0.1:8877/getimage/${res.rs.filename}`
            }else if(res.code==210){
                return
            }else{
                this.$message.error('获取失败')
            }
        }
    }
}
</script>
<style lang="less" scoped>

.cropperbox{
    width: 350px;
    height: 350px;
}
.show-cropperbox{
    margin: 20px 0;
    display: flex;
}
.cropper-watch{
    margin-left: 50px;
    display: flex;
    flex-direction: column;
}
.circlebox{
    margin-top: auto;
    border-radius: 50%;
    overflow: hidden;
}
.avatar-box{
    border: 1px solid #eeeeee;
    display: inline-block;
    img{
        display: block;
        width: 150px;
    }
}
</style>