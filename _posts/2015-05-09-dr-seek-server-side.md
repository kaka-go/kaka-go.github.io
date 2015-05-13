---
layout: post
title: Develop App Dr.Seek - Server Side
brief: App Dr.Seek(贴心医生) Server side architecture in brief <img src="/public/img/drseek-server-architect.jpg"/>
---

Dr.Seek(贴心医生) is an app for bringing smooth comunication between doctor and patient, make the efficient treatment possible.<br>

As the server side engineer of this app, I am going to share my experience of the development.

### Server Architecture

<a href="/public/img/drseek-server-architect.jpg" data-lightbox="Server-Architecture" data-title="Application Server Architecture">
	<img src="/public/img/drseek-server-architect.jpg" alt="Server-Architecture"/>
</a>

Nginx is used as a reverse proxy to redirect the HTTP request to Tomcat servers.

The Spring Web Project will always be packaged as WAR and depolyed on multi-Tomcat servers. 
To quick test the new features and fix bugs, the project is automatically packaged to WAR and deployed to the test server when SVN `hooks/post-commit`,
When everything seems OK, go on deploying to the release servers.

To increase the speed to access data, `mybatis-redis` is integrated to cache the database results.
MySQL Database are configurated as Master-slave Replication, because the read/write may always > 1.
(Here we didn't use redis to share sticky session, although there is `Redis-Session-Manager` for Tomcat, for we have config `ip_hash` in Nginx) 

Case History is one of important features in the app. Medical record and treatment report may not have the same format. 
Data Models should have flexible schema, so we choose MongoDB to save this kinds of documents.

Inspired by talking with an engineer of momo, we use `openfire` as RTC server for instant messaging.
It's open source and extensible, and we can customize suitable plugins for our purpose, such as sending voice, images, case history and other kinds of attachements in message.
(NG: When there are more than 2000 people in one's contact book, it may cause uncompletely transfer problem.) 

Users can upload images and attachments to Web Server. 
Web server handles the upload files, copy them to File Server, and store URL mapping into DB. 
(To avoid uploading duplicated file, check existance on server by MD5 checksum for the file before upload)

### About the App

<img src="/public/img/drseek-icon.png" width="64px"/>

[Home Page <i class="fa fa-link"></i>](http://www.tiexinyisheng.com)<br>
[App Store <i class="fa fa-link"></i>](https://itunes.apple.com/us/app/tie-xin-yi-sheng/id934643717?mt=8)

