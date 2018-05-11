const handlebars = require('handlebars');
const fs = require('fs');

const appHost = process.env.APP_HOST;
const image = process.env.IMAGE;
const instances = process.env.INSTANCES;
const namespace = process.env.NAMESPACE;
const serviceName = process.env.SERVICE_NAME;

if (!appHost || !image || !instances || !namespace || !serviceName) {
    console.error('missing params');
    process.exit(1);
}

const source = fs.readFileSync(`${__dirname}/../demo-container/k8s.hbs`, { encoding: 'UTF-8' });
const template = handlebars.compile(source);
const yaml = template({
    appHost,
    image,
    instances,
    namespace,
    serviceName,
});

process.stdout.write(yaml);
