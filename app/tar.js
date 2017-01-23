const exec = require('child_process').exec;

exec('tar -zcvf buildDir/ocs-freeboxv6/output.tar.gz output/buildDir/ocs-freeboxv6', (error, stdout, stderr) => {
    if (error) {
        console.error (`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});
