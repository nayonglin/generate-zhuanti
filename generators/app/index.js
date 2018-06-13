const generators = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');
const copydir = require('copy-dir');

module.exports = generators.Base.extend({
  initializing: function () {
    var folderName = path.basename(this.destinationRoot());
    this.projectName = folderName || "zhuanti-project";
  },
  prompting: {
    welcome() {
      this.log(yosay(
        '专题页脚手架'
      ))
    },
    ask() {
      return this.prompt([{
        type: 'input',
        name: 'projectName',
        message: '性能上报用的名字',
        default: this.projectName
      }, {
        type: 'input',
        name: 'pageTitle',
        message: '活动中文名 ',
        default: this.pageTitle
      }, {
        type: 'list',
        name: 'isNews',
        message: '是否需要战报',
        choices: [{
            name: '不需要',
            value: 'no'
          },
          {
            name: '需要',
            value: 'yes'
          },
        ],
        default: 'no'
      }, {
        type: 'list',
        name: 'isPop',
        message: '是否需要弹框',
        choices: [{
            name: '不需要',
            value: 'no'
          },
          {
            name: '需要',
            value: 'yes'
          },
        ],
        default: 'no'
      }, {
        type: 'list',
        name: 'isLogin',
        message: '首屏是否需要登录态检测',
        choices: [{
            name: '不需要',
            value: 'no'
          },
          {
            name: '需要',
            value: 'yes'
          },
        ],
        default: 'no'
      }, {
        type: 'list',
        name: 'isSecondTab',
        message: '是否需要二级tab切换',
        choices: [{
            name: '不需要',
            value: 'no'
          },
          {
            name: '需要',
            value: 'yes'
          },
        ],
        default: 'no'
      }, {
        type: 'list',
        name: 'isHover',
        message: '是否需要hover态，需要的话会添加js事件，但是css和html需要自己写,因为hover样式是不确定的',
        choices: [{
            name: '不需要',
            value: 'no'
          },
          {
            name: '需要',
            value: 'yes'
          },
        ],
        default: 'no'
      }]).then((answers) => {

        this.projectName = answers.projectName;
        this.pageTitle = answers.pageTitle;
        this.isNews = answers.isNews;
        this.isPop = answers.isPop;
        this.isLogin = answers.isLogin;
        this.isSecondTab = answers.isSecondTab;
        this.isHover = answers.isHover;

      })
    }
  },
  writing: {

    templates() {
      var _this = this;
      // 复制项目模板
      copydir.sync(this.templatePath(), this.destinationPath(), function (stat, filepath, filename) {
        // 文件不复制
        if (filename === 'index.html' ||
          filename === 'app.js' ||
          filename === 'index.scss' ||
          filename === 'index.js' ||
          filename === '__common.scss' ||
          (filename === 'news' && _this.isNews == "no") ||
          filename === 'apiConf.js' ||
          filename === 'fis-conf.js'
        ) {
          return false;
        }

        return true;
      });
    },
    views() {

      // 保存页面的配置
      this.config.set('viewConfig', {
        projectName: this.projectName,
        pageTitle: this.pageTitle,
        isNews: this.isNews,
        isPop: this.isPop,
        isLogin: this.isLogin,
        isSecondTab: this.isSecondTab,
        isHover: this.isHover
      });

      // 首页创建
      this.fs.copyTpl(
        this.templatePath('client/index.html'),
        this.destinationPath('client/index.html'), {
          projectName: this.projectName,
          pageTitle: this.pageTitle,
          isPop: this.isPop,
          isSecondTab: this.isSecondTab
        }
      );

      // index.scss创建
      this.fs.copyTpl(
        this.templatePath('client/sass/index.scss'),
        this.destinationPath('client/sass/index.scss'), {
          isPop: this.isPop,
          isSecondTab: this.isSecondTab
        }
      );

      // 客户端app.js创建 
      this.fs.copyTpl(
        this.templatePath('client/js/mod/app.js'),
        this.destinationPath('client/js/mod/app.js'), {
          isLogin: this.isLogin,
          isPop: this.isPop,
          isSecondTab: this.isSecondTab,
          isHover: this.isHover,
          isNews: this.isNews
        }
      );

      // 服务端app.js创建
      this.fs.copyTpl(
        this.templatePath('server/app.js'),
        this.destinationPath('server/app.js'), {}
      );

      // 服务端fis-conf.js创建
      this.fs.copyTpl(
        this.templatePath('client/fis-conf.js'),
        this.destinationPath('client/fis-conf.js'), {
          projectName: this.projectName
        }
      );


      // 客户端apiConf.js创建
      this.fs.copyTpl(
        this.templatePath('client/apiConf.js'),
        this.destinationPath('client/apiConf.js'), {
          projectName: this.projectName
        }
      );

      // 服务端apiConf.js创建
      this.fs.copyTpl(
        this.templatePath('server/config/apiConf.js'),
        this.destinationPath('server/config/apiConf.js'), {
          projectName: this.projectName
        }
      );


      // index.js创建 
      this.fs.copyTpl(
        this.templatePath('client/js/index.js'),
        this.destinationPath('client/js/index.js'), {
          isNews: this.isNews
        }
      );

      // __common.scss创建 
      this.fs.copyTpl(
        this.templatePath('client/sass/tool/__common.scss'),
        this.destinationPath('client/sass/tool/__common.scss'), {
          isNews: this.isNews
        }
      );

    }
  },
  end() {
    this.log('专题页项目创建成功！');
  }

});