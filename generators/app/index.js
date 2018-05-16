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
        message: '产品上线的名称(小写字母已下划线为分隔) ',
        default: this.projectName
      }, {
        type: 'input',
        name: 'pageTitle',
        message: '活动中文名 ',
        default: this.pageTitle
      }]).then((answers) => {

        this.projectName = answers.projectName;
        this.pageTitle = answers.pageTitle;

      })
    }
  },
  writing: {

    templates() {
      var _this = this;
      // 复制项目模板
      copydir.sync(this.templatePath(), this.destinationPath(), function (stat, filepath, filename) {
        // 文件不复制
        if (filename === 'index.html') {
          return false;
        }

        return true;
      });
    },
    views() {

      // 保存页面的配置
      this.config.set('viewConfig', {
        projectName: this.projectName,
        pageTitle: this.pageTitle
      });

      this.fs.copyTpl(
        this.templatePath('client/index.html'),
        this.destinationPath('client/index.html'), {
          projectName: this.projectName,
          pageTitle: this.pageTitle,
          viewName: 'index'
        }
      );
    }
  },
  end() {
    this.log('成功创建项目模板!');
  }

});