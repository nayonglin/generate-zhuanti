const generators = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');
const copydir = require('copy-dir');

module.exports = generators.Base.extend({
  initializing: function () {
    var folderName = path.basename(this.destinationRoot());
    this.projectName = folderName || "my_app";
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
        message: '产品上线的名称(小写字母已下划线为分隔) ',
        default: this.projectName
      }, {
        type: 'confirm',
        name: 'huyaHeaderFooter',
        message: '需要虎牙公共头和脚',
        default: true
      }]).then((answers) => {

        this.projectName = answers.projectName;
        this.testSVN = answers.testSVN.replace(/\\/g, '/');
        this.prodSVN = answers.prodSVN.replace(/\\/g, '/');
        this.lib = answers.lib;
        this.layout = answers.layout;
        this.category = answers.category;
        this.antiHijack = answers.antiHijack;
        this.noCustomBase = answers.noCustomBase;
        this.huyaHeaderFooter = answers.huyaHeaderFooter;
        this.serverWorker = answers.serverWorker;
      })
    }
  },
  writing: {

    templates() {
      var _this = this;
      // 复制项目模板
      copydir.sync(this.templatePath(), this.destinationPath(), function (stat, filepath, filename) {
        // 文件不复制
        if (filename === 'base.js' || filename === 'index.html' || filename === 'package.json' || filename === 'pages_module.scss') {
          return false;
        }

        if (filename === 'sw.jstmpl' && !_this.serverWorker) {
          return false;
        }

        return true;
      });
    },
    lib() {
      this.fs.copyTpl(
        this.templatePath('lib/base.js'),
        this.destinationPath('lib/base.js'), {
          lib: this.lib
        }
      );
    },
    views() {

      // 保存页面的配置
      this.config.set('viewConfig', {
        projectName: this.projectName,
        category: this.category,
        antiHijack: this.antiHijack,
        noCustomBase: this.noCustomBase,
        lib: this.lib,
        layout: this.layout,
        huyaHeaderFooter: this.huyaHeaderFooter,
        serverWorker: this.serverWorker
      });

      this.fs.copyTpl(
        this.templatePath('views/index.html'),
        this.destinationPath('views/index.html'), {
          projectName: this.projectName,
          category: this.category,
          antiHijack: this.antiHijack,
          noCustomBase: this.noCustomBase,
          lib: this.lib,
          layout: this.layout,
          huyaHeaderFooter: this.huyaHeaderFooter,
          serverWorker: this.serverWorker,
          viewName: 'index'
        }
      );
    },
    packages() {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'), {
          projectName: this.projectName,
          category: this.category,
          testSVN: this.testSVN,
          prodSVN: this.prodSVN,
        }
      );
    },
    pagesModule() {
      this.fs.copyTpl(
        this.templatePath('css/pages/pages_module.scss'),
        this.destinationPath('css/pages/pages_module.scss'), {
          layout: this.layout
        }
      );
    }
  },
  end() {
    this.log('成功创建项目模板!');
  }

});