<template>
  <div class="flex flex-col items-center">
    <el-image
      class="range-img"
      :src="imgUrl"
      fit="cover"
      :style="{
        transform: `rotate(${slider.rotateAngle}deg)`,
        transition: slider.transition,
      }"
    ></el-image>
    <div class="range w-full" :class="slider.rangeStatus ? 'success' : ''">
      <i
        @mousedown="rangeMove($event)"
        :class="slider.rangeStatus ? successIcon : startIcon"
      ></i>
      <span class="text-xs text-white">{{
        slider.rangeStatus ? successText : startText
      }}</span>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from "vue";
export default {
  props: {
    imgUrl: String,
    // 松手之后的函数
    mouseupFun: {
      type: Function,
    },
    //成功图标
    successIcon: {
      type: String,
      default: "el-icon-success",
    },
    //成功文字
    successText: {
      type: String,
      default: "验证成功",
    },
    //开始的图标
    startIcon: {
      type: String,
      default: "el-icon-d-arrow-right",
    },
    //开始的文字
    startText: {
      type: String,
      default: "拖动滑块，使图片角度为正",
    },
    //失败之后的函数
    errorFun: {
      type: Function,
    },
    //或者用值来进行监听
    status: {
      type: Boolean,
    },
  },
  setup(props, context) {
    const slider = reactive({
      disX: 0,
      rotateAngle: 0,
      transition: "0s all",
      //成功时的样式
      rangeStatus: false,
    });
    //滑块移动
    const rangeMove = (e) => {
      let ele = e.target;
      //开始时鼠标的水平坐标
      let startX = e.clientX;
      //水平宽度
      let eleWidth = ele.offsetWidth;
      //父元素的水平宽度
      let parentWidth = ele.parentElement.offsetWidth;
      //进度条的宽度
      let MaxX = parentWidth - eleWidth;
      if (slider.rangeStatus) {
        //不运行
        return false;
      }
      // 鼠标移动时的函数
      document.onmousemove = (e) => {
        slider.transition = "0s all";

        //鼠标移动时的水平坐标
        let endX = e.clientX;
        //获取从开始时的坐标到移动结束后的坐标的距离
        slider.disX = endX - startX;
        if (slider.disX <= 0) {
          slider.disX = 0;
        }

        // if(this.disX>=MaxX-eleWidth/2){//减去滑块的宽度1/2,体验效果更好
        //   this.disX = MaxX;
        // }
        if (slider.disX >= MaxX) {
          //减去滑块的宽度1/2,体验效果更好
          slider.disX = MaxX;
        }
        ele.style.transition = "0s all"; //这里修改成这样就流畅了
        ele.style.transform = "translateX(" + slider.disX + "px)";
        e.preventDefault();
        //每次增加的度数
        let everyAngle = 360 / MaxX;
        slider.rotateAngle = slider.disX * everyAngle;
      };
      //鼠标释放时的函数
      document.onmouseup = () => {
        //向父组件传值
        context.emit("rotateAngle", slider.rotateAngle);
        props.mouseupFun();
        ele = ele;
        slider.disX = 0;
        ele.style.transition = ".5s all"; //这里修改成这样就流畅了
        ele.style.transform = "translateX(" + slider.disX + "px)";
        slider.rotateAngle = 0;
        slider.transition = ".5s all";
        //如果不进行这个操作滑块会一直运动
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
    watch(
      () => props.status,
      (val) => {
        if (val === false) slider.rangeStatus = false;
        slider.rangeStatus = true;
        // props.status = false;
      }
    );
    return {
      slider,
      rangeMove,
    };
  },
};
</script>

<style scoped>
.range {
  background-color: #a8a7a7;
  position: relative;
  transition: 1s all;
  user-select: none;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px; /*no*/
  border-radius: 10px;
}

.range i {
  position: absolute;
  left: 0;
  width: 60px; /*no*/
  height: 100%;
  color: #919191;
  background-color: #fff;
  border: 1px solid #bbb;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.range.success {
  background-color: #7ac23c;
  color: #fff;
}

.range.success i {
  color: #7ac23c;
}

.range-img {
  width: 150px;
  height: 150px;
  text-align: center;
}
</style>

