var ghpages = require('gh-pages');
const shell = require('shelljs');
const chalk = require('chalk');
const DIST_DIR = 'dist/';
// 发布
ghpages.publish(DIST_DIR, {
    branch: 'gh-pages',
}, (err) => {
    if(err) {
        console.log(chalk.red(err));
    } else {
        shell.rm('-rf', DIST_DIR);
        console.log(chalk.green('🎉同步完成!'));
    }
});