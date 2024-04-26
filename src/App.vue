<template>
  <div id="app">
    <div class="main">
      <ul
        class="text-content infinite-list"
        v-infinite-scroll="loadText"
        style="overflow:auto"
        infinite-scroll-distance="100"
        :style="txt"
        ref="mains"
        @scroll="onScrollUl"
      >
        <li :id="ind + loadedStart" v-for="(txt,ind) in showTxts" :key="ind" class="infinite-list-item">{{ txt }}</li>
      </ul>
      <div class="main-bg" :style="bgc"></div>
    </div>
    <affix :offset="10" class="affixBtn">
      <el-dropdown @command="cmd">
        <img src="logo.png" alt :style="'opacity:' + btnOpacity / 100" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="book">书架</el-dropdown-item>
          <el-dropdown-item command="flag">书签</el-dropdown-item>
          <el-dropdown-item divided command="bg">背景</el-dropdown-item>
          <el-dropdown-item command="font">字体</el-dropdown-item>
          <el-dropdown-item divided command="about">关于</el-dropdown-item>
          <el-dropdown-item divided command="percent">{{curPercent}}%</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </affix>
    <el-dialog title="背景设置" :visible.sync="bgDlg" width="400px" :close-on-click-modal="false">
      <div class="item">
        <div class="i-title">背景色</div>
        <div class="i-content">
          <el-color-picker v-model="bgColor" show-alpha size="mini" />
        </div>
      </div>
      <div class="item">
        <div class="i-title">替换图片</div>
        <div class="i-content">
          <el-upload
            class="avatar-uploader ic-item"
            action
            :show-file-list="false"
            :on-change="imgChanged"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button class="ic-item" @click="resetImg" size="mini">重置</el-button>
        </div>
      </div>
      <div class="item">
        <div class="i-title">图片透明度</div>
        <div class="i-content">
          <el-slider class="ic-item ic-slider" v-model="imgOpacity"></el-slider>
        </div>
      </div>
      <div class="item">
        <div class="i-title">图片缩放</div>
        <div class="i-content">
          <el-radio-group v-model="isFull">
            <el-radio :label="false">原图居中</el-radio>
            <el-radio :label="true">缩放全屏</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="item">
        <div class="i-title">背景模糊度</div>
        <div class="i-content">
          <el-slider class="ic-item ic-slider" v-model="blur"></el-slider>
        </div>
      </div>
      <div class="item">
        <div class="i-title">图标透明度</div>
        <div class="i-content dlg-b">
          <el-slider class="ic-item ic-slider" v-model="btnOpacity"></el-slider>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bgDlg = false">取 消</el-button>
        <el-button type="primary" @click="onBgOk">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="我的书架" :visible.sync="bookDlg" width="400px" :close-on-click-modal="false">
      <div class="item">
        <div class="i-title">打开书籍</div>
        <div class="i-content">
          <input type="file" @change="loadFile" accept=".txt" />
        </div>
      </div>
      <div class="item">
        <div class="i-title">文本编码</div>
        <div class="i-content dlg-b">
          <el-select v-model="textCode" size="mini">
            <el-option label="默认编码" value></el-option>
            <el-option label="GB2312" value="gb2312"></el-option>
            <el-option label="UTF-8" value="utf-8"></el-option>
            <el-option label="ANSI" value="ansi"></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bookDlg = false">取 消</el-button>
        <el-button type="primary" @click="onBookOk">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="字体设置" :visible.sync="fontDlg" width="400px" :close-on-click-modal="false">
      <div class="item">
        <div class="i-title">字体名</div>
        <div class="i-content">
          <el-input v-model="fontFamily" placeholder="默认微软雅黑" size="mini"></el-input>
        </div>
      </div>
      <div class="item">
        <div class="i-title">字体颜色</div>
        <div class="i-content">
          <el-color-picker v-model="fontColor" show-alpha size="mini" />
        </div>
      </div>
      <div class="item">
        <div class="i-title">字体大小</div>
        <div class="i-content">
          <el-input-number v-model="fontSize" :min="8" :max="48" label="字体大小" size="mini"></el-input-number>
        </div>
      </div>
      <div class="item">
        <div class="i-title">字体样式</div>
        <div class="i-content">
          <el-radio-group v-model="fontType">
            <el-radio label="normal">正常</el-radio>
            <el-radio label="bold">加粗</el-radio>
            <el-radio label="italic">斜体</el-radio>
            <el-radio label="underline">下划线</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="item">
        <div class="i-title">每行高度</div>
        <div class="i-content">
          <el-input-number v-model="lineHeight" :min="10" :max="300" label="行高" size="mini"></el-input-number>
        </div>
      </div>
      <div class="item">
        <div class="i-title">书页边距</div>
        <div class="i-content dlg-b">
          <el-input-number
            v-model="paddinglr"
            :min="0"
            :max="500"
            label="侧边距"
            size="mini"
            class="ic-item"
          ></el-input-number>
          <el-input-number
            v-model="paddingtb"
            :min="0"
            :max="500"
            label="顶边距"
            size="mini"
            class="ic-item"
          ></el-input-number>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fontDlg = false">取 消</el-button>
        <el-button type="primary" @click="onFontOk">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="欢迎使用网书阅读器！"
      :visible.sync="guideDlg"
      width="400px"
      :close-on-click-modal="false"
    >
      <div
        class="about"
      >网书阅读器是一款离线阅读应用，由于网页安全限制，每次启动您需要手动打开上次阅读的书籍和设置的背景图片(建议您将阅读的书籍和图片放到一个专用目录)。给您造成的使用麻烦请体谅。感谢您的使用！祝您阅读愉快！</div>
      <!-- <div class="hint">由于浏览器安全限制，网站无法读取本地路径，请您设置目录以便重新打开网站时还原您的上次阅读！</div> -->
      <div class="item">
        <div class="i-title">选一本书阅读</div>
        <div class="i-content">
          <input type="file" @change="loadFile" accept=".txt" />
        </div>
      </div>
      <div class="item">
        <div class="i-title">选择喜爱的背景</div>
        <div class="i-content dlg-b">
          <el-upload
            class="avatar-uploader ic-item"
            action
            :show-file-list="false"
            :on-change="imgChanged"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button class="ic-item" @click="resetImg" size="mini">重置</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onGuideOk">进入阅读</el-button>
      </span>
    </el-dialog>
    <el-drawer title="我的书签" :visible.sync="flagDrawer" direction="rtl" size="420px">
      <div class="flagPane">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>创建书签 (已读 {{curPercent}}%)</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="clearFlags">全部删除</el-button>
          </div>
          <el-radio-group v-model="curType" class="f-radio">
            <el-radio class="f-radio-item" label>蓝</el-radio>
            <el-radio class="f-radio-item" label="success">绿</el-radio>
            <el-radio class="f-radio-item" label="info">灰</el-radio>
            <el-radio class="f-radio-item" label="warning">橙</el-radio>
            <el-radio class="f-radio-item" label="danger">红</el-radio>
          </el-radio-group>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
            placeholder="书签名 (支持跳转 名称@百分比,如:书签1@80.5%)"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新建书签</el-button>
        </el-card>
        <el-card class="box-card tag-pane">
          <el-tag
            :key="index"
            v-for="(tag,index) in flags"
            closable
            :disable-transitions="false"
            @close="deleteFlag(tag)"
            :type="tag.type"
            @click="clickFlag(tag)"
          >{{"《" + tag.book + "》 " + tag.name + " (" + tag.time + ")"}}</el-tag>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      flags: [],
      curType: "",
      inputVisible: false,
      inputValue: "",
      bgDlg: false,
      bgColor: "#fff",
      bgc: "background-color: #fff;",
      txt:
        "font-family: '微软雅黑',font-size: 18px; line-height: 50px; padding: 50px;",
      imageUrl: "",
      imgOpacity: 100,
      btnOpacity: 100,
      isFull: true,
      blur: 0,
      curSelectFile: "",
      bookDlg: false,
      thisBook: null,
      thisBookName: "",
      texts: [],
      firstLoad: 100,
      loadOnce: 30,
      showTxts: [],
      textCode: "gb2312",
      fontDlg: false,
      fontFamily: "",
      fontColor: "#000",
      fontSize: 18,
      lineHeight: 50,
      paddinglr: 50,
      paddingtb: 50,
      fontType: "normal",
      guideDlg: false,
      isReading: false,
      flagDrawer: false,
      loadedStart: 0, // 现在阅读区间
      loadedCount: 0,
      maxResetSize: 300, // 超过这个值就会清空当前加载的内容 重新加载
      nowFlagName: "",
      curFlag: 0 // 当前书签位置
    };
  },
  methods: {
    gotoFlag(id, func) {
      if (id > this.loadedCount) {
        // console.log(id,this.loadedCount);
        let needLoad = id - this.loadedCount + this.loadOnce;
        this.loadText(needLoad);
      }
      if(id < this.loadedStart) {
        this.reloadText(id);
      }
      this.$nextTick(() => {
        // window.location.hash = "#" + id;
        location.href = "#" + id;
        this.curFlag = id;
        if (func) func();
      });
    },
    reloadText(id) {
      if (this.isReading && this.texts.length > 0) {
        let total = this.texts.length;
        this.showTxts = [];
        let lastCount = id;
        let numOfLoad = this.loadOnce;
        this.loadedCount = lastCount + this.loadOnce;
        if(this.loadedCount > total) { this.loadedCount = total; numOfLoad = total - lastCount; }
        this.loadedStart = lastCount;
        for (let i = 0; i < numOfLoad; i++) {
          let id = i + lastCount;
          this.showTxts.push(this.texts[id]);
        }
      } else {
        this.$message({
          message: "这本书已经读完了！"
        });
      }
    },
    loadText(numOfLoad) {
      numOfLoad = numOfLoad || this.loadOnce;
      // console.log(this.texts.length, this.loadedCount);
      if (this.isReading && this.texts.length > 0) {
        let total = this.texts.length;
        if (this.loadedCount < total - 1) {
          let lastCount = this.loadedCount;
          this.loadedCount += numOfLoad;
          if(this.loadedCount > total) { this.loadedCount = total; numOfLoad = total - lastCount; }
          if(numOfLoad > this.maxResetSize) {
            this.showTxts = [];
            lastCount = this.loadedCount;
            this.loadedStart = lastCount;
            numOfLoad = this.loadOnce;
            this.loadedCount += numOfLoad;
            if(this.loadedCount > total) { this.loadedCount = total; numOfLoad = total - lastCount; }
          }
          for (let i = 0; i < numOfLoad; i++) {
            let id = i + lastCount;
            this.showTxts.push(this.texts[id]);
          }
        } else {
          this.$message({
            message: "这本书已经读完了！"
          });
        }
      }
    },
    openBook(skipHint) {
      if (this.thisBook === null) {
        if (!skipHint) {
          this.$message({
            message: "请先选择您要阅读的书籍！",
            type: "warning"
          });
        }
        return;
      }
      this.isReading = false;
      const loading = this.$loading({
        lock: true,
        text: "正在打开书籍..."
      });
      const reader = new FileReader();
      reader.onload = e => {
        this.texts = [];
        this.showTxts = [];
        this.loadedCount = 0;
        this.curFlag = 0;
        this.loadedStart = 0;
        let splitTxt = ":::split:::";
        let str = e.target.result;
        str = str.replace(/\r\n/g, splitTxt);
        let lines = str.split(splitTxt);
        for (const j in lines) {
          let str = lines[j];
          if (!str.match(/^\s*$/)) this.texts.push(str);
        }
        for (let i = 0; i < this.firstLoad; i++) {
          if (this.texts[i]) {
            this.showTxts.push(this.texts[i]);
          }
          this.loadedCount++;
        }
        loading.close();
        this.thisBookName = this.Com.getFileName(this.thisBook.name);
        // console.log("this.thisBookName",this.thisBookName)
        this.isReading = true;
      };
      reader.readAsText(this.thisBook, this.textCode);
    },
    cmd(Command) {
      if (Command === "bg") {
        this.bgDlg = true;
      } else if (Command === "book") {
        this.bookDlg = true;
      } else if (Command === "font") {
        this.fontDlg = true;
      } else if (Command === "flag") {
        this.flagDrawer = true;
      } else if (Command === "about") {
        this.$alert(`
          <div>
            <p>欢迎使用网书阅读器！</p>
            <p>制作者：BlChock</p>
            <p>如有疑问请发邮件至510729981@qq.com</p>
            <p>如果您觉得好用请支持我，您的支持是我最大的动力！</p>
          </div>
          <div style="text-align:center;margin-top:20px;">
            <img src="pay.png" width="200" />
          </div>
        `, '网书', {
          dangerouslyUseHTMLString: true
        });
      } else if (Command === "percent") {
        if(this.isReading) {
          this.$alert(`
            <div>
              <p>您正在阅读 ${this.thisBookName}</p>
              <p>这本书共有 ${this.texts.length} 段文章</p>
              <p>您已经阅读了 ${this.curFlag} 段文章</p>
              <p>当前阅读进度为 ${this.curPercent}%</p>
              <p>最近您使用的书签为 ${this.nowFlagName}</p>
              <p>建议您及时保存书签，以便下次打开书本继续阅读！</p>
            </div>
          `, '网书', {
            dangerouslyUseHTMLString: true
          });
        }
      }
    },
    imgChanged(file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    resetImg() {
      this.imageUrl = "";
    },
    setBg() {
      let bg = "";
      if (this.imageUrl.length > 0) {
        bg = bg + "background:url(" + this.imageUrl + ") no-repeat; ";
        if (this.isFull) {
          bg = bg + "background-size:100%; ";
        }
      } else {
        bg = "background-color:" + this.bgColor + ";";
      }
      bg += "opacity: " +
        this.imgOpacity / 100 +
        "; -webkit-filter: blur(" +
        this.blur / 10 +
        "px); filter: blur(" +
        this.blur / 10 +
        "px); ";
      this.bgc = bg;
    },
    onBgOk() {
      this.setBg();
      this.$cookies.set("ba_opacity", this.imgOpacity);
      this.$cookies.set("ba_blur", this.blur);
      this.$cookies.set("ba_bgcolor", this.bgColor);
      this.$cookies.set("ba_bg_isfull", this.isFull);
      this.$cookies.set("ba_btnopacity", this.btnOpacity);
      this.bgDlg = false;
    },
    onBookOk() {
      this.openBook();
      this.$cookies.set("ba_code", this.textCode);
      this.bookDlg = false;
    },
    loadFile(e) {
      this.thisBook = e.target.files[0];
    },
    onFontOk() {
      let str =
        "color: " +
        this.fontColor +
        "; font-size: " +
        this.fontSize +
        "px; line-height: " +
        this.lineHeight +
        "px; padding: " +
        this.paddinglr +
        "px " +
        this.paddingtb +
        "px; ";
      if (this.fontFamily.length > 0) {
        str = str + "font-family: '" + this.fontFamily + "'; ";
      }
      if (this.fontType === "bold") {
        str = str + "font-weight: bold; ";
      } else if (this.fontType === "italic") {
        str = str + "font-style: italic; ";
      } else if (this.fontType === "underline") {
        str = str + "text-decoration: underline; ";
      }
      this.txt = str;
      this.$cookies.set("ba_txt", str);
      this.fontDlg = false;
    },
    onGuideOk() {
      this.setBg();
      this.guideDlg = false;
      this.openBook(true);
    },
    deleteFlag(tag) {
      this.$confirm(
        "此操作将永久删除书签: " + tag.name + " [" + tag.book + "], 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.flags.splice(this.flags.indexOf(tag), 1);
          this.$cookies.set("ba_flags", JSON.stringify(this.flags));
        })
        .catch(() => {});
    },
    clearFlags() {
      this.$confirm(
        "此操作将永久删除所有书签，无法恢复！请谨慎操作。是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.flags = [];
          this.$cookies.set("ba_flags", JSON.stringify(this.flags));
        })
        .catch(() => {});
    },
    clickFlag(tag) {
      if (!this.isReading || this.thisBookName !== tag.book) {
        this.$message({
          message: "您没有在阅读该书，请先打开该书籍！",
          type: "warning"
        });
        return;
      }
      // console.log("clickFlag:",tag);
      this.gotoFlag(tag.pos);
      this.flagDrawer = false;
      this.nowFlagName = tag.name;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputVisible) {
        if (!this.isReading) {
          this.$message({
            message: "请先打开一本书",
            type: "warning"
          });
          this.inputVisible = false;
          this.inputValue = "";
          return;
        }
        let inp = this.inputValue.split('@');
        let inputValue = inp[0];
        let pos = this.curFlag;
        if(inp.length === 2) { // 有@存在 获取@后的定位值
          pos = this.getPercentFlag(inp[1]);
        }
        if (inputValue) {
          this.flags.push({
            book: this.thisBookName,
            name: inputValue,
            time: this.Com.fmtDate("yyyy-MM-dd hh:mm:ss", new Date()),
            pos: pos,
            type: this.curType
          });
        }
        this.inputVisible = false;
        this.inputValue = "";
        this.$cookies.set("ba_flags", JSON.stringify(this.flags));
      }
    },
    // 查找屏幕上第一个li
    findNextFlag(pos, dt) {
      let newId = this.curFlag + dt;
      if (newId > this.loadedCount || newId < 0) return this.curFlag;
      let el = document.getElementById(this.curFlag + dt);
      if(el && el.offsetTop) {
        let p = el.offsetTop;
        if (dt > 0 && pos > p) return this.findNextFlag(pos, dt + 1);
        if (dt < 0 && pos < p) return this.findNextFlag(pos, dt - 1);
      } else return this.curFlag;
      return newId;
    },
    onScrollUl(e) {
      if (this.isReading) {
        let scrollTop = e.srcElement.scrollTop;
        let el = document.getElementById(this.curFlag)
        if(el && el.offsetTop) {
          let lastPos = el.offsetTop;
          if (scrollTop > lastPos) {
            this.curFlag = this.findNextFlag(scrollTop, 1);
          } else if (scrollTop < lastPos) {
            this.curFlag = this.findNextFlag(scrollTop, -1);
          }
        }
        // console.log("最顶上的li元素:",this.curFlag);
      }
    },
    getPercentFlag(per) { // 获取百分比位置的标签
      let fPos = per.lastIndexOf('%');
      if( fPos !== -1) {
        per = per.slice(0,fPos)
      }
      return Math.ceil(Number(per) / 100 * this.texts.length);
    }
  },
  computed: {
    curPercent() { // 获取当前阅读百分比
      if(this.texts.length > 0) {
        return Math.floor(this.curFlag / this.texts.length * 1000) / 10;
      }
      return 0;
    },
  },
  components: {},
  mounted() {
    this.isReading = false;
    // console.log("hello!", this.$cookies.keys());
    if (this.$cookies.isKey("ba_opacity")) {
      this.imgOpacity = Number(this.$cookies.get("ba_opacity"));
    }
    if (this.$cookies.isKey("ba_btnopacity")) {
      this.btnOpacity = Number(this.$cookies.get("ba_btnopacity"));
    }
    if (this.$cookies.isKey("ba_blur")) {
      this.blur = Number(this.$cookies.get("ba_blur"));
    }
    if (this.$cookies.isKey("ba_bgcolor")) {
      this.bgColor = this.$cookies.get("ba_bgcolor");
    }
    if (this.$cookies.isKey("ba_bg_isfull")) {
      this.isFull = false;
      if (this.$cookies.get("ba_bg_isfull") === "true") {
        this.isFull = true;
      }
    }
    // console.log("init",{
    //   imgOpacity: this.imgOpacity,
    //   blur: this.blur,
    //   bgColor: this.bgColor,
    //   isFull: this.isFull
    // })
    if (this.$cookies.isKey("ba_txt")) {
      this.txt = this.$cookies.get("ba_txt");
    }
    if (this.$cookies.isKey("ba_code")) {
      this.textCode = this.$cookies.get("ba_code");
    }
    if (this.$cookies.isKey("ba_flags")) {
      this.flags = JSON.parse(this.$cookies.get("ba_flags"));
    }
    this.guideDlg = true;
  },
  beforeDestroy() {}
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.main {
  width: 100%;
  height: 100vh;
}
.main-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-position: center center;
  z-index: -1;
}
.text-content {
  width: 100%;
  height: 100vh;
}
.affixBtn {
  position: absolute;
  right: 20px;
  top: 10px;
  width: 34px;
  height: 34px;
}
.affixBtn img {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #000;
}
.item {
  float: left;
  width: 100%;
  line-height: 30px;
  font-size: 16px;
  min-height: 30px;
  margin-bottom: 10px;
}
.item .i-title {
  float: left;
  margin-right: 10px;
  min-height: 30px;
}
.item .i-content {
  float: left;
  min-height: 30px;
}
.item .i-content .ic-item {
  float: left;
  margin-right: 10px;
}
.ic-slider {
  width: 250px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  margin: 16px 0;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 60px;
  display: block;
}
input .selectFile {
  position: absolute;
  left: -9999px;
}
.dlg-b {
  margin-bottom: 20px;
}
.hint {
  float: left;
  width: 100%;
  color: red;
  background-color: yellow;
  margin: -35px 0 20px 0;
  padding: 5px 10px;
}
.about {
  float: left;
  width: 100%;
  color: #0086c6;
  background-color: #f4f4f4;
  margin: -35px 0 20px 0;
  padding: 5px 10px;
}
.flagPane {
  margin: -20px 10px 0 10px;
}
.el-tag + .el-tag {
  float: left;
  margin: 10px 0 0 0;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
.f-radio {
  width: 100%;
  margin-bottom: 15px;
}
.f-radio-item {
  width: 25px;
}
.tag-pane {
  margin-top: 15px;
  height: 480px;
  overflow-y: scroll;
}
</style>
