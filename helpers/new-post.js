import fs from 'node:fs';
import { argv } from 'node:process';

const postName = argv[2];

console.log(`Creating a new post in ./src/arjlog named ${postName}.md`);
var pubDate =  new Date();

const boilerplate = `
---
title: ''
pubDate: ${pubDate.toISOString().substring(0,10)}
description: ''
tags: [""]
---

TODO
`;

fs.writeFile(`./src/arjlog/${postName}.md`, boilerplate, err => {
    if(err) {
        console.error(err);
    } else {
        console.log('New post created');
    }
});