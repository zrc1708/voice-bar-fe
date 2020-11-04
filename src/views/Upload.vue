<template>
    <el-card class="my-card">
        <input type="file" ref="file" @change="checkField($event)" accept="image/*" v-show="false"/> 
        <el-button type="primary" @click="choose">选择图片</el-button>
        <el-button type="primary" @click="upload">上传图片</el-button>
        <div class="show-cropperbox" >
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
            file:'',
            imageSrc:'',
            showCopperBox:false,
            previews:{},
            previewStyle3:{},
        }
    },
    methods:{
        choose(){
            this.$refs.file.click()
        },
        checkField(e){
            // window.URL = window.URL || window.webkitURL;
            let file = this.$refs.file.files[0]
            // fileReader接口，用于异步读取文件数据
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = e => {
                // this.imageSrc = window.URL.createObjectURL(this.file)  //转为blob格式
                this.imageSrc = e.target.result
            }
            // this.file = file
            // this.imageSrc = window.URL.createObjectURL(this.file)
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
                console.log(data)  
                
                const formData = new FormData()
                formData.append("file",data)
                const {data:res} = await this.$http.post("uploadimage",formData)
                if(res.code==200){
                    this.$message.success('图片上传成功')
                    
                }else{
                    this.$message.error('图片上传成功')
                }
            })
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
</style>